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

function sleepMs(ms) {
  spawnSync("sleep", [String(Math.max(1, Math.ceil(ms / 1000)))], { stdio: "ignore" });
}

function runGh(args, options = {}) {
  const result = spawnSync("gh", args, {
    cwd: options.cwd || rootDir,
    stdio: options.stdio || "pipe",
    encoding: "utf8",
    env: options.env || process.env,
  });
  return {
    ok: (result.status ?? 1) === 0,
    status: result.status ?? 1,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
  };
}

function isTransientGhError(stderr) {
  const text = String(stderr || "").toLowerCase();
  return (
    text.includes("error connecting") ||
    text.includes("timeout") ||
    text.includes("temporarily unavailable") ||
    text.includes("connection reset") ||
    text.includes("tls handshake") ||
    text.includes("i/o timeout") ||
    text.includes("network is unreachable") ||
    text.includes("http 5")
  );
}

function runGhWithRetry(args, { attempts = 5, label = "gh" } = {}) {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = runGh(args, { stdio: "pipe" });
    if (result.ok) return result;

    lastError = result.stderr || result.stdout || `${label} failed`;
    const retryable = isTransientGhError(lastError);
    if (!retryable || attempt === attempts) {
      throw new Error(`${label} failed: ${lastError}`);
    }

    const waitMs = Math.min(30_000, 2_000 * 2 ** (attempt - 1));
    console.warn(
      `  ${label}: transient GitHub API error (attempt ${attempt}/${attempts}); retrying in ${Math.round(waitMs / 1000)}s ...`,
    );
    console.warn(`  ${lastError}`);
    sleepMs(waitMs);
  }
  throw new Error(`${label} failed: ${lastError}`);
}

function releaseExists(repo, tag) {
  const result = runGh(["release", "view", tag, "--repo", repo], { stdio: "pipe" });
  return result.ok;
}

function uploadApkRelease(apkFile, version) {
  ensureGh();
  const repo = `${APP_UPDATE_REPO.repoOwner}/${APP_UPDATE_REPO.repoName}`;
  const tag = version.releaseTag;
  const title = `Android APK ${version.versionName} (${version.versionCode})`;
  const notes = `Market Prices Android APK\n\n- versionName: ${version.versionName}\n- versionCode: ${version.versionCode}`;

  console.log(`Uploading APK to GitHub release ${repo}@${tag} ...`);

  // Prefer in-place asset replace over delete+create so a flaky upload cannot
  // leave the release missing after a successful delete.
  if (releaseExists(repo, tag)) {
    runGhWithRetry(
      ["release", "upload", tag, apkFile, "--repo", repo, "--clobber"],
      { label: "gh release upload" },
    );
    runGhWithRetry(
      ["release", "edit", tag, "--repo", repo, "--title", title, "--notes", notes],
      { label: "gh release edit" },
    );
  } else {
    runGhWithRetry(
      [
        "release",
        "create",
        tag,
        apkFile,
        "--repo",
        repo,
        "--title",
        title,
        "--notes",
        notes,
      ],
      { label: "gh release create" },
    );
  }

  console.log(`  uploaded: https://github.com/${repo}/releases/download/${tag}/market-prices.apk`);
}

function publishApkMetadata(version, sha256, apkSizeBytes) {
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
  const releaseApk = path.join(releaseDir, "market-prices.apk");
  const rootApk = path.join(rootDir, "market-prices.apk");

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

  // Publish APK on main for raw.githubusercontent.com downloads (avoids Releases CDN redirects).
  if (!fs.existsSync(apkPath)) {
    throw new Error(`APK not found for metadata publish: ${apkPath}`);
  }
  fs.copyFileSync(apkPath, releaseApk);
  fs.copyFileSync(apkPath, rootApk);

  const sealed = readMarketPricesAppVersion(sealedVersionSource);
  const payload = {
    ...sealed,
    apkVersionCode: version.versionCode,
    apkVersionName: version.versionName,
    apkUrl: getAndroidApkDownloadUrl(version),
    apkSha256: sha256,
    apkSizeBytes: Number(apkSizeBytes) || fs.statSync(apkPath).size,
  };

  const versionJsonPaths = [
    path.join(rootDir, "market-prices-app-version.json"),
    path.join(rootDir, "dist/market-prices-app-version.json"),
    path.join(releaseDir, "market-prices-app-version.json"),
  ];

  writeAppVersionPayload(versionJsonPaths, payload);
  console.log(`  published version stamp builtAt=${payload.builtAt} (preserved from APK assets)`);
  console.log(`  apkUrl: ${payload.apkUrl}`);

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
    "market-prices.apk",
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

function commitRootApkVersion(version) {
  const relPath = "scripts/android-apk-version.json";
  const status = spawnSync("git", ["status", "--porcelain", relPath], {
    cwd: rootDir,
    encoding: "utf8",
  });
  if ((status.stdout || "").trim()) {
    run("git", ["add", relPath], { cwd: rootDir });
    run("git", ["commit", "-m", `Bump Android APK version to ${version.versionName} (code ${version.versionCode}).`], {
      cwd: rootDir,
    });
    run("git", ["push", "-u", "origin", "HEAD"], { cwd: rootDir });
    console.log("Pushed scripts/android-apk-version.json to origin/main");
  }
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
  const apkSizeBytes = fs.statSync(apkPath).size;
  console.log(`  sha256: ${sha256}`);
  console.log(`  size  : ${apkSizeBytes}`);
  console.log(`  url   : ${getAndroidApkDownloadUrl(version)}`);

  if (!args.noUpload) {
    uploadApkRelease(apkPath, version);
  } else {
    console.log("Skipped GitHub upload (--no-upload).");
  }

  publishApkMetadata(version, sha256, apkSizeBytes);
  if (!args.noBump) {
    commitRootApkVersion(version);
  }

  console.log("");
  console.log("Done.");
  console.log("Users on older APK builds will get an in-app full APK update prompt.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
