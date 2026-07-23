import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JavaScriptObfuscator from "javascript-obfuscator";
import { androidUpdateBridgeScript, pageStyles as basePageStyles, standaloneUiScript as baseStandaloneUiScript } from "./market-prices-page-shell.mjs";
import { updateSheetExtraStyles } from "./market-prices-update-bridge.mjs";
import {
  androidExtraStyles,
  androidPageBody,
  patchStandaloneUiScript,
} from "./market-prices-android-ui.mjs";
import {
  APP_UPDATE_REPO,
  getMarketPricesAppVersion,
  writeMarketPricesAppVersion,
} from "./market-prices-app-version.mjs";
import { fetchCarPricesData } from "./fetch-car-prices-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const extensionLogicPath = path.join(rootDir, "tools/market-prices/js/index.js");
const distDir = path.join(rootDir, "dist");
const outputPaths = [
  path.join(rootDir, "market-prices.html"),
  path.join(distDir, "market-prices.html"),
];
const carPricesOutputPaths = [
  path.join(rootDir, "car-prices.json"),
  path.join(distDir, "car-prices.json"),
];

const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  reservedStrings: [
    "__onAppUpdateCheckComplete",
    "__onAppUpdateComplete",
    "checkForAppUpdate",
    "setUpdateSheetOpen",
    "startAppUpdate",
    "httpGet",
    "__error",
    "car-prices.json",
    "ANDROID_CAR_PRICES_CACHE",
    "getContentVersion",
    "updateSheetOverlay",
    "updateSheetBackdrop",
    "updateSheetMessage",
    "updateSheetConfirmBtn",
    "updateSheetProgress",
    "updateSheetProgressFill",
    "updateSheetProgressLabel",
    "updateSheetProgressPercent",
    "__onAppUpdateProgress",
    "__startAppUpdateFromSheet",
    "market-prices-play-update-success",
    "apkVersionCode",
    "apkVersionName",
    "apkUrl",
    "apkSha256",
    "updateKind",
    "awaitingInstall",
    "getAppVersionCode",
    "shareImage",
    "price-hero-share-btn",
    "price-hero-card-actions",
    "market-share-btn",
    "sharePricesBtn",
    "market-share-prices-btn",
    "shareMarketPricesCard",
    "buildMarketPricesShareCard",
    "SHARE_CARD_ITEMS",
    "price_dollar_rl",
    "crypto-tether-irr",
    "geram18",
    "sekee",
    "REQUEST_INSTALL_PACKAGES",
    "canRequestPackageInstalls",
  ],
  reservedNames: [
    "^loadingEl$",
    "^errorEl$",
    "^listEl$",
    "^lastUpdateEl$",
    "^errorMsgEl$",
    "^refreshBtn$",
    "^retryBtn$",
    "^refreshIcon$",
    "^currentYearEl$",
    "^refreshTimer$",
    "^fetchPrices$",
    "^renderPrices$",
    "^FEATURED_ITEMS$",
    "^OTHER_ITEMS$",
    "^CURRENCY_ITEMS$",
    "^GOLD_ITEMS$",
    "^ALERT_WATCH_ITEMS$",
    "^PRICE_ALERTS_STORAGE_KEY$",
    "^PREVIOUS_PRICES_STORAGE_KEY$",
    "^DEFAULT_ALERT_THRESHOLD$",
    "^CURRENCY_HERO_KEY$",
    "^GOLD_HERO_KEY$",
    "^PRICES_API_URL$",
    "^APP_UPDATE_CONFIG$",
    "^AndroidApp$",
    "^httpGet$",
    "^fetchBamaPricePage$",
    "^fetchBamaCarPrices$",
    "^fetchBamaCarPricesLive$",
    "^fetchAndroidCarPricesCache$",
    "^ANDROID_CAR_PRICES_CACHE$",
    "^__onAppUpdateComplete$",
    "^__onAppUpdateCheckComplete$",
    "^__onAppUpdateProgress$",
    "^__startAppUpdateFromSheet$",
    "^initAppUpdater$",
    "^initUpdatePrompt$",
    "^formatPersianDateTime$",
    "^tickCurrentDateTime$",
    "^currentDateTimeEl$",
    "^currentDateTimeTimer$",
    "^UPDATE_CHECK_INTERVAL_MS$",
    "^UPDATE_SHEET_DISMISSED_KEY$",
    "^getAppVersionCode$",
    "^shareMarketPricesCard$",
    "^buildMarketPricesShareCard$",
    "^SHARE_CARD_BRAND$",
  ],
};

