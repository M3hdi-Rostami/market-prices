import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAndroidApkDownloadUrl, getAndroidApkVersion } from "./android-apk-version.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");

/** GitHub repo that hosts raw market-prices-app-version.json for in-app updates. */
export const APP_UPDATE_REPO = {
  repoOwner: "M3hdi-Rostami",
  repoName: "market-prices",
  branch: "main",
};

export function getMarketPricesAppVersion() {
  const apk = getAndroidApkVersion();
  if (apk.versionName) return apk.versionName;

  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      if (pkg.version) return String(pkg.version);
    } catch {
      // fall through
    }
  }

  return "1.0.0";
}

export function buildMarketPricesAppVersionPayload(extra = {}) {
  const apk = getAndroidApkVersion();
  return {
    version: getMarketPricesAppVersion(),
    builtAt: new Date().toISOString(),
    apkVersionCode: apk.versionCode,
    apkVersionName: apk.versionName,
    apkUrl: getAndroidApkDownloadUrl(apk),
    ...extra,
  };
}

export function writeMarketPricesAppVersion(outputPaths, extra = {}) {
  const json = `${JSON.stringify(buildMarketPricesAppVersionPayload(extra), null, 2)}\n`;
  for (const outputPath of outputPaths) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, json, "utf8");
  }
  return json;
}
