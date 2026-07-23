import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildMarketPricesPage } from "./build-market-prices-page.mjs";
import { writeMarketPricesAppVersion } from "./market-prices-app-version.mjs";
import { injectApkVersionIntoGradle } from "./android-apk-version.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const androidDir = path.join(rootDir, "android");
const assetsDir = path.join(androidDir, "app/src/main/assets");
const assetHtmlPath = path.join(assetsDir, "market-prices.html");
const assetVersionPath = path.join(assetsDir, "market-prices-app-version.json");
const assetFontsDir = path.join(assetsDir, "fonts");
const sourceFontPath = path.join(rootDir, "assets/fonts/Vazir-FD.ttf");
const gradlew = path.join(androidDir, process.platform === "win32" ? "gradlew.bat" : "gradlew");
const bundledJdk = path.join(androidDir, ".tools/jdk-17");
const gradleHome = path.join(androidDir, ".tools/gradle-home");
const depsReadyMarker = path.join(gradleHome, ".deps-ready");
const globalGradleHome = path.join(process.env.HOME ?? "", ".gradle");
const releaseApkPath = path.join(androidDir, "app/build/outputs/apk/release/app-release.apk");
const outputApkPath = path.join(androidDir, "market-prices.apk");
const gradleTemplatePath = path.join(rootDir, "scripts/android-app-build.gradle.kts");
const appGradlePath = path.join(androidDir, "app/build.gradle.kts");
const keystorePropsPath = path.join(androidDir, "keystore.properties");
const androidSrcDir = path.join(rootDir, "scripts/android-src");
const androidJavaDest = path.join(androidDir, "app/src/main/java/ir/superextension/marketprices");
const androidManifestDest = path.join(androidDir, "app/src/main/AndroidManifest.xml");

function syncAndroidGradleTemplate() {
  if (!fs.existsSync(gradleTemplatePath)) return;
  const template = injectApkVersionIntoGradle(fs.readFileSync(gradleTemplatePath, "utf8"));
  const current = fs.existsSync(appGradlePath) ? fs.readFileSync(appGradlePath, "utf8") : "";
  if (current !== template) {
    fs.mkdirSync(path.dirname(appGradlePath), { recursive: true });
    fs.writeFileSync(appGradlePath, template, "utf8");
    console.log("  synced android/app/build.gradle.kts from scripts template");
  }
}

function syncAndroidSources() {
  const javaSrc = path.join(androidSrcDir, "java");
  const manifestSrc = path.join(androidSrcDir, "AndroidManifest.xml");
  if (!fs.existsSync(javaSrc) || !fs.existsSync(manifestSrc)) return;

  fs.mkdirSync(androidJavaDest, { recursive: true });
  for (const name of fs.readdirSync(javaSrc)) {
    if (!name.endsWith(".kt")) continue;
    fs.copyFileSync(path.join(javaSrc, name), path.join(androidJavaDest, name));
  }
  fs.copyFileSync(manifestSrc, androidManifestDest);
  console.log("  synced Android Kotlin sources + manifest from scripts/android-src");
}