function dedentBlock(block) {
  return block.replace(/^  /gm, "");
}

function extractFunctionBlock(source, functionName, nextFunctionName) {
  const start = source.indexOf(`  function ${functionName}`);
  const end = source.indexOf(`  function ${nextFunctionName}`, start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not extract ${functionName} from extension logic`);
  }
  return dedentBlock(source.slice(start, end).trim());
}

function extractExtensionLogic(extensionSource) {
  const constantsEnd = extensionSource.indexOf("let pricesRefreshTimer");
  const constants = extensionSource.slice(0, constantsEnd).trim();

  const carLogicStart = extensionSource.indexOf("function formatCarPrice");
  const carLogicEnd = extensionSource.indexOf("function formatPersianDateTime");
  const carLogic = extensionSource.slice(carLogicStart, carLogicEnd).trim();

  const coreLogic = extractFunctionBlock(
    extensionSource,
    "parseNumber",
    "createRealGoldCard",
  );
  const coinGoldLogic = extractFunctionBlock(
    extensionSource,
    "calculateCoinGoldRatio",
    "createGoldWageCard",
  );

  return `${constants}\n\n${carLogic}\n\n${coreLogic}\n\n${coinGoldLogic}`;
}

function buildPageHtml(syncedLogic, carPricesCache) {
  const updateConfig = JSON.stringify({
    ...APP_UPDATE_REPO,
    currentVersion: getMarketPricesAppVersion(),
  });
  const standaloneUiScript = patchStandaloneUiScript(baseStandaloneUiScript);
  const pageStyles = `${basePageStyles}${androidExtraStyles}${updateSheetExtraStyles}`;
  const pageBody = androidPageBody;
  const cacheLiteral = JSON.stringify(carPricesCache);
  const scriptBody = `const APP_UPDATE_CONFIG = ${updateConfig};\nconst ANDROID_CAR_PRICES_CACHE = ${cacheLiteral};\n\n${syncedLogic}\n\n${standaloneUiScript}`;

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#111621">
  <title>قیمت طلا و دلار</title>
  <script>
    (function () {
      try {
        var theme = localStorage.getItem("market-prices-theme") === "light" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.style.colorScheme = theme;
      } catch (e) {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    })();
  </script>
  <style>
${pageStyles}
  </style>
</head>
<body>
${pageBody}
  <script>
${scriptBody}
  </script>
  <script>
${androidUpdateBridgeScript}
  </script>
</body>
</html>`;
}

function obfuscateScript(html) {
  const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  if (matches.length < 2) throw new Error("Expected main logic and Android bridge script tags in market prices page.");

  const mainScriptMatch = matches[matches.length - 2];
  const obfuscated = JavaScriptObfuscator.obfuscate(mainScriptMatch[1], OBFUSCATOR_OPTIONS).getObfuscatedCode();
  return html.replace(mainScriptMatch[0], `<script>\n${obfuscated}\n</script>`);
}

function minifyHtml(html) {
  const parts = html.split(/(<script>[\s\S]*?<\/script>)/);

  return parts
    .map((part) => {
      if (part.startsWith("<script>")) return part;
      return part.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><");
    })
    .join("")
    .trim();
}

export async function buildMarketPricesPage() {
  if (!fs.existsSync(extensionLogicPath)) {
    throw new Error(`Missing extension logic: ${extensionLogicPath}`);
  }

  console.log("  fetching car prices from bama.ir ...");
  const carPricesCache = await fetchCarPricesData();
  const carPricesJson = `${JSON.stringify(carPricesCache, null, 2)}\n`;

  for (const outputPath of carPricesOutputPaths) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, carPricesJson, "utf8");
    console.log(`  car prices: ${path.relative(rootDir, outputPath)}`);
  }

  const extensionSource = fs.readFileSync(extensionLogicPath, "utf8");
  const syncedLogic = extractExtensionLogic(extensionSource);
  const mergedHtml = buildPageHtml(syncedLogic, carPricesCache);
  const obfuscatedHtml = obfuscateScript(mergedHtml);
  const banner = "<!-- Generated by npm run build — do not edit market-prices.html directly. -->\n";
  const output = banner + minifyHtml(obfuscatedHtml);

  for (const outputPath of outputPaths) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`  market page: ${path.relative(rootDir, outputPath)}`);
  }

  writeMarketPricesAppVersion([
    path.join(rootDir, "market-prices-app-version.json"),
    path.join(distDir, "market-prices-app-version.json"),
  ]);
  console.log(`  market version: market-prices-app-version.json`);

  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildMarketPricesPage().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
