#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  bumpAndroidApkVersion,
  getAndroidApkDownloadUrl,
  getAndroidApkVersion,
  sha256File,
} from "./android-apk-version.mjs";
import {
  APP_UPDATE_REPO,
  readMarketPricesAppVersion,
  writeAppVersionPayload,
} from "./market-prices-app-version.mjs";
import {
  RELEASE_DIR_NAME,
  ensureReleaseRepo,
  getReleaseRemoteUrl,
  releaseDir,
  rootDir,
  runGit,
} from "./release-repo-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apkPath = path.join(rootDir, "android/market-prices.apk");

function parseArgs(argv) {
  const flags = new Set();
  for (const arg of argv) {
    if (arg === "--no-bump") flags.add("noBump");
    if (arg === "--no-upload") flags.add("noUpload");
    if (arg === "--no-push") flags.add("noPush");
    if (arg === "--no-build") flags.add("noBuild");
  }
  return {
    noBump: flags.has("noBump"),
    noUpload: flags.has("noUpload"),
    noPush: flags.has("noPush"),
    noBuild: flags.has("noBuild"),
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || rootDir,
    stdio: options.stdio || "inherit",
    encoding: "utf8",
    env: options.env || process.env,
  });
  if ((result.status ?? 1) !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
  return result;
}

function ensureGh() {
  const result = spawnSync("gh", ["--version"], { encoding: "utf8" });
  if ((result.status ?? 1) !== 0) {
    throw new Error("GitHub CLI (gh) is required. Install it and run: gh auth login");
  }
}

function uploadApkRelease(apkFile, version) {
  ensureGh();
  const repo = `${APP_UPDATE_REPO.repoOwner}/${APP_UPDATE_REPO.repoName}`;
  const tag = version.releaseTag;
  const title = `Android APK ${version.versionName} (${version.versionCode})`;

  console.log(`Uploading APK to GitHub release ${repo}@${tag} ...`);

  spawnSync("gh", ["release", "delete", tag, "--repo", repo, "--yes"], {
    cwd: rootDir,
    stdio: "ignore",
  });

  run("gh", [
    "release",
    "create",
    tag,
    apkFile,
    "--repo",
    repo,
    "--title",
    title,
    "--notes",
    `Market Prices Android APK\n\n- versionName: ${version.versionName}\n- versionCode: ${version.versionCode}`,
  ]);
}