function resolveApksigner() {
  const buildToolsRoot = path.join(androidDir, ".tools/android-sdk/build-tools");
  if (!fs.existsSync(buildToolsRoot)) return null;

  const versions = fs
    .readdirSync(buildToolsRoot)
    .filter((name) => /^\d/.test(name))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  for (const version of versions) {
    const candidate = path.join(buildToolsRoot, version, process.platform === "win32" ? "apksigner.bat" : "apksigner");
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

function inspectApkSignature(apkPath) {
  const apksigner = resolveApksigner();
  const javaHome = resolveJavaHome();
  if (!apksigner || !javaHome) {
    console.log("  signing: could not inspect APK certificate (apksigner/JDK missing)");
    return null;
  }

  const result = spawnSync(apksigner, ["verify", "--print-certs", apkPath], {
    env: {
      ...process.env,
      PATH: `${path.join(javaHome, "bin")}${path.delimiter}${process.env.PATH ?? ""}`,
    },
    encoding: "utf8",
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (result.status !== 0) {
    console.log("  signing: APK verification failed");
    if (output) console.log(`  ${output.split("\n")[0]}`);
    return null;
  }

  const certLine = output.split("\n").find((line) => line.includes("certificate DN:")) ?? "";
  const isDebug = certLine.includes("Android Debug");
  const mode = isDebug ? "debug (development only)" : "release";
  console.log(`  signing: ${mode}`);
  if (certLine) console.log(`  ${certLine.trim()}`);

  if (isDebug) {
    console.log("");
    console.log("  Tip: run npm run setup:apk-signing to create a release keystore.");
    console.log("  Release signing improves update consistency and store/Play Protect trust.");
  }

  return { isDebug, certLine };
}

function resolveJavaHome() {
  if (fs.existsSync(bundledJdk)) return bundledJdk;
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME;
  return null;
}

async function copyHtmlToAssets() {
  await buildMarketPricesPage();
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.copyFileSync(path.join(rootDir, "market-prices.html"), assetHtmlPath);
  writeMarketPricesAppVersion([assetVersionPath]);

  if (!fs.existsSync(sourceFontPath)) {
    throw new Error(`Missing Vazir font for Android assets: ${sourceFontPath}`);
  }
  fs.mkdirSync(assetFontsDir, { recursive: true });
  fs.copyFileSync(sourceFontPath, path.join(assetFontsDir, "Vazir-FD.ttf"));
}

function runGradle(task, { offline = false } = {}) {
  const javaHome = resolveJavaHome();
  if (!javaHome) {
    throw new Error("JAVA_HOME not set and bundled JDK not found in android/.tools/jdk-17");
  }

  fs.mkdirSync(gradleHome, { recursive: true });

  const args = [task, "--no-daemon"];
  if (offline) args.push("--offline");

  const result = spawnSync(gradlew, args, {
    cwd: androidDir,
    env: {
      ...process.env,
      JAVA_HOME: javaHome,
      GRADLE_USER_HOME: gradleHome,
    },
    stdio: "inherit",
  });

  return result.status ?? 1;
}

function seedGradleHomeFromGlobalCache() {
  if (fs.existsSync(depsReadyMarker)) return;

  const globalCaches = path.join(globalGradleHome, "caches");
  const globalWrapper = path.join(globalGradleHome, "wrapper");
  if (!fs.existsSync(globalCaches)) return;

  console.log("Seeding local Gradle cache from ~/.gradle ...");
  fs.mkdirSync(path.join(gradleHome, "caches"), { recursive: true });
  fs.cpSync(globalCaches, path.join(gradleHome, "caches"), { recursive: true, force: true });

  if (fs.existsSync(globalWrapper)) {
    fs.mkdirSync(path.join(gradleHome, "wrapper"), { recursive: true });
    fs.cpSync(globalWrapper, path.join(gradleHome, "wrapper"), { recursive: true, force: true });
  }
}

function buildApkWithGradle() {
  fs.mkdirSync(gradleHome, { recursive: true });
  seedGradleHomeFromGlobalCache();

  if (fs.existsSync(depsReadyMarker)) {
    console.log("Using cached Gradle dependencies (offline) ...");
    const offlineStatus = runGradle("assembleRelease", { offline: true });
    if (offlineStatus === 0) return;
    console.log("Offline build failed, retrying with network ...");
  }

  const onlineStatus = runGradle("assembleRelease");
  if (onlineStatus !== 0) {
    throw new Error(
      "Gradle assembleRelease failed.\n" +
        "Gradle could not download Android build tools (often blocked in Iran).\n" +
        "Try one of these:\n" +
        "  1. Turn on VPN and run: npm run build:apk\n" +
        "  2. Run once: bash scripts/bootstrap-android-deps.sh\n" +
        "After the first successful build, later builds work offline.",
    );
  }

  fs.writeFileSync(depsReadyMarker, new Date().toISOString(), "utf8");
}

export async function buildMarketPricesApk() {
  if (!fs.existsSync(androidDir)) {
    throw new Error(`Android project not found: ${androidDir}`);
  }
  if (!fs.existsSync(gradlew)) {
    throw new Error(`Gradle wrapper not found: ${gradlew}`);
  }

  syncAndroidGradleTemplate();
  syncAndroidSources();

  if (!fs.existsSync(keystorePropsPath)) {
    console.log("");
    console.log("No android/keystore.properties found — release APK will use debug signing.");
    console.log("For production builds run: npm run setup:apk-signing");
    console.log("");
  }

  console.log("Building market-prices.html for Android assets ...");
  await copyHtmlToAssets();

  console.log("");
  console.log("Building Android APK ...");
  buildApkWithGradle();

  if (!fs.existsSync(releaseApkPath)) {
    throw new Error(`Release APK not found: ${releaseApkPath}`);
  }

  fs.mkdirSync(path.dirname(outputApkPath), { recursive: true });
  fs.copyFileSync(releaseApkPath, outputApkPath);
  console.log(`  apk: ${path.relative(rootDir, outputApkPath)}`);
  inspectApkSignature(outputApkPath);

  return outputApkPath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildMarketPricesApk().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