function publishApkMetadata(version, sha256) {
  ensureReleaseRepo();

  const sealedAssetHtml = path.join(rootDir, "android/app/src/main/assets/market-prices.html");
  const sealedAssetVersion = path.join(
    rootDir,
    "android/app/src/main/assets/market-prices-app-version.json",
  );
  const sealedAssetFont = path.join(rootDir, "android/app/src/main/assets/fonts/Vazir-FD.ttf");
  const rootHtml = path.join(rootDir, "market-prices.html");
  const rootFont = path.join(rootDir, "assets/fonts/Vazir-FD.ttf");
  const rootVersion = path.join(rootDir, "market-prices-app-version.json");
  const releaseHtml = path.join(releaseDir, "market-prices.html");
  const releaseFontDir = path.join(releaseDir, "fonts");
  const releaseFont = path.join(releaseFontDir, "Vazir-FD.ttf");

  // Prefer the exact HTML/version sealed into the APK so remote content stamp
  // matches what the new APK already ships (avoids a second "content update" popup).
  const htmlSource = fs.existsSync(sealedAssetHtml) ? sealedAssetHtml : rootHtml;
  const fontSource = fs.existsSync(sealedAssetFont) ? sealedAssetFont : rootFont;
  const sealedVersionSource = fs.existsSync(sealedAssetVersion)
    ? sealedAssetVersion
    : rootVersion;

  if (!fs.existsSync(sealedVersionSource)) {
    throw new Error(
      `Sealed app version JSON not found. Build the APK first (${sealedAssetVersion}).`,
    );
  }

  if (fs.existsSync(htmlSource)) {
    fs.copyFileSync(htmlSource, releaseHtml);
    if (htmlSource !== rootHtml) {
      fs.copyFileSync(htmlSource, rootHtml);
    }
  }
  if (fs.existsSync(fontSource)) {
    fs.mkdirSync(releaseFontDir, { recursive: true });
    fs.copyFileSync(fontSource, releaseFont);
  }

  const sealed = readMarketPricesAppVersion(sealedVersionSource);
  const payload = {
    ...sealed,
    apkVersionCode: version.versionCode,
    apkVersionName: version.versionName,
    apkUrl: getAndroidApkDownloadUrl(version),
    apkSha256: sha256,
  };

  const versionJsonPaths = [
    path.join(rootDir, "market-prices-app-version.json"),
    path.join(rootDir, "dist/market-prices-app-version.json"),
    path.join(releaseDir, "market-prices-app-version.json"),
  ];

  writeAppVersionPayload(versionJsonPaths, payload);
  console.log(`  published version stamp builtAt=${payload.builtAt} (preserved from APK assets)`);

  if (!getReleaseRemoteUrl() && !process.argv.includes("--no-push")) {
    console.warn(`No git remote in ${RELEASE_DIR_NAME}/ — metadata committed locally only.`);
  }

  // Force-add: these generated assets are gitignored in the source tree but must
  // be published on main for in-app update checks (raw.githubusercontent.com).
  runGit([
    "add",
    "-f",
    "market-prices-app-version.json",
    "market-prices.html",
    "fonts/Vazir-FD.ttf",
  ]);

  // Remove legacy offline car-prices cache if it was previously published.
  const releaseCarPrices = path.join(releaseDir, "car-prices.json");
  if (fs.existsSync(releaseCarPrices)) {
    fs.unlinkSync(releaseCarPrices);
    try {
      runGit(["rm", "-f", "car-prices.json"], { quiet: true });
    } catch {
      // File may already be untracked.
    }
  }

  const pending = runGit(["status", "--porcelain"], { quiet: true });
  if (!pending) {
    console.log("No metadata/content changes to commit in release repo.");
    return;
  }

  runGit([
    "commit",
    "-m",
    `Publish Android APK ${version.versionName} (code ${version.versionCode}).`,
  ]);

  if (process.argv.includes("--no-push")) {
    console.log("Metadata committed locally (--no-push).");
    return;
  }

  if (!getReleaseRemoteUrl()) return;

  const branch = runGit(["branch", "--show-current"], { quiet: true }) || APP_UPDATE_REPO.branch;
  runGit(["push", "-u", "origin", branch]);
  console.log(`Pushed APK metadata + HTML to origin/${branch}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.noBump) {
    const { previous, next } = bumpAndroidApkVersion();
    console.log(`APK version: ${previous.versionName} (${previous.versionCode}) → ${next.versionName} (${next.versionCode})`);
  } else {
    const current = getAndroidApkVersion();
    console.log(`APK version (no bump): ${current.versionName} (${current.versionCode})`);
  }

  const version = getAndroidApkVersion();

  if (!args.noBuild) {
    console.log("");
    console.log("Building signed APK ...");
    run("node", ["scripts/build-market-prices-apk.mjs"]);
  }

  if (!fs.existsSync(apkPath)) {
    throw new Error(`APK not found: ${apkPath}`);
  }

  const sha256 = sha256File(apkPath);
  console.log(`  sha256: ${sha256}`);
  console.log(`  url   : ${getAndroidApkDownloadUrl(version)}`);

  if (!args.noUpload) {
    uploadApkRelease(apkPath, version);
  } else {
    console.log("Skipped GitHub upload (--no-upload).");
  }

  publishApkMetadata(version, sha256);

  console.log("");
  console.log("Done.");
  console.log("Users on older APK builds will get an in-app full APK update prompt.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
