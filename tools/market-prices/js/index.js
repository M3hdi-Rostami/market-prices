const ESTJT_AJAX_URL = "https://www.estjt.ir/wp-admin/admin-ajax.php";
const ESTJT_SITE_ORIGIN = "https://www.estjt.ir";
const ESTJT_PRICE_POST_BODY = "action=new_price";

const ISIGNAL_SIGNAL_DATA_URL = "https://signalpardazgroup.com/service/signalData@4.0.0/list";
const ISIGNAL_SITE_ORIGIN = "https://isignal.ir";
/** Currency/crypto/oil — gold & coin come from estjt.ir */
const ISIGNAL_SIGNAL_DATA_FILTERS = [
  { filterName: "freeCurrency", market: "currency" },
  { filterName: "oil", market: "oil" },
  {
    filterName: "home_site_pwa",
    processFn: [{ name: "normalizeForSite" }, { name: "sortMarket" }],
  },
];

const ESTJT_ROW_NAME_TO_KEY = {
  "انس طلا": "ons",
  "مظنه تهران": "mesghal",
  "طلا ۱۸ عیار": "geram18",
  "طلای ۱۸ عیار": "geram18",
  "طلا ۲۴ عیار": "geram24",
  "طلای ۲۴ عیار": "geram24",
  "سکه طرح جدید": "sekee",
  "سکه طرح قدیم": "sekeb",
  "نیم سکه": "nim",
  "ربع سکه": "rob",
  "سکه گرمی": "seke_gerami",
};

const ISIGNAL_SIGNAL_DATA_POST_BODY = JSON.stringify(ISIGNAL_SIGNAL_DATA_FILTERS);
const TGJU_AJAX_URL = "https://call4.tgju.org/ajax.json";
const BAMA_PRICE_API_URL = "https://bama.ir/cad/api/price/hierarchy";
const BAMA_PAGE_SIZE = 100;

const REAL_GOLD_DIVISOR = 41.4713;
const REAL_GOLD_DIFF_THRESHOLD = 500_000;
const COIN_GOLD_RATIO_BUY_COIN = 9.5;
const COIN_GOLD_RATIO_BUY_MELTED = 11.5;
const COIN_GOLD_RATIO_NEAR_THRESHOLD = 0.5;
const GOLD_WAGE_STORAGE_KEY = "market-prices-gold-wage";
const GOLD_SELLER_STORAGE_KEY = "market-prices-gold-seller";
const PRICE_ALERTS_STORAGE_KEY = "market-prices-alerts";
const PREVIOUS_PRICES_STORAGE_KEY = "market-prices-previous";
const DEFAULT_ALERT_THRESHOLD = 1;

const CURRENCY_HERO_KEY = "price_dollar_rl";
const GOLD_HERO_KEY = "geram18";

const CURRENCY_ITEMS = [
  { key: "price_dollar_rl", title: "دلار", unit: "تومان", icon: "💵", hero: true },
  { key: "crypto-tether-irr", title: "تتر", unit: "تومان", icon: "₮" },
  { key: "crypto-bitcoin-irr", title: "بیت کوین", unit: "تومان", icon: "₿" },
  { key: "oil_brent", title: "نفت برنت", unit: "دلار", icon: "🛢", global: true },
  { key: "price_eur", title: "یورو", unit: "تومان", icon: "💶" },
  { key: "price_gbp", title: "پوند", unit: "تومان", icon: "🇬🇧" },
  { key: "price_aed", title: "درهم", unit: "تومان", icon: "🇦🇪" },
  { key: "price_iqd", title: "دینار عراق", unit: "تومان", icon: "🇮🇶" },
  { key: "price_try", title: "لیر", unit: "تومان", icon: "🇹🇷" },
];

/** Same rows as estjt.ir homepage gold + coin tables (اتحادیه طلا تهران). Hero (۱۸ عیار) always first in UI. */
const GOLD_ITEMS = [
  { key: "geram18", title: "طلا ۱۸ عیار", unit: "تومان", icon: "🥇", hero: true },
  { key: "ons", title: "انس طلا", unit: "دلار", icon: "🌍", global: true },
  { key: "mesghal", title: "مظنه تهران", unit: "تومان", icon: "⚖️" },
  { key: "geram24", title: "طلای ۲۴ عیار", unit: "تومان", icon: "🥇" },
  { key: "sekee", title: "سکه طرح جدید", unit: "تومان", icon: "🪙" },
  { key: "sekeb", title: "سکه طرح قدیم", unit: "تومان", icon: "🪙" },
  { key: "nim", title: "نیم سکه", unit: "تومان", icon: "🪙" },
  { key: "rob", title: "ربع سکه", unit: "تومان", icon: "🪙" },
  { key: "seke_gerami", title: "سکه گرمی", unit: "تومان", icon: "🪙" },
];

const ALERT_WATCH_ITEMS = [
  { key: CURRENCY_HERO_KEY, title: "دلار", settingsKey: "price_dollar_rl" },
  { key: GOLD_HERO_KEY, title: "طلای ۱۸ عیار", settingsKey: "geram18" },
  { key: "sekee", title: "سکه طرح جدید", settingsKey: "sekee" },
];

const LAST_PRICES_STORAGE_KEY = "market-prices-last-current";
const LAST_PRICES_FETCHED_AT_KEY = "market-prices-last-fetched-at";
const LAST_CARS_STORAGE_KEY = "market-prices-last-cars";
const LAST_CARS_FETCHED_AT_KEY = "market-prices-last-cars-fetched-at";

const ISIGNAL_UNIQUE_TO_KEY = {
  geram18: "geram18",
  geram24: "geram24",
  mazanne: "mesghal",
  geramisilver: "silver_925",
  sekeemam: "sekee",
  sekebaharazadi: "sekeb",
  nim: "nim",
  rob: "rob",
  gold: "ons",
  usdollar: "price_dollar_rl",
  euro: "price_eur",
  gbpound: "price_gbp",
  uaederam: "price_aed",
  bankiqd: "price_iqd",
  turkeylira: "price_try",
  tether: "crypto-tether-irr",
  bitcoin: "crypto-bitcoin-irr",
  "brent-oil": "oil_brent",
};

const ISIGNAL_GLOBAL_PRICE_KEYS = new Set(["ons", "oil_brent"]);

/** Free-market rows inside API `freeCurrency.data` (not banknote/remittance/nima/sana). */
const ISIGNAL_FREE_CURRENCY_NAME_TO_KEY = {
  usDollar: "price_dollar_rl",
  euro: "price_eur",
  gbPound: "price_gbp",
  uaeDeram: "price_aed",
  bankIqd: "price_iqd",
  turkeyLira: "price_try",
};

const MOJ3_FUND_TGJU_CHANGE_KEYS = {
  ime_fund_ayar: "ime_fund_ayar",
};

function toMoj3TgjuPriceString(tomanValue, isGlobal) {
  const cleaned = String(tomanValue).replace(/,/g, "").trim();
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num === 0) return "";
  const sign = num < 0 ? "-" : "";
  const abs = Math.abs(num);
  if (isGlobal) {
    const raw = cleaned.replace(/-/g, "");
    if (raw.includes(".")) return sign + raw.replace(/^\+/, "");
    return sign + String(Math.round(abs));
  }
  return sign + String(Math.round(abs * 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseSignedPercent(pctRaw) {
  const raw = String(pctRaw || "").trim();
  if (!raw) return { dp: 0, dt: "" };

  const normalized = raw
    .replace(/[−–—]/g, "-")
    .replace(/٪|%/g, "")
    .replace(/,/g, "")
    .trim();

  let num = parseFloat(normalized.replace(/\+/g, ""));
  if (!Number.isFinite(num) || num === 0) return { dp: 0, dt: "" };

  if (normalized.includes("-") || raw.includes("−")) num = -Math.abs(num);
  else if (normalized.includes("+") || raw.includes("+")) num = Math.abs(num);

  const dt = num > 0 ? "high" : num < 0 ? "low" : "";
  return { dp: num, dt };
}

function getIsignalListSectionItems(payload, sectionKey) {
  const block = payload?.data?.[sectionKey];
  if (Array.isArray(block)) return block;
  if (block?.data && Array.isArray(block.data)) return block.data;
  return [];
}

/** API list items use `name`; home_site_pwa tiles use `unique`. */
function resolveIsignalMarketKey(item) {
  const rawId = item?.unique ?? item?.name;
  if (rawId == null || rawId === "") return null;
  const id = String(rawId);
  return ISIGNAL_UNIQUE_TO_KEY[id] ?? ISIGNAL_UNIQUE_TO_KEY[id.toLowerCase()] ?? null;
}

function isignalQuoteToTgjuEntry(quote, isGlobal) {
  const rawPrice = quote?.close ?? quote?.value;
  if (rawPrice == null || rawPrice === "") return null;

  const priceNum = Number(String(rawPrice).replace(/,/g, ""));
  if (!Number.isFinite(priceNum) || priceNum === 0) return null;

  const p = isGlobal
    ? toMoj3TgjuPriceString(priceNum, true)
    : toMoj3TgjuPriceString(priceNum / 10, false);

  const pct = Number(quote?.percentChange);
  const dp = Number.isFinite(pct) ? pct : 0;
  const dt = dp > 0 ? "high" : dp < 0 ? "low" : "";

  let d = "";
  if (quote?.change != null && quote.change !== "") {
    const changeNum = Number(String(quote.change).replace(/,/g, ""));
    if (Number.isFinite(changeNum) && changeNum !== 0) {
      d = isGlobal
        ? toMoj3TgjuPriceString(changeNum, true)
        : toMoj3TgjuPriceString(changeNum / 10, false);
    }
  }

  return {
    p,
    dp,
    dt,
    ...(d ? { d } : {}),
    ...(quote?.time ? { t: String(quote.time) } : {}),
  };
}

function isignalCryptoToTgjuEntry(item) {
  const rawPrice = item?.toomanPrice ?? item?.value;
  if (rawPrice == null || rawPrice === "") return null;

  const priceNum = Number(String(rawPrice).replace(/,/g, ""));
  if (!Number.isFinite(priceNum) || priceNum === 0) return null;

  const p = toMoj3TgjuPriceString(priceNum / 10, false);
  const pct = Number(item?.percentChgTooman ?? item?.percentChange);
  const dp = Number.isFinite(pct) ? pct : 0;
  const dt = dp > 0 ? "high" : dp < 0 ? "low" : "";

  let d = "";
  const rawChange = item?.chgTooman ?? item?.change;
  if (rawChange != null && rawChange !== "") {
    const changeNum = Number(String(rawChange).replace(/,/g, ""));
    if (Number.isFinite(changeNum) && changeNum !== 0) {
      d = toMoj3TgjuPriceString(changeNum / 10, false);
    }
  }

  return {
    p,
    dp,
    dt,
    ...(d ? { d } : {}),
    ...(item?.time ? { t: String(item.time) } : {}),
  };
}

function parseTgjuPriceNumber(value) {
  if (value == null) return NaN;
  return Number(String(value).replace(/,/g, ""));
}

function applyComputedGoldIntrinsic(current) {
  const onsData = current.ons;
  const dollarData = current.price_dollar_rl;
  if (!onsData?.p || !dollarData?.p) return;

  const ons = parseTgjuPriceNumber(onsData.p);
  const dollar = parseTgjuPriceNumber(dollarData.p) / 10;
  if (Number.isNaN(ons) || Number.isNaN(dollar)) return;

  const intrinsic18 = (ons * dollar) / REAL_GOLD_DIVISOR;
  const toEntry = (toman) => ({
    p: toMoj3TgjuPriceString(toman, false),
    dp: 0,
    dt: "",
  });

  current.gold_intrinsic_18 = toEntry(intrinsic18);
  current.gold_intrinsic_24 = toEntry(intrinsic18 * (24 / 18));
}

function signedDpFromTgjuItem(item) {
  const dp = Number(item?.dp);
  if (!Number.isFinite(dp) || dp === 0) return 0;
  if (item.dt === "low") return -Math.abs(dp);
  if (item.dt === "high") return Math.abs(dp);
  return dp;
}

function applyTgjuFundChanges(current, tgjuCurrent) {
  if (!current || !tgjuCurrent) return current;

  for (const [key, tgjuKey] of Object.entries(MOJ3_FUND_TGJU_CHANGE_KEYS)) {
    if (!current[key]) continue;
    const item = tgjuCurrent[tgjuKey];
    if (!item) continue;

    const dp = signedDpFromTgjuItem(item);
    current[key] = {
      ...current[key],
      dp,
      dt: dp > 0 ? "high" : dp < 0 ? "low" : "",
      ...(item.d ? { d: String(item.d) } : {}),
    };
  }

  return current;
}

function isTehranMarketHours() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tehran",
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    return hour >= 9 && hour < 17;
  } catch {
    return true;
  }
}

function cacheMarketPrices(current) {
  try {
    localStorage.setItem(LAST_PRICES_STORAGE_KEY, JSON.stringify(current));
    localStorage.setItem(LAST_PRICES_FETCHED_AT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function loadCachedMarketPrices() {
  try {
    const raw = localStorage.getItem(LAST_PRICES_STORAGE_KEY);
    const fetchedAt = Number(localStorage.getItem(LAST_PRICES_FETCHED_AT_KEY));
    if (!raw || !Number.isFinite(fetchedAt)) return null;
    return { current: JSON.parse(raw), fetchedAt };
  } catch {
    return null;
  }
}

function formatMinutesAgo(fetchedAt) {
  const mins = Math.max(1, Math.round((Date.now() - fetchedAt) / 60000));
  return `${mins.toLocaleString("fa-IR")} دقیقه پیش`;
}

function showPricesOfflineBanner(fetchedAt) {
  const el = document.getElementById("pricesOfflineBanner");
  if (!el || !fetchedAt) return;
  el.textContent = `آفلاین · آخرین بروزرسانی ${formatMinutesAgo(fetchedAt)}`;
  el.classList.remove("hidden");
}

function hidePricesOfflineBanner() {
  const el = document.getElementById("pricesOfflineBanner");
  if (el) el.classList.add("hidden");
}

function cacheCarPrices(rows) {
  try {
    localStorage.setItem(LAST_CARS_STORAGE_KEY, JSON.stringify(rows));
    localStorage.setItem(LAST_CARS_FETCHED_AT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function loadCachedCarPrices() {
  try {
    const raw = localStorage.getItem(LAST_CARS_STORAGE_KEY);
    const fetchedAt = Number(localStorage.getItem(LAST_CARS_FETCHED_AT_KEY));
    if (!raw || !Number.isFinite(fetchedAt)) return null;
    const rows = JSON.parse(raw);
    if (!Array.isArray(rows) || !rows.length) return null;
    return { rows, fetchedAt };
  } catch {
    return null;
  }
}

function showCarsOfflineBanner(fetchedAt) {
  const el = document.getElementById("carsOfflineBanner");
  if (!el || !fetchedAt) return;
  el.textContent = `آفلاین · آخرین بروزرسانی ${formatMinutesAgo(fetchedAt)}`;
  el.classList.remove("hidden");
}

function hideCarsOfflineBanner() {
  const el = document.getElementById("carsOfflineBanner");
  if (el) el.classList.add("hidden");
}

let pricesRefreshTimer = null;
let currentDateTimeTimer = null;

function formatCarPrice(price) {
  if (price == null) return "—";
  return price.toLocaleString("fa-IR");
}

function renderCarPriceChangeMarkup(diff, hasPrice) {
  if (!hasPrice || diff == null || Number.isNaN(Number(diff))) return "";

  const num = Number(diff);
  const direction = num > 0 ? "up" : num < 0 ? "down" : "flat";
  const arrow = num > 0 ? "▲" : num < 0 ? "▼" : "—";
  const value = Math.abs(num).toLocaleString("fa-IR", {
    maximumFractionDigits: 2,
  });

  return `<span class="car-price-chip-change is-${direction}">${arrow} ${value}٪</span>`;
}

function buildCarTitle(row) {
  return [row.brandFa, row.modelFa].filter(Boolean).join(" ");
}

function buildCarSubtitle(row) {
  const parts = [];
  if (row.trimFa) parts.push(row.trimFa);
  parts.push(String(row.modelYear));
  if (row.className) parts.push(row.className);
  return parts.join(" · ");
}

function createCarPriceCard(row) {
  const card = document.createElement("article");
  card.className = "car-price-card";
  const subtitle = buildCarSubtitle(row);

  card.innerHTML = `
    <div class="car-price-card-header">
      <h3 class="car-price-card-title">${buildCarTitle(row)}</h3>
      ${subtitle ? `<p class="car-price-card-subtitle">${subtitle}</p>` : ""}
    </div>
    <div class="car-price-card-prices">
      <div class="car-price-chip">
        <div class="car-price-chip-top">
          <span class="car-price-chip-label">کارخانه</span>
          ${renderCarPriceChangeMarkup(row.factoryPriceDiff, row.factoryPrice != null)}
        </div>
        <span class="car-price-chip-value${row.factoryPrice == null ? " is-empty" : ""}">${formatCarPrice(row.factoryPrice)}</span>
        <span class="car-price-chip-unit">تومان</span>
      </div>
      <div class="car-price-chip car-price-chip-market">
        <div class="car-price-chip-top">
          <span class="car-price-chip-label">بازار</span>
          ${renderCarPriceChangeMarkup(row.marketPriceDiff, row.marketPrice != null)}
        </div>
        <span class="car-price-chip-value${row.marketPrice == null ? " is-empty" : ""}">${formatCarPrice(row.marketPrice)}</span>
        <span class="car-price-chip-unit">تومان</span>
      </div>
    </div>
  `;

  return card;
}

function buildCarVariantKey(item) {
  return [
    item.brand,
    item.model,
    item.trim,
    item.model_year,
    item.class || "",
  ].join("|");
}

function mergeIranianCarItems(items) {
  const map = new Map();

  for (const item of items) {
    if (item.manufacture_type?.value !== "Iranian") continue;

    const key = buildCarVariantKey(item);
    if (!map.has(key)) {
      map.set(key, {
        brandFa: item.brand_fa,
        modelFa: item.model_fa,
        trimFa: item.trim_fa,
        modelYear: item.model_year,
        className: item.class,
        factoryPrice: null,
        marketPrice: null,
        factoryPriceDiff: null,
        marketPriceDiff: null,
      });
    }

    const row = map.get(key);
    const priceType = item.price_type?.value;

    if (priceType === "FactoryPrice") {
      row.factoryPrice = item.price;
      row.factoryPriceDiff = item.price_diff;
    } else if (priceType === "MarketPrice") {
      row.marketPrice = item.price;
      row.marketPriceDiff = item.price_diff;
    }
  }

  return [...map.values()]
    .filter((row) => row.factoryPrice != null || row.marketPrice != null)
    .sort((a, b) => {
      const nameA = `${a.brandFa} ${a.modelFa} ${a.trimFa || ""} ${a.modelYear}`;
      const nameB = `${b.brandFa} ${b.modelFa} ${b.trimFa || ""} ${b.modelYear}`;
      return nameA.localeCompare(nameB, "fa");
    });
}

function isAndroidStandalone() {
  return typeof AndroidApp !== "undefined";
}

/**
 * Prefer the non-obfuscated bridge so callbacks survive build.
 * Falls back to synchronous httpGet on older APKs.
 */
function androidHttpGet(url) {
  if (typeof window !== "undefined" && typeof window.__androidHttpGet === "function") {
    return window.__androidHttpGet(url);
  }
  if (typeof AndroidApp !== "undefined" && typeof AndroidApp.httpGet === "function") {
    return Promise.resolve(AndroidApp.httpGet(url));
  }
  return Promise.reject(new Error("پل اندروید در دسترس نیست"));
}

/** Flexible Android HTTP (GET/POST + headers) via non-obfuscated bridge. */
function androidHttpRequest(spec) {
  if (typeof window !== "undefined" && typeof window.__androidHttpRequest === "function") {
    return window.__androidHttpRequest(spec);
  }
  // Older APKs: GET-only fallback (no custom headers / POST).
  if (String(spec?.method || "GET").toUpperCase() === "GET" && !spec?.headers) {
    return androidHttpGet(spec.url);
  }
  return Promise.reject(
    new Error("نسخه اپلیکیشن قدیمی است؛ برای تخمین قیمت اپ را به‌روز کنید"),
  );
}

async function fetchBamaViaAllOrigins(url) {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`);

  const wrapper = await response.json();
  if (!wrapper?.contents) throw new Error("Proxy response was empty");
  return JSON.parse(wrapper.contents);
}

async function fetchBamaPricePageFromBridge(url) {
  const raw = await androidHttpGet(url);
  if (!raw) throw new Error("پاسخ سرور قیمت خودرو نامعتبر بود");

  const payload = JSON.parse(raw);
  if (payload?.__error) {
    throw new Error(payload.message || "خطا در دریافت قیمت خودرو");
  }

  return payload;
}

async function fetchBamaPricePageDirect(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("پاسخ سرور قیمت خودرو نامعتبر بود");
  return response.json();
}

async function fetchBamaPricePage(url) {
  if (isAndroidStandalone() && typeof AndroidApp.httpGet === "function") {
    return fetchBamaPricePageFromBridge(url);
  }

  if (!isAndroidStandalone()) {
    return fetchBamaPricePageDirect(url);
  }

  try {
    return await fetchBamaViaAllOrigins(url);
  } catch (proxyError) {
    console.warn("Bama proxy fetch failed:", proxyError);
    return fetchBamaPricePageDirect(url);
  }
}

const ISIGNAL_FETCH_HEADERS = {
  Accept: "application/json",
  Origin: ISIGNAL_SITE_ORIGIN,
  Referer: `${ISIGNAL_SITE_ORIGIN}/`,
};

async function fetchIsignalTextViaAllOrigins(url) {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`);
  return response.text();
}

function parseIsignalBridgeJson(raw) {
  if (!raw) throw new Error("پاسخ خالی بود");
  const trimmed = String(raw).trim();
  const payload = JSON.parse(trimmed);
  if (payload?.__error) {
    throw new Error(payload.message || "خطا در دریافت قیمت");
  }
  return payload;
}

async function fetchIsignalPostJson(url, body) {
  const headers = {
    ...ISIGNAL_FETCH_HEADERS,
    "Content-Type": "application/json",
  };

  const postDirect = async () => {
    const response = await fetch(url, { method: "POST", headers, body, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  if (isAndroidStandalone()) {
    const raw = await androidHttpRequest({ method: "POST", url, headers, body });
    return parseIsignalBridgeJson(raw);
  }

  return postDirect();
}

function applyIsignalFreeCurrencyQuotes(current, items) {
  for (const item of items) {
    const name = item?.name;
    const key = name ? ISIGNAL_FREE_CURRENCY_NAME_TO_KEY[name] : null;
    if (!key || current[key]) continue;
    if (item?.subCategory && item.subCategory !== "free") continue;

    const entry = isignalQuoteToTgjuEntry(item, ISIGNAL_GLOBAL_PRICE_KEYS.has(key));
    if (entry) current[key] = entry;
  }
}

function applyIsignalUniqueQuotes(current, items, { isGlobal = false, useCrypto = false } = {}) {
  for (const item of items) {
    const key = resolveIsignalMarketKey(item);
    if (!key || current[key]) continue;

    const entry = useCrypto
      ? isignalCryptoToTgjuEntry(item)
      : isignalQuoteToTgjuEntry(item, isGlobal || ISIGNAL_GLOBAL_PRICE_KEYS.has(key));
    if (entry) current[key] = entry;
  }
}

function normalizeEstjtDigits(raw) {
  let s = String(raw ?? "").trim();
  s = s.replace(/^\$\s*/, "");
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  for (let i = 0; i < 10; i += 1) {
    s = s.split(persian[i]).join(String(i));
    s = s.split(arabic[i]).join(String(i));
  }
  // "۱۲۹۳۵٫۸۳" is a decimal; "۲۵٫۸۶۰٫۰۰۰" uses ٫ as a thousands separator.
  s = s.replace(/٫(\d{1,2})$/, ".$1");
  s = s
    .replace(/٫/g, "")
    .replace(/,/g, "")
    .replace(/،/g, "")
    .replace(/\s/g, "")
    .replace(/٪|%/g, "");
  if (s.includes(".") && !/^\d+\.\d+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  return s;
}

function parseEstjtNumber(raw) {
  const s = normalizeEstjtDigits(raw);
  if (!s || s === "—" || s === "-") return NaN;
  const num = Number(s);
  return Number.isFinite(num) ? num : NaN;
}

function parseEstjtTableRows(html) {
  if (!html) return [];
  const rows = [];
  const rowRe =
    /<td class="name">([^<]+)<\/td>\s*<td class="price">([^<]+)<\/td>\s*<td class="change">([\s\S]*?)<\/td>/g;
  let match = rowRe.exec(html);
  while (match) {
    rows.push({
      name: match[1].replace(/\s+/g, " ").trim(),
      price: match[2].trim(),
      changeHtml: match[3],
    });
    match = rowRe.exec(html);
  }
  return rows;
}

function estjtChangeMeta(changeHtml) {
  const directionMatch = changeHtml.match(/class="(asc|desc)"/);
  const direction = directionMatch?.[1] || "";
  const valueMatch = changeHtml.match(/class="(?:asc|desc)"[^>]*>\s*([^<]+)/);
  const rawValue = valueMatch?.[1]?.trim() || "";
  if (!rawValue || rawValue === "—") {
    return { direction, changeToman: 0, percent: null };
  }
  const hasPercent = /٪|%/.test(rawValue) || /٪|%/.test(changeHtml);
  const num = parseEstjtNumber(rawValue);
  if (!Number.isFinite(num)) {
    return { direction, changeToman: 0, percent: null };
  }
  if (hasPercent) {
    let decimal = String(rawValue).trim();
    const persian = "۰۱۲۳۴۵۶۷۸۹";
    const arabic = "٠١٢٣٤٥٦٧٨٩";
    for (let i = 0; i < 10; i += 1) {
      decimal = decimal.split(persian[i]).join(String(i));
      decimal = decimal.split(arabic[i]).join(String(i));
    }
    decimal = decimal.replace(/٫/g, ".").replace(/٪|%/g, "").trim();
    const pct = parseFloat(decimal);
    return { direction, changeToman: 0, percent: Number.isFinite(pct) ? pct : null };
  }
  return { direction, changeToman: num, percent: null };
}

function estjtRowToTgjuEntry(row, key) {
  const isGlobal = key === "ons";
  const priceNum = parseEstjtNumber(row.price);
  if (!Number.isFinite(priceNum) || priceNum === 0) return null;

  const { direction, changeToman, percent } = estjtChangeMeta(row.changeHtml);

  if (isGlobal) {
    let pct = Number.isFinite(percent) ? percent : 0;
    if (!Number.isFinite(percent) && changeToman) {
      pct = (changeToman / priceNum) * 100;
    }
    const signedPct =
      direction === "desc" ? -Math.abs(pct) : direction === "asc" ? Math.abs(pct) : pct;
    const signedChange = direction === "desc" ? -Math.abs(changeToman) : Math.abs(changeToman);
    return isignalQuoteToTgjuEntry(
      { close: priceNum, percentChange: signedPct, change: changeToman ? signedChange : signedPct },
      true,
    );
  }

  const p = toMoj3TgjuPriceString(priceNum, false);
  let dp = Number.isFinite(percent) ? percent : 0;
  if (!Number.isFinite(percent) && priceNum && changeToman) {
    dp = (changeToman / priceNum) * 100;
  }
  if (direction === "desc" && dp > 0) dp = -dp;
  if (direction === "asc" && dp < 0) dp = Math.abs(dp);

  const dt = dp > 0 ? "high" : dp < 0 ? "low" : "";
  let d = "";
  if (changeToman) {
    const sign = direction === "desc" || changeToman < 0 ? "-" : "";
    d = sign + toMoj3TgjuPriceString(Math.abs(changeToman), false).replace(/^-/, "");
  }

  return {
    p,
    dp,
    dt,
    ...(d ? { d } : {}),
  };
}

function applyEstjtTableHtml(current, tableHtml) {
  for (const row of parseEstjtTableRows(tableHtml)) {
    const key = ESTJT_ROW_NAME_TO_KEY[row.name];
    if (!key || current[key]) continue;
    const entry = estjtRowToTgjuEntry(row, key);
    if (entry) current[key] = entry;
  }
}

async function fetchEstjtPricePayload() {
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: ESTJT_SITE_ORIGIN,
    Referer: `${ESTJT_SITE_ORIGIN}/`,
  };

  const postAjax = async () => {
    const response = await fetch(ESTJT_AJAX_URL, {
      method: "POST",
      headers,
      body: ESTJT_PRICE_POST_BODY,
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`ESTJT HTTP ${response.status}`);
    return response.json();
  };

  if (isAndroidStandalone()) {
    const raw = await androidHttpRequest({
      method: "POST",
      url: ESTJT_AJAX_URL,
      headers,
      body: ESTJT_PRICE_POST_BODY,
    });
    const payload = parseIsignalBridgeJson(raw);
    if (payload?.gold || payload?.coin) return payload;
    throw new Error("پاسخ اتحادیه طلا نامعتبر بود");
  }

  return postAjax();
}

async function applyEstjtGoldCoinPrices(current) {
  const payload = await fetchEstjtPricePayload();
  if (payload?.gold) applyEstjtTableHtml(current, payload.gold);
  if (payload?.coin) applyEstjtTableHtml(current, payload.coin);

  if (!current.geram18 && !current.sekee) {
    throw new Error("قیمت طلا و سکه از اتحادیه دریافت نشد");
  }
}

function applyIsignalHomeSitePwa(current, items) {
  if (!Array.isArray(items)) return;

  for (const item of items) {
    const unique = item?.unique;
    if (unique === "tether" && !current["crypto-tether-irr"]) {
      const entry = isignalCryptoToTgjuEntry({
        ...item,
        toomanPrice: item.value,
        percentChgTooman: item.percentChange,
        chgTooman: item.change,
      });
      if (entry) current["crypto-tether-irr"] = entry;
      continue;
    }

    if (unique === "brent-oil" && !current.oil_brent) {
      const entry = isignalQuoteToTgjuEntry(
        { ...item, close: item.value, change: item.change, percentChange: item.percentChange },
        true,
      );
      if (entry) current.oil_brent = entry;
    }
  }
}

function applyIsignalPayloadToCurrent(current, payload) {
  if (!payload) return;

  applyIsignalFreeCurrencyQuotes(current, getIsignalListSectionItems(payload, "freeCurrency"));

  for (const item of getIsignalListSectionItems(payload, "oil")) {
    const name = String(item?.persianName || "");
    if (!name.includes("برنت")) continue;
    const entry = isignalQuoteToTgjuEntry(item, true);
    if (entry) current.oil_brent = entry;
    break;
  }

  applyIsignalHomeSitePwa(current, payload?.data?.home_site_pwa);
}

async function buildIsignalPricesCurrent(onProgress) {
  const current = {};
  const notifyProgress = () => {
    applyComputedGoldIntrinsic(current);
    if (typeof onProgress === "function") onProgress(current);
  };

  const isignalTask = (async () => {
    try {
      const payload = await fetchIsignalPostJson(ISIGNAL_SIGNAL_DATA_URL, ISIGNAL_SIGNAL_DATA_POST_BODY);
      applyIsignalPayloadToCurrent(current, payload);
      notifyProgress();
    } catch (error) {
      console.warn("Isignal currency fetch failed:", error);
    }
  })();

  const estjtTask = (async () => {
    await applyEstjtGoldCoinPrices(current);
    notifyProgress();
  })();

  await Promise.all([isignalTask, estjtTask]);

  applyComputedGoldIntrinsic(current);
  return current;
}

async function fetchTgjuAjaxPayload() {
  if (isAndroidStandalone() && typeof AndroidApp.httpGet === "function") {
    const raw = await androidHttpGet(TGJU_AJAX_URL);
    const trimmed = String(raw || "").trim();
    if (trimmed.startsWith("{")) {
      const payload = JSON.parse(trimmed);
      if (payload?.__error) throw new Error(payload.message || "خطا در دریافت تغییر صندوق");
      return payload;
    }
    return JSON.parse(raw);
  }

  try {
    const response = await fetch(TGJU_AJAX_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`TGJU HTTP ${response.status}`);
    return response.json();
  } catch (directError) {
    console.warn("TGJU direct fetch failed:", directError);
    const html = await fetchIsignalTextViaAllOrigins(TGJU_AJAX_URL);
    return JSON.parse(html);
  }
}

async function enrichMoj3FundChanges(current) {
  if (!current || !Object.keys(MOJ3_FUND_TGJU_CHANGE_KEYS).some((key) => current[key])) {
    return current;
  }
  try {
    const tgju = await fetchTgjuAjaxPayload();
    return applyTgjuFundChanges(current, tgju?.current);
  } catch (error) {
    console.warn("TGJU fund change enrich failed:", error);
    return current;
  }
}

let activeMarketPricesFetch = null;

async function fetchMoj3PricesPayload(options = {}) {
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : null;
  if (activeMarketPricesFetch) return activeMarketPricesFetch;

  activeMarketPricesFetch = (async () => {
    const current = await buildIsignalPricesCurrent(onProgress);
    if (!current.geram18 && !current.price_dollar_rl) {
      throw new Error("داده‌ای دریافت نشد");
    }
    return { current };
  })();

  try {
    return await activeMarketPricesFetch;
  } finally {
    activeMarketPricesFetch = null;
  }
}

async function fetchBamaCarPricesLive() {
  const allItems = [];
  let pageIndex = 0;
  let lastUpdate = null;

  while (true) {
    const url = `${BAMA_PRICE_API_URL}?pageIndex=${pageIndex}&pageSize=${BAMA_PAGE_SIZE}`;
    const payload = await fetchBamaPricePage(url);
    const brands = payload.data;
    if (!Array.isArray(brands) || brands.length === 0) break;

    lastUpdate = payload.metadata?.last_update || lastUpdate;
    brands.forEach((brand) => {
      brand.items?.forEach((item) => allItems.push(item));
    });

    pageIndex += 1;
    if (brands.length < BAMA_PAGE_SIZE) break;
  }

  const rows = mergeIranianCarItems(allItems);
  if (!rows.length) throw new Error("قیمتی برای خودروهای داخلی یافت نشد");

  return {
    rows,
    lastUpdate,
  };
}

async function fetchBamaCarPrices() {
  // Always fetch live from bama.ir (Android uses native httpGet bridge).
  return fetchBamaCarPricesLive();
}

const DIVAR_POST_API_BASE = "https://api.divar.ir/v8/posts-v2/web/";
const KHODRO45_API_BASE = "https://khodro45.com/api";
const KHODRO45_BRANDS_API = `${KHODRO45_API_BASE}/v1/brands/all/`;
const KHODRO45_MODELS_API = `${KHODRO45_API_BASE}/v1/models/`;
const KHODRO45_TRIMS_API = `${KHODRO45_API_BASE}/v1/trims/`;
const KHODRO45_YEARS_API = `${KHODRO45_API_BASE}/v1/years/`;
const KHODRO45_TRIMYEARS_API = `${KHODRO45_API_BASE}/v1/trimyears/`;
const KHODRO45_COLORS_API = `${KHODRO45_API_BASE}/v1/portfolio/colors/`;
const KHODRO45_ESTIMATE_API = `${KHODRO45_API_BASE}/v1/carprice/public/estimated_price/`;
const KHODRO45_API_HEADERS = {
  Origin: "https://khodro45.com",
  Referer: "https://khodro45.com/carprice/wizard/",
};

/** Kept for reserved-name compatibility — catalog/estimate use Khodro45. */
const BAMA_CALCULATOR_VEHICLES_API = KHODRO45_BRANDS_API;
const BAMA_CALCULATOR_CALCULATE_API = KHODRO45_ESTIMATE_API;

let bamaCalculatorVehiclesCache = null;
let khodro45ColorsCache = null;

function pathGet(obj, keys, fallback = null) {
  let cur = obj;
  for (const key of keys) {
    if (cur == null || typeof cur !== "object") return fallback;
    cur = cur[key];
  }
  return cur == null ? fallback : cur;
}

function toEnglishNumber(input) {
  return String(input ?? "")
    .replace(/[\u0660-\u0669]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30))
    .replace(/[\u06f0-\u06f9]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x30))
    .replace(/[,‎\u066c]/g, "")
    .replace(/\u066b/g, ".")
    .replace(/[\u200c-\u200f\u202a-\u202c\u00a0]/g, "")
    .trim();
}

/** Divar year field is often like "۱۳۹۵ - ۲۰۱۶" — calculator wants Jalali 1395. */
function extractCarYear(model) {
  const normalized = toEnglishNumber(model);
  const persianYear = normalized.match(/13\d{2}/);
  if (persianYear) return persianYear[0];
  const gregorianYear = normalized.match(/20\d{2}/);
  if (gregorianYear) {
    const g = Number(gregorianYear[0]);
    if (Number.isFinite(g) && g >= 2000) return String(g - 621);
  }
  const anyYear = normalized.match(/\d{4}/);
  return anyYear ? anyYear[0] : normalized;
}

function extractMileage(mileage) {
  const normalized = toEnglishNumber(mileage).replace(/[^\d.]/g, "");
  return normalized || "0";
}

function isDivarUrl(text) {
  try {
    const u = new URL(String(text || "").trim());
    return u.hostname.includes("divar.");
  } catch {
    return /divar\.ir/i.test(String(text || ""));
  }
}

function extractDivarToken(url) {
  try {
    const parsed = new URL(String(url || "").trim());
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.pop() || null;
  } catch {
    const cleaned = String(url || "").trim().replace(/\?.*$/, "").replace(/\/$/, "");
    const token = cleaned.split("/").filter(Boolean).pop();
    return token || null;
  }
}

function getDivarListWidgets(payload) {
  const sections = Array.isArray(payload?.sections) ? payload.sections : [];
  for (const section of sections) {
    const name = String(section?.section_name || section?.title || "").toUpperCase();
    if (name.includes("LIST") || name === "LIST_DATA") {
      return Array.isArray(section.widgets) ? section.widgets : [];
    }
  }
  let best = [];
  for (const section of sections) {
    const widgets = Array.isArray(section?.widgets) ? section.widgets : [];
    if (widgets.length > best.length) best = widgets;
  }
  return best;
}

function findDivarGroupInfoValue(payload, title) {
  const widgets = getDivarListWidgets(payload);
  for (const widget of widgets) {
    const items = pathGet(widget, ["data", "items"], []) || [];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (item?.title === title) return item.value || "";
    }
  }
  return "";
}

function findDivarRowValue(payload, title) {
  const widgets = getDivarListWidgets(payload);
  for (const widget of widgets) {
    if (pathGet(widget, ["data", "title"]) === title) {
      return (
        pathGet(widget, ["data", "value"], "") ||
        pathGet(widget, ["data", "descriptive_score"], "") ||
        ""
      );
    }
  }
  return "";
}

function findDivarBodyStatus(payload) {
  const widgets = getDivarListWidgets(payload);
  for (const widget of widgets) {
    if (pathGet(widget, ["data", "title"]) !== "بدنه") continue;
    const tags = pathGet(widget, ["data", "tags"], []) || [];
    if (Array.isArray(tags) && tags.length > 0) {
      return `رنگ‌شدگی در ${tags.length} ناحیه`;
    }
    return pathGet(widget, ["data", "descriptive_score"], "") || "";
  }
  return "";
}

/** Prefer human-readable widget price over webengage float32-corrupted values. */
function findDivarAdPrice(payload) {
  const widgetTitles = ["قیمت پایه", "قیمت", "قیمت کل"];
  for (const title of widgetTitles) {
    const raw =
      findDivarRowValue(payload, title) || findDivarGroupInfoValue(payload, title);
    if (!raw) continue;
    const digits = toEnglishNumber(raw).replace(/[^\d]/g, "");
    if (digits) {
      const n = Number(digits);
      if (Number.isFinite(n) && n > 0) return Math.round(n);
    }
  }
  const we = Number(pathGet(payload, ["webengage", "price"], 0)) || 0;
  return we > 0 ? Math.round(we) : 0;
}

function normalizeMatchText(input) {
  return toEnglishNumber(String(input || ""))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, "")
    .replace(/[()[\]{}،,._\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function k45List(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

async function k45Get(url) {
  return fetchHttpJson(url, { headers: { ...KHODRO45_API_HEADERS } });
}

async function androidHttpJson(spec) {
  const raw = await androidHttpRequest(spec);
  if (!raw) throw new Error("پاسخ سرور خالی بود");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("پاسخ سرور معتبر نبود");
  }
  if (parsed && parsed.__error === true) {
    const err = new Error(parsed.message || parsed.detail || "خطا در دریافت اطلاعات");
    err.status = Number(parsed.__httpStatus) || 0;
    err.payload = parsed;
    throw err;
  }
  return parsed;
}

async function fetchHttpJson(url, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const body = options.body == null ? null : String(options.body);
  const headers = {
    Accept: "application/json",
    "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
    ...(options.headers || {}),
  };
  if (body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (isAndroidStandalone() && AndroidApp) {
    return androidHttpJson({ method, url, headers, body });
  }

  const response = await fetch(url, {
    method,
    cache: "no-store",
    headers,
    body: body == null ? undefined : body,
  });
  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    const message =
      (parsed && (parsed.detail || parsed.error || parsed.message)) || `HTTP ${response.status}`;
    const err = new Error(String(message));
    err.status = response.status;
    err.payload = parsed;
    throw err;
  }
  return parsed;
}

async function getDivarAdData(divarUrl) {
  const token = extractDivarToken(divarUrl);
  if (!token) throw new Error("لینک آگهی دیوار نامعتبر است");

  const payload = await fetchHttpJson(`${DIVAR_POST_API_BASE}${encodeURIComponent(token)}`);
  if (pathGet(payload, ["webengage", "cat_2"]) !== "cars") {
    throw new Error("این آگهی مربوط به خودرو نیست");
  }

  const mileage =
    findDivarGroupInfoValue(payload, "کارکرد") ||
    pathGet(payload, ["sections", "4", "widgets", "0", "data", "items", "0", "value"], "");
  const model =
    findDivarGroupInfoValue(payload, "مدل (سال تولید)") ||
    pathGet(payload, ["sections", "4", "widgets", "0", "data", "items", "1", "value"], "");
  const color =
    findDivarGroupInfoValue(payload, "رنگ") ||
    pathGet(payload, ["sections", "4", "widgets", "0", "data", "items", "2", "value"], "");
  const brandModelFa =
    findDivarRowValue(payload, "برند و مدل") ||
    pathGet(payload, ["sections", "4", "widgets", "1", "data", "value"], "");
  const bodyStatus = findDivarBodyStatus(payload);

  return {
    token,
    url: pathGet(payload, ["share", "web_url"], divarUrl),
    city: pathGet(payload, ["seo", "web_info", "city_persian"], ""),
    neighborhood: pathGet(payload, ["seo", "web_info", "district_persian"], ""),
    price: findDivarAdPrice(payload),
    title: pathGet(payload, ["share", "title"], ""),
    description: pathGet(payload, ["sections", "2", "widgets", "1", "data", "text"], ""),
    mileage,
    model,
    color,
    brandModelFa,
    brandModel: pathGet(payload, ["webengage", "brand_model"], ""),
    bodyStatus,
  };
}

async function getBamaCalculatorVehicles() {
  if (bamaCalculatorVehiclesCache) return bamaCalculatorVehiclesCache;
  const payload = await k45Get(KHODRO45_BRANDS_API);
  const brands = k45List(payload);
  if (!brands.length) {
    throw new Error("لیست مدل‌های خودرو برای تخمین دریافت نشد");
  }
  bamaCalculatorVehiclesCache = brands.map((brand) => ({
    brand_id: brand.id,
    brand_name: brand.title_en || brand.title || "",
    brand_name_fa: brand.title || brand.title_en || "",
    models: [],
    _modelsLoaded: false,
  }));
  return bamaCalculatorVehiclesCache;
}

async function loadCalculatorBrandModels(brandId) {
  const tree = await getBamaCalculatorVehicles();
  const brand = tree.find((item) => Number(item.brand_id) === Number(brandId));
  if (!brand) return [];
  if (brand._modelsLoaded) return brand.models || [];
  const payload = await k45Get(`${KHODRO45_MODELS_API}?brand_id=${encodeURIComponent(brandId)}`);
  brand.models = k45List(payload).map((model) => ({
    model_id: model.id,
    model_name: model.title_en || model.title || "",
    model_name_fa: model.title || model.title_en || "",
    trims: [],
    _trimsLoaded: false,
  }));
  brand._modelsLoaded = true;
  return brand.models;
}

async function loadCalculatorModelTrims(brandId, modelId) {
  await loadCalculatorBrandModels(brandId);
  const matched = findBamaBrandModelTrim(await getBamaCalculatorVehicles(), brandId, modelId, null);
  if (!matched?.model) return [];
  if (matched.model._trimsLoaded) return matched.model.trims || [];
  const payload = await k45Get(`${KHODRO45_TRIMS_API}?model_id=${encodeURIComponent(modelId)}`);
  matched.model.trims = k45List(payload).map((trim) => ({
    trim_id: trim.id,
    trim_name: trim.title_en || trim.title || "",
    trim_name_fa: trim.title || trim.title_en || "",
  }));
  matched.model._trimsLoaded = true;
  return matched.model.trims;
}

async function getCalculatorTrimYears(trimId) {
  if (!trimId) return [];
  const payload = await k45Get(`${KHODRO45_YEARS_API}?trim_id=${encodeURIComponent(trimId)}`);
  return k45List(payload)
    .map((year) => ({
      id: year.id,
      title: String(year.title || "").trim(),
    }))
    .filter((year) => year.id && year.title)
    .sort((a, b) => Number(b.title) - Number(a.title));
}

async function resolveKhodro45TrimYearId(trimId, jalaliYear) {
  const years = await getCalculatorTrimYears(trimId);
  const yearTitle = String(jalaliYear || "").trim();
  const year =
    years.find((item) => item.title === yearTitle) ||
    years.find((item) => Number(item.title) === Number(yearTitle));
  if (!year) {
    throw new Error("سال ساخت برای این تیپ در خودرو۴۵ موجود نیست");
  }
  const payload = await k45Get(
    `${KHODRO45_TRIMYEARS_API}?trim_id=${encodeURIComponent(trimId)}&year_id=${encodeURIComponent(year.id)}`,
  );
  const rows = k45List(payload);
  if (!rows.length || !rows[0]?.id) {
    throw new Error("ترکیب تیپ و سال برای تخمین پیدا نشد");
  }
  return {
    trimyearId: rows[0].id,
    optionTitle: rows[0]?.option?.title || "",
    yearTitle: year.title,
  };
}

async function getKhodro45Colors() {
  if (khodro45ColorsCache) return khodro45ColorsCache;
  try {
    const payload = await k45Get(KHODRO45_COLORS_API);
    khodro45ColorsCache = k45List(payload);
  } catch {
    khodro45ColorsCache = [];
  }
  return khodro45ColorsCache;
}

async function resolveKhodro45ColorId(colorText) {
  const colors = await getKhodro45Colors();
  const needle = normalizeMatchText(colorText);
  if (needle && colors.length) {
    const hit = colors.find((color) => {
      const name = normalizeMatchText(color.name || color.title || "");
      return name && (needle.includes(name) || name.includes(needle));
    });
    if (hit?.slug != null) return Number(hit.slug) || hit.slug;
    if (hit?.id != null) return Number(hit.id) || hit.id;
  }
  return 1;
}

const BAMA_BODY_STATUS_OPTIONS = [
  { value: "Healthy", labelFa: "سالم و بدون رنگ" },
  { value: "Painted", labelFa: "دوررنگ" },
  { value: "Repainted", labelFa: "تمام‌رنگ" },
  { value: "Damaged", labelFa: "آسیب‌دیده" },
];

function findBamaBrandModelTrim(tree, brandId, modelId, trimId) {
  const brand = (Array.isArray(tree) ? tree : []).find(
    (item) => Number(item.brand_id) === Number(brandId),
  );
  if (!brand) return null;
  const model = (brand.models || []).find((item) => Number(item.model_id) === Number(modelId));
  if (!model) return null;
  const trims = Array.isArray(model.trims) ? model.trims : [];
  const trim =
    trimId == null || trimId === ""
      ? null
      : trims.find((item) => Number(item.trim_id) === Number(trimId)) || null;
  return { brand, model, trim, trims };
}

function scoreNameAgainstAd(nameEn, nameFa, ad) {
  const brandEn = normalizeMatchText(ad.brandModel);
  const brandFa = normalizeMatchText(ad.brandModelFa);
  const title = normalizeMatchText(ad.title);
  const hay = `${brandEn} ${brandFa} ${title}`.trim();
  const en = normalizeMatchText(nameEn);
  const fa = normalizeMatchText(nameFa);
  let score = 0;
  if (fa && hay.includes(fa)) score += 60;
  if (en && en.length > 1 && hay.includes(en)) score += 40;
  return score;
}

async function pickKhodro45Vehicle(ad) {
  const tree = await getBamaCalculatorVehicles();
  let bestBrand = null;
  let bestBrandScore = 0;
  for (const brand of tree) {
    const score = scoreNameAgainstAd(brand.brand_name, brand.brand_name_fa, ad);
    if (score > bestBrandScore) {
      bestBrandScore = score;
      bestBrand = brand;
    }
  }
  if (!bestBrand || bestBrandScore < 40) return null;

  const models = await loadCalculatorBrandModels(bestBrand.brand_id);
  let bestModel = null;
  let bestModelScore = 0;
  for (const model of models) {
    let score = scoreNameAgainstAd(model.model_name, model.model_name_fa, ad);
    if (
      (/\bbasic\b/.test(normalizeMatchText(ad.brandModel)) ||
        normalizeMatchText(ad.brandModelFa).includes("معمولی")) &&
      normalizeMatchText(model.model_name_fa).includes("معمولی")
    ) {
      score += 20;
    }
    if (score > bestModelScore) {
      bestModelScore = score;
      bestModel = model;
    }
  }
  if (!bestModel || bestModelScore < 20) return null;

  const trims = await loadCalculatorModelTrims(bestBrand.brand_id, bestModel.model_id);
  let bestTrim = null;
  let bestTrimScore = -1;
  for (const trim of trims) {
    const score = scoreNameAgainstAd(trim.trim_name, trim.trim_name_fa, ad);
    if (score > bestTrimScore) {
      bestTrimScore = score;
      bestTrim = trim;
    }
  }
  if (!bestTrim && trims.length) bestTrim = trims[0];
  if (!bestTrim) return null;

  return { brand: bestBrand, model: bestModel, trim: bestTrim };
}

async function postKhodro45Estimate(requestBody) {
  const payload = await fetchHttpJson(KHODRO45_ESTIMATE_API, {
    method: "POST",
    headers: {
      ...KHODRO45_API_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!payload || typeof payload !== "object") {
    throw new Error("تخمین قیمت دریافت نشد");
  }
  return payload;
}

function mapKhodro45EstimateToResult(data, extras = {}) {
  const k45 = data.k45_price || {};
  const market = data.market_price || {};
  const minPrice = Number(k45.min) || Number(market.min) || 0;
  const maxPrice = Number(k45.max) || Number(market.max) || 0;
  const suggestedPrice = Number(k45.price) || Number(market.price) || 0;
  if (!minPrice && !maxPrice && !suggestedPrice) {
    throw new Error("تخمین قیمت برای این خودرو در خودرو۴۵ موجود نیست");
  }
  const adPrice = Number(extras.adPrice) || 0;
  return {
    minPrice: minPrice || suggestedPrice,
    maxPrice: maxPrice || suggestedPrice,
    suggestedPrice: suggestedPrice || minPrice,
    verdict: verdictFromBama(adPrice, minPrice || suggestedPrice, maxPrice || suggestedPrice),
    brandFa: extras.brandFa || "",
    modelFa: extras.modelFa || "",
    trimFa: extras.trimFa || "",
    modelYear: Number(extras.modelYear) || 0,
    mileage: Number(extras.mileage) || 0,
    color: extras.color || "",
    imageUrl: extras.imageUrl || "",
    tags: [],
    calculateId: "",
    source: data.source || "K45",
  };
}

/**
 * Manual estimate from selected brand/model/trim IDs (Khodro45 carprice APIs).
 * selection: { brandId, modelId, trimId?, modelYear, mileage, bodyStatus?, color?, adPrice? }
 */
async function estimateBamaPriceFromSelection(selection) {
  const brandId = Number(selection?.brandId);
  const modelId = Number(selection?.modelId);
  const modelYear = Number(selection?.modelYear);
  const mileage = Number(selection?.mileage);
  if (!Number.isFinite(brandId) || brandId <= 0) throw new Error("برند خودرو را انتخاب کنید");
  if (!Number.isFinite(modelId) || modelId <= 0) throw new Error("مدل خودرو را انتخاب کنید");
  if (!Number.isFinite(modelYear) || modelYear < 1300 || modelYear > 1500) {
    throw new Error("سال ساخت معتبر وارد کنید");
  }
  if (!Number.isFinite(mileage) || mileage < 0) throw new Error("کارکرد خودرو را وارد کنید");

  await loadCalculatorBrandModels(brandId);
  const trims = await loadCalculatorModelTrims(brandId, modelId);
  const matched = findBamaBrandModelTrim(
    await getBamaCalculatorVehicles(),
    brandId,
    modelId,
    selection?.trimId,
  );
  if (!matched) throw new Error("مدل انتخاب‌شده برای تخمین معتبر نیست");

  const trimId =
    selection?.trimId == null || selection?.trimId === ""
      ? null
      : Number(selection.trimId);
  if ((trims || []).length > 0 && (trimId == null || !Number.isFinite(trimId))) {
    throw new Error("تیپ خودرو را انتخاب کنید");
  }
  if (trimId == null || !Number.isFinite(trimId)) {
    throw new Error("تیپ خودرو برای تخمین خودرو۴۵ الزامی است");
  }

  const { trimyearId } = await resolveKhodro45TrimYearId(trimId, modelYear);
  const colorId = await resolveKhodro45ColorId(selection?.color || "");
  const data = await postKhodro45Estimate({
    color: colorId,
    source: "carprice",
    trimyear_id: trimyearId,
    mileage: Math.round(mileage),
    defects: [],
  });

  return mapKhodro45EstimateToResult(data, {
    brandFa: matched.brand.brand_name_fa,
    modelFa: matched.model.model_name_fa,
    trimFa: matched.trim?.trim_name_fa || "",
    modelYear,
    mileage: Math.round(mileage),
    color: selection?.color || "",
    adPrice: selection?.adPrice || 0,
  });
}

function verdictFromBama(adPrice, minPrice, maxPrice) {
  if (adPrice && minPrice && adPrice < minPrice) return "ارزان";
  if (adPrice && maxPrice && adPrice > maxPrice) return "گران";
  return "معقول";
}

/** Extract tip text like «تیپ ۲» from Divar brand/model FA string. */
function extractTipFromBrandModelFa(brandModelFa) {
  const text = String(brandModelFa || "");
  const tip = text.match(/تیپ\s*[۰-۹0-9]+(?:\s*دنده‌?ای)?/);
  return tip ? tip[0].trim() : "";
}

/**
 * Same public estimate API used by https://khodro45.com/carprice/wizard/
 */
async function estimateBamaPrice(ad) {
  const year = extractCarYear(ad.model);
  const mileage = Number(extractMileage(ad.mileage)) || 0;
  if (!year || !/^\d{4}$/.test(year)) {
    throw new Error("سال ساخت خودرو از آگهی استخراج نشد");
  }

  const matched = await pickKhodro45Vehicle(ad);
  if (!matched) {
    throw new Error("مدل این خودرو برای تخمین پیدا نشد");
  }

  const tipFromAd = extractTipFromBrandModelFa(ad.brandModelFa);
  const { trimyearId } = await resolveKhodro45TrimYearId(matched.trim.trim_id, year);
  const colorId = await resolveKhodro45ColorId(ad.color || "");
  const data = await postKhodro45Estimate({
    color: colorId,
    source: "carprice",
    trimyear_id: trimyearId,
    mileage,
    defects: [],
  });

  const estimate = mapKhodro45EstimateToResult(data, {
    brandFa: matched.brand.brand_name_fa,
    modelFa: matched.model.model_name_fa,
    trimFa: tipFromAd || matched.trim?.trim_name_fa || "",
    modelYear: Number(year),
    mileage,
    color: ad.color || "",
    adPrice: ad.price || 0,
    imageUrl: ad.imageUrl || "",
  });
  if (tipFromAd && !estimate.trimFa) estimate.trimFa = tipFromAd;
  return estimate;
}

async function estimateFromDivarUrl(divarUrl) {
  const cleaned = String(divarUrl || "").trim();
  if (!isDivarUrl(cleaned)) {
    throw new Error("لطفاً لینک معتبر آگهی خودرو در دیوار را وارد کنید");
  }

  const ad = await getDivarAdData(cleaned);
  const estimate = await estimateBamaPrice(ad);
  return { ad, estimate };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function verdictToneClass(verdict) {
  if (verdict === "ارزان") return "is-cheap";
  if (verdict === "گران") return "is-expensive";
  return "is-fair";
}

function formatEstimateToman(price) {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return `${Number(n).toLocaleString("fa-IR")} تومان`;
}

function formatEstimateMileage(mileage) {
  const n = Number(mileage);
  if (!Number.isFinite(n) || n < 0) return "—";
  return `${Number(n).toLocaleString("fa-IR")} کیلومتر`;
}

function renderDivarEstimateResult(result) {
  const { ad, estimate } = result;
  const brand = escapeHtml(estimate.brandFa || ad.brandModelFa || "—");
  const model = escapeHtml(estimate.modelFa || "—");
  const trim = escapeHtml(estimate.trimFa || "—");
  const color = escapeHtml(estimate.color || ad.color || "—");
  const year = escapeHtml(
    estimate.modelYear != null
      ? String(estimate.modelYear)
      : extractCarYear(ad.model) || "—",
  );
  const mileageText = escapeHtml(formatEstimateMileage(estimate.mileage ?? extractMileage(ad.mileage)));
  const imageUrl = String(estimate.imageUrl || "").trim();
  const imageHtml = imageUrl
    ? `<img class="estimate-car-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy" />`
    : `<div class="estimate-car-image estimate-car-image-fallback" aria-hidden="true"></div>`;

  const minText = escapeHtml(formatEstimateToman(estimate.minPrice));
  const maxText = escapeHtml(formatEstimateToman(estimate.maxPrice));
  const midText = escapeHtml(
    formatEstimateToman(estimate.suggestedPrice || estimate.minPrice),
  );
  const adPriceText = escapeHtml(formatEstimateToman(ad.price));
  const location = [ad.city, ad.neighborhood].filter(Boolean).join(" - ");

  return `
    <article class="divar-estimate-card">
      <button type="button" class="estimate-dismiss-btn" id="divarEstimateDismissBtn" aria-label="بستن تخمین">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <div class="estimate-vehicle">
        ${imageHtml}
        <div class="estimate-specs" dir="rtl">
          <div class="estimate-spec-col">
            <span class="estimate-spec-primary">${brand}</span>
            <span class="estimate-spec-secondary">${color}</span>
          </div>
          <div class="estimate-spec-divider" aria-hidden="true"></div>
          <div class="estimate-spec-col">
            <span class="estimate-spec-primary">${model}</span>
            <span class="estimate-spec-secondary">${trim}</span>
          </div>
          <div class="estimate-spec-divider" aria-hidden="true"></div>
          <div class="estimate-spec-col">
            <span class="estimate-spec-primary">${year}</span>
            <span class="estimate-spec-secondary">${mileageText}</span>
          </div>
        </div>
        ${location ? `<p class="estimate-location">${escapeHtml(location)}</p>` : ""}
      </div>

      <div class="estimate-range" dir="ltr">
        <div class="estimate-range-prices">
          <span class="estimate-range-side">${minText}</span>
          <span class="estimate-range-bubble">${midText}</span>
          <span class="estimate-range-side">${maxText}</span>
        </div>
        <div class="estimate-range-bar" aria-hidden="true">
          <span class="estimate-range-seg is-min"></span>
          <span class="estimate-range-seg is-mid"></span>
          <span class="estimate-range-seg is-max"></span>
        </div>
        <div class="estimate-range-labels">
          <span>حداقل</span>
          <span class="estimate-range-center-label">تخمین قیمت خودروی شما</span>
          <span>حداکثر</span>
        </div>
      </div>

      <div class="estimate-ad-row">
        <span class="estimate-ad-label">قیمت آگهی</span>
        <span class="estimate-ad-value">${adPriceText}</span>
      </div>
      <div class="divar-estimate-verdict ${verdictToneClass(estimate.verdict)}">
        نتیجه: <strong>${escapeHtml(estimate.verdict)}</strong>
      </div>
      <button type="button" class="estimate-share-btn" aria-label="اشتراک تخمین قیمت">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 8l-4-4-4 4M12 4v12"/>
        </svg>
        اشتراک تخمین
      </button>
    </article>
  `;
}

function buildEstimateShareSummary(result) {
  const { ad, estimate } = result;
  const title = [estimate.brandFa || ad.brandModelFa, estimate.modelFa].filter(Boolean).join(" ");
  const mid = formatEstimateToman(estimate.suggestedPrice || estimate.minPrice);
  const min = formatEstimateToman(estimate.minPrice);
  const max = formatEstimateToman(estimate.maxPrice);
  return { title: title || "تخمین قیمت خودرو", mid, min, max, verdict: estimate.verdict || "" };
}

async function buildEstimateShareCanvas(result) {
  const summary = buildEstimateShareSummary(result);
  const theme = getShareCardTheme();
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 720;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ساخت تصویر ممکن نشد");

  ctx.fillStyle = theme.bg0 || theme.bg1;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = theme.text;
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.font = '800 42px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText("تخمین قیمت خودرو", width / 2, 88);

  ctx.font = '700 36px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(summary.title, width / 2, 160);

  ctx.fillStyle = theme.accent;
  ctx.font = '800 64px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(summary.mid, width / 2, 300);

  ctx.fillStyle = theme.muted;
  ctx.font = '600 28px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(`از ${summary.min} تا ${summary.max}`, width / 2, 370);

  if (summary.verdict) {
    ctx.fillStyle = theme.text;
    ctx.font = '700 30px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.fillText(`نتیجه: ${summary.verdict}`, width / 2, 450);
  }

  ctx.fillStyle = theme.muted;
  ctx.font = '500 26px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText("برای تصمیم بهتر · اپلیکیشن تصمیم", width / 2, height - 88);
  ctx.fillStyle = theme.accent;
  ctx.font = '800 32px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(SHARE_CARD_BRAND, width / 2, height - 42);

  return canvas;
}

async function shareEstimateResult(result) {
  const canvas = await buildEstimateShareCanvas(result);
  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const fileName = `car-estimate-${Date.now()}.png`;
  const summary = buildEstimateShareSummary(result);
  const shareText = `${summary.title} · ${summary.mid} (${summary.min} – ${summary.max}) · اپلیکیشن تصمیم`;

  if (typeof AndroidApp !== "undefined" && typeof AndroidApp["shareImage"] === "function") {
    AndroidApp["shareImage"](base64, fileName, shareText);
    return { method: "android" };
  }

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) resolve(value);
      else reject(new Error("ساخت فایل تصویر ممکن نشد"));
    }, "image/png");
  });

  const file = new File([blob], fileName, { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: shareText, text: shareText });
    return { method: "web-share" };
  }

  if (navigator.share) {
    await navigator.share({ title: shareText, text: shareText });
    return { method: "web-share-text" };
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return { method: "download" };
}

const DIVAR_POSTLIST_SEARCH_API = "https://api.divar.ir/v8/postlist/w/search";

/**
 * City registry for housing search.
 * Add a city object (Divar city id + slug) and set enabled:true to unlock it in UI.
 */
const HOUSING_CITIES = [
  {
    id: "1",
    slug: "tehran",
    nameFa: "تهران",
    enabled: true,
    deals: {
      buy: {
        key: "buy",
        labelFa: "خرید",
        categoryApi: "apartment-sell",
        webPath: "buy-apartment",
        budgetMode: "price",
      },
      rent: {
        key: "rent",
        labelFa: "رهن و اجاره",
        categoryApi: "apartment-rent",
        webPath: "rent-apartment",
        budgetMode: "credit_rent",
      },
    },
  },
];

const HOUSING_ROOM_OPTIONS = [
  { value: "", label: "همه" },
  { value: "بدون اتاق", label: "بدون اتاق" },
  { value: "یک", label: "۱ خواب" },
  { value: "دو", label: "۲ خواب" },
  { value: "سه", label: "۳ خواب" },
  { value: "چهار", label: "۴ خواب" },
  { value: "پنج یا بیشتر", label: "۵+ خواب" },
];

function getEnabledHousingCities() {
  return HOUSING_CITIES.filter((city) => city && city.enabled !== false);
}

function getHousingCityById(cityId) {
  return HOUSING_CITIES.find((city) => String(city.id) === String(cityId)) || null;
}

function getHousingDeal(city, dealKey) {
  if (!city?.deals) return null;
  return city.deals[dealKey] || city.deals.buy || null;
}

function parseHousingMoneyInput(input) {
  const cleaned = toEnglishNumber(String(input || ""))
    .replace(/[^\d.]/g, "")
    .trim();
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value);
}

function formatHousingMoneyInput(value) {
  if (value == null || Number.isNaN(Number(value))) return "";
  return Number(value).toLocaleString("en-US");
}

function formatCommaSeparatedDigits(input) {
  const cleaned = toEnglishNumber(String(input || "")).replace(/[^\d]/g, "");
  if (!cleaned) return "";
  return Number(cleaned).toLocaleString("en-US");
}

function applyCommaSeparatedNumberInput(el) {
  if (!el) return;
  const selectionStart = el.selectionStart == null ? el.value.length : el.selectionStart;
  const digitsBeforeCursor = toEnglishNumber(el.value.slice(0, selectionStart)).replace(/[^\d]/g, "").length;
  const formatted = formatCommaSeparatedDigits(el.value);
  if (el.value === formatted) return;
  el.value = formatted;
  let seen = 0;
  let pos = formatted.length;
  if (digitsBeforeCursor <= 0) {
    pos = 0;
  } else {
    for (let i = 0; i < formatted.length; i += 1) {
      if (/\d/.test(formatted[i])) {
        seen += 1;
        if (seen >= digitsBeforeCursor) {
          pos = i + 1;
          break;
        }
      }
    }
  }
  try {
    el.setSelectionRange(pos, pos);
  } catch (e) {}
}

function bindCommaSeparatedNumberInput(el) {
  if (!el) return;
  el.addEventListener("input", function () {
    applyCommaSeparatedNumberInput(el);
  });
  el.addEventListener("blur", function () {
    const parsed = parseHousingMoneyInput(el.value);
    el.value = parsed != null ? formatHousingMoneyInput(parsed) : "";
  });
}

function extractDivarHousingImages(payload) {
  const images = [];
  const sections = Array.isArray(payload?.sections) ? payload.sections : [];
  for (const section of sections) {
    for (const widget of section?.widgets || []) {
      if (widget?.widget_type !== "IMAGE_CAROUSEL") continue;
      for (const item of widget?.data?.items || []) {
        const url = item?.image?.url || item?.image?.thumbnail_url || "";
        if (url) images.push(url);
      }
    }
  }
  return [...new Set(images)];
}

function extractDivarHousingSpecs(payload) {
  const specs = {
    size: null,
    year: null,
    rooms: null,
    floor: null,
    totalPriceText: "",
    pricePerMeterText: "",
    creditText: "",
    rentText: "",
    description: "",
  };

  specs.size = findDivarGroupInfoValue(payload, "متراژ") || null;
  specs.year = findDivarGroupInfoValue(payload, "ساخت") || null;
  specs.rooms = findDivarGroupInfoValue(payload, "اتاق") || null;
  specs.floor = findDivarRowValue(payload, "طبقه") || null;
  specs.totalPriceText = findDivarRowValue(payload, "قیمت کل") || "";
  specs.pricePerMeterText = findDivarRowValue(payload, "قیمت هر متر") || "";
  specs.creditText =
    findDivarRowValue(payload, "ودیعه") ||
    findDivarRowValue(payload, "رهن") ||
    findDivarRowValue(payload, "مقدار ودیعه") ||
    "";
  specs.rentText =
    findDivarRowValue(payload, "اجاره") ||
    findDivarRowValue(payload, "اجارهٔ ماهانه") ||
    findDivarRowValue(payload, "مقدار اجاره") ||
    "";

  const sections = Array.isArray(payload?.sections) ? payload.sections : [];
  const descriptionParts = [];
  for (const section of sections) {
    if (section?.section_name !== "DESCRIPTION") continue;
    for (const widget of section?.widgets || []) {
      const widgetType = String(widget?.widget_type || "");
      if (widgetType === "TITLE_ROW") continue;
      const text = String(widget?.data?.text || widget?.data?.description || "").trim();
      if (!text || text === "توضیحات") continue;
      descriptionParts.push(text);
    }
  }
  if (descriptionParts.length) {
    specs.description = descriptionParts.join("\n\n");
  }

  return specs;
}

function mapDivarHousingSearchRow(widget, dealKey) {
  if (!widget || widget.widget_type !== "POST_ROW") return null;
  const data = widget.data || {};
  const token = data.token || pathGet(data, ["action", "payload", "token"], "");
  if (!token) return null;
  const webInfo = pathGet(data, ["action", "payload", "web_info"], {}) || {};
  return {
    token: String(token),
    dealKey: dealKey || "buy",
    title: String(data.title || webInfo.title || "آگهی ملک"),
    thumbUrl: String(data.image_url || ""),
    imageCount: Number(data.image_count) || 0,
    priceText: String(data.middle_description_text || ""),
    creditText: String(data.top_description_text || ""),
    metaText: String(data.bottom_description_text || ""),
    badgeText: String(data.red_text || ""),
    district: String(webInfo.district_persian || ""),
    city: String(webInfo.city_persian || ""),
    url: `https://divar.ir/v/${encodeURIComponent(token)}`,
    images: data.image_url ? [String(data.image_url)] : [],
    size: null,
    year: null,
    rooms: null,
    floor: null,
    totalPriceText: "",
    pricePerMeterText: "",
    rentText: "",
    description: "",
    enriched: false,
  };
}

function buildDivarHousingSearchBody(query, paginationData = null) {
  const city = getHousingCityById(query.cityId) || getEnabledHousingCities()[0];
  if (!city) throw new Error("شهری برای جستجو تنظیم نشده است");
  const deal = getHousingDeal(city, query.dealKey || "buy");
  if (!deal) throw new Error("نوع معامله نامعتبر است");

  const formData = {
    category: { str: { value: deal.categoryApi } },
  };

  if (deal.budgetMode === "price") {
    const maxPrice = parseHousingMoneyInput(query.budgetMax);
    if (maxPrice != null && maxPrice > 0) {
      formData.price = { number_range: { maximum: String(maxPrice) } };
    }
  } else {
    const maxCredit = parseHousingMoneyInput(query.creditMax);
    const maxRent = parseHousingMoneyInput(query.rentMax);
    if (maxCredit != null && maxCredit > 0) {
      formData.credit = { number_range: { maximum: String(maxCredit) } };
    }
    if (maxRent != null && maxRent >= 0) {
      formData.rent = { number_range: { maximum: String(maxRent) } };
    }
  }

  const sizeMin = parseHousingMoneyInput(query.sizeMin);
  const sizeMax = parseHousingMoneyInput(query.sizeMax);
  if ((sizeMin != null && sizeMin > 0) || (sizeMax != null && sizeMax > 0)) {
    formData.size = { number_range: {} };
    if (sizeMin != null && sizeMin > 0) formData.size.number_range.minimum = String(sizeMin);
    if (sizeMax != null && sizeMax > 0) formData.size.number_range.maximum = String(sizeMax);
  }

  if (query.rooms) {
    formData.rooms = { repeated_string: { value: [String(query.rooms)] } };
  }

  const body = {
    city_ids: [String(city.id)],
    search_data: {
      form_data: { data: formData },
      server_payload: {
        "@type": "type.googleapis.com/widgets.SearchData.ServerPayload",
        additional_form_data: {
          data: {
            sort: { str: { value: "sort_date" } },
          },
        },
      },
    },
  };

  if (paginationData) {
    body.pagination_data = paginationData;
  }

  return { city, deal, body };
}

async function searchDivarHousingListings(query, paginationData = null) {
  const { city, deal, body } = buildDivarHousingSearchBody(query, paginationData);
  const referer = `https://divar.ir/s/${city.slug}/${deal.webPath}`;
  const payload = await fetchHttpJson(DIVAR_POSTLIST_SEARCH_API, {
    method: "POST",
    headers: {
      Origin: "https://divar.ir",
      Referer: referer,
    },
    body: JSON.stringify(body),
  });

  const rows = (payload?.list_widgets || [])
    .map((widget) => mapDivarHousingSearchRow(widget, deal.key))
    .filter(Boolean);

  return {
    city,
    deal,
    rows,
    hasNextPage: payload?.pagination?.has_next_page === true,
    paginationData: payload?.pagination?.data || null,
    empty: rows.length === 0,
  };
}

async function getDivarHousingAdByToken(token) {
  const cleaned = String(token || "").trim();
  if (!cleaned) throw new Error("شناسه آگهی نامعتبر است");
  const payload = await fetchHttpJson(`${DIVAR_POST_API_BASE}${encodeURIComponent(cleaned)}`);
  const cat1 = pathGet(payload, ["webengage", "cat_1"], "");
  if (cat1 && cat1 !== "real-estate") {
    throw new Error("این آگهی مربوط به ملک نیست");
  }

  const specs = extractDivarHousingSpecs(payload);
  const images = extractDivarHousingImages(payload);
  const webInfo = pathGet(payload, ["seo", "web_info"], {}) || {};

  return {
    token: cleaned,
    title: pathGet(payload, ["share", "title"], "") || webInfo.title || "آگهی ملک",
    url: pathGet(payload, ["share", "web_url"], `https://divar.ir/v/${encodeURIComponent(cleaned)}`),
    city: webInfo.city_persian || pathGet(payload, ["webengage", "city"], "") || "",
    district: webInfo.district_persian || "",
    images,
    ...specs,
    enriched: true,
  };
}

async function enrichDivarHousingListings(rows, { concurrency = 4, limit = 12 } = {}) {
  const targets = (rows || []).slice(0, limit);
  const enriched = new Array(targets.length);
  let cursor = 0;

  async function worker() {
    while (cursor < targets.length) {
      const index = cursor;
      cursor += 1;
      const row = targets[index];
      try {
        const detail = await getDivarHousingAdByToken(row.token);
        enriched[index] = {
          ...row,
          ...detail,
          dealKey: row.dealKey,
          thumbUrl: detail.images?.[0] || row.thumbUrl,
          images: detail.images?.length ? detail.images : row.images,
          priceText: row.priceText || detail.totalPriceText || detail.rentText || "",
          creditText: row.creditText || detail.creditText || "",
          enriched: true,
        };
      } catch (error) {
        console.warn("Housing detail enrich failed:", row.token, error);
        enriched[index] = row;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, targets.length || 1) }, () => worker());
  await Promise.all(workers);
  return enriched.concat((rows || []).slice(limit));
}

function openExternalUrl(url) {
  const cleaned = String(url || "").trim();
  if (!cleaned) return;
  try {
    if (typeof AndroidApp !== "undefined" && typeof AndroidApp["openUrl"] === "function") {
      AndroidApp["openUrl"](cleaned);
      return;
    }
  } catch {
    // fall through
  }
  try {
    window.open(cleaned, "_blank", "noopener,noreferrer");
  } catch {
    location.href = cleaned;
  }
}

function formatHousingPriceLabel(text, kind) {
  const value = String(text || "").trim();
  if (!value || value === "—") return value;
  if (kind === "credit" && !/ودیعه|رهن/.test(value)) return `ودیعه ${value}`;
  if (kind === "rent" && !/اجاره/.test(value)) return `اجاره ${value}`;
  return value;
}

function renderHousingListingCard(listing) {
  const images = (listing.images && listing.images.length ? listing.images : [listing.thumbUrl]).filter(Boolean);
  const gallery =
    images.length > 0
      ? `<div class="housing-gallery" data-housing-gallery>
          <div class="housing-gallery-track">
            ${images
              .map(
                (src, index) =>
                  `<img class="housing-gallery-image" src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" data-gallery-index="${index}" />`,
              )
              .join("")}
          </div>
          ${
            images.length > 1
              ? `<div class="housing-gallery-dots" aria-hidden="true">${images
                  .map((_, index) => `<span class="housing-gallery-dot${index === 0 ? " is-active" : ""}"></span>`)
                  .join("")}</div>`
              : ""
          }
          <span class="housing-gallery-count">${escapeHtml(String(images.length))} عکس</span>
        </div>`
      : `<div class="housing-gallery housing-gallery-empty">بدون تصویر</div>`;

  const isRent = listing.dealKey === "rent";
  const creditRaw = listing.creditText || "";
  const rentRaw =
    listing.rentText ||
    (listing.priceText && listing.priceText !== creditRaw ? listing.priceText : "") ||
    "";
  const pricePrimary = isRent
    ? formatHousingPriceLabel(creditRaw || "—", "credit")
    : listing.totalPriceText || listing.priceText || "—";
  const priceSecondary = isRent
    ? formatHousingPriceLabel(rentRaw, "rent")
    : listing.pricePerMeterText || "";

  const chips = [
    listing.size ? `${escapeHtml(String(listing.size))} متر` : "",
    listing.rooms
      ? /اتاق|خواب/.test(String(listing.rooms))
        ? escapeHtml(String(listing.rooms))
        : `${escapeHtml(String(listing.rooms))} خواب`
      : "",
    listing.year ? `ساخت ${escapeHtml(String(listing.year))}` : "",
    listing.floor ? `طبقه ${escapeHtml(String(listing.floor))}` : "",
  ].filter(Boolean);

  const locationBits = [listing.city, listing.district].filter(Boolean).map((part) => escapeHtml(part));
  const desc = String(listing.description || "").trim();

  return `
    <article class="housing-card" data-housing-token="${escapeHtml(listing.token)}">
      ${gallery}
      <div class="housing-card-body">
        <div class="housing-price-block">
          <p class="housing-price-primary">${escapeHtml(pricePrimary)}</p>
          ${priceSecondary ? `<p class="housing-price-secondary">${escapeHtml(priceSecondary)}</p>` : ""}
        </div>
        <h3 class="housing-card-title">${escapeHtml(listing.title)}</h3>
        ${locationBits.length ? `<p class="housing-card-location">${locationBits.join(" · ")}</p>` : ""}
        ${
          chips.length
            ? `<div class="housing-chip-row">${chips.map((chip) => `<span class="housing-chip">${chip}</span>`).join("")}</div>`
            : ""
        }
        ${listing.metaText ? `<p class="housing-card-meta">${escapeHtml(listing.metaText)}</p>` : ""}
        ${
          desc
            ? `<p class="housing-card-desc">${escapeHtml(desc.slice(0, 180))}${desc.length > 180 ? "…" : ""}</p>`
            : ""
        }
        <button type="button" class="housing-open-btn" data-housing-details="${escapeHtml(listing.token)}">مشاهده جزئیات</button>
      </div>
    </article>
  `;
}

function renderHousingListingDetailHtml(listing) {
  const images = (listing.images && listing.images.length ? listing.images : [listing.thumbUrl]).filter(Boolean);
  const gallery =
    images.length > 0
      ? `<div class="housing-gallery housing-detail-gallery" data-housing-gallery>
          <div class="housing-gallery-track">
            ${images
              .map(
                (src, index) =>
                  `<img class="housing-gallery-image housing-detail-gallery-image" src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" data-gallery-index="${index}" />`,
              )
              .join("")}
          </div>
          ${
            images.length > 1
              ? `<div class="housing-gallery-dots" aria-hidden="true">${images
                  .map((_, index) => `<span class="housing-gallery-dot${index === 0 ? " is-active" : ""}"></span>`)
                  .join("")}</div>`
              : ""
          }
          <span class="housing-gallery-count">${escapeHtml(String(images.length))} عکس</span>
        </div>`
      : `<div class="housing-gallery housing-gallery-empty housing-detail-gallery-empty">بدون تصویر</div>`;

  const isRent = listing.dealKey === "rent";
  const creditRaw = listing.creditText || "";
  const rentRaw =
    listing.rentText ||
    (listing.priceText && listing.priceText !== creditRaw ? listing.priceText : "") ||
    "";
  const pricePrimary = isRent
    ? formatHousingPriceLabel(creditRaw || "—", "credit")
    : listing.totalPriceText || listing.priceText || "—";
  const priceSecondary = isRent
    ? formatHousingPriceLabel(rentRaw, "rent")
    : listing.pricePerMeterText || "";

  const specRows = [
    { label: "متراژ", value: listing.size ? `${listing.size} متر` : "" },
    { label: "اتاق", value: listing.rooms || "" },
    { label: "ساخت", value: listing.year || "" },
    { label: "طبقه", value: listing.floor || "" },
    { label: "محله", value: listing.district || "" },
    { label: "شهر", value: listing.city || "" },
  ].filter(function (row) {
    return String(row.value || "").trim();
  });

  const locationBits = [listing.city, listing.district].filter(Boolean).map((part) => escapeHtml(part));
  const desc = String(listing.description || "").trim();
  const meta = String(listing.metaText || "").trim();
  const badge = String(listing.badgeText || "").trim();

  return (
    '<div class="housing-detail-body">' +
    gallery +
    '<div class="housing-detail-main">' +
    (badge ? '<span class="housing-detail-badge">' + escapeHtml(badge) + "</span>" : "") +
    '<div class="housing-price-block">' +
    '<p class="housing-price-primary">' +
    escapeHtml(pricePrimary) +
    "</p>" +
    (priceSecondary ? '<p class="housing-price-secondary">' + escapeHtml(priceSecondary) + "</p>" : "") +
    "</div>" +
    '<h3 id="housingDetailTitle" class="housing-detail-title">' +
    escapeHtml(listing.title || "جزئیات آگهی") +
    "</h3>" +
    (locationBits.length ? '<p class="housing-detail-location">' + locationBits.join(" · ") + "</p>" : "") +
    (specRows.length
      ? '<div class="housing-detail-specs">' +
        specRows
          .map(function (row) {
            return (
              '<div class="housing-detail-spec">' +
              '<span class="housing-detail-spec-label">' +
              escapeHtml(row.label) +
              "</span>" +
              '<strong class="housing-detail-spec-value">' +
              escapeHtml(String(row.value)) +
              "</strong></div>"
            );
          })
          .join("") +
        "</div>"
      : "") +
    (meta ? '<p class="housing-detail-meta">' + escapeHtml(meta) + "</p>" : "") +
    (desc
      ? '<div class="housing-detail-desc-wrap"><h4 class="housing-detail-desc-title">توضیحات</h4><p class="housing-detail-desc">' +
        escapeHtml(desc) +
        "</p></div>"
      : '<p class="housing-detail-desc housing-detail-desc-empty">توضیحات تکمیلی برای این آگهی ثبت نشده است.</p>') +
    '<button type="button" class="housing-detail-divar-btn" data-housing-open="' +
    escapeHtml(listing.url || "") +
    '">مشاهده در دیوار</button>' +
    "</div></div>"
  );
}

const SHARE_CARD_BRAND = "تصمیم";
const SHARE_CARD_WIDTH = 1080;
const SHARE_CARD_HEIGHT = 1680;
const SHARE_CARD_ITEMS = [
  { key: "price_dollar_rl", title: "دلار", unit: "تومان", icon: "💵", global: false },
  { key: "crypto-tether-irr", title: "تتر", unit: "تومان", icon: "₮", global: false },
  { key: "geram18", title: "طلای ۱۸ عیار", unit: "تومان", icon: "🥇", global: false },
  { key: "ons", title: "انس جهانی طلا", unit: "دلار", icon: "🌍", global: true },
  { key: "sekee", title: "سکه", unit: "تومان", icon: "🪙", global: false },
  { key: "oil_brent", title: "نفت برنت", unit: "دلار", icon: "🛢", global: true },
];

function formatShareNumber(value, isGlobal = false) {
  const numeric = Number(String(value ?? "").replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return "—";
  if (isGlobal) {
    return numeric.toLocaleString("fa-IR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  return Math.round(numeric).toLocaleString("fa-IR");
}

function formatShareChange(data) {
  if (!data) return { text: "۰٪", tone: "flat" };
  const percent = Number(String(data.dp ?? "").replace(/,/g, ""));
  if (Number.isFinite(percent) && percent !== 0) {
    const abs = Math.abs(percent).toLocaleString("fa-IR", { maximumFractionDigits: 2 });
    return {
      text: `${percent > 0 ? "▲" : "▼"} ${abs}٪`,
      tone: percent > 0 ? "up" : "down",
    };
  }
  if (data.dt === "high") return { text: "▲", tone: "up" };
  if (data.dt === "low") return { text: "▼", tone: "down" };
  return { text: "—", tone: "flat" };
}

function getShareCardTheme() {
  let theme = document.documentElement.getAttribute("data-theme");
  if (!theme && typeof window.AppTheme?.getStoredTheme === "function") {
    theme = window.AppTheme.getStoredTheme();
  }
  if (!theme) {
    try {
      theme = localStorage.getItem("market-prices-theme") === "light" ? "light" : "dark";
    } catch {
      theme = "dark";
    }
  }
  const accent =
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
    (theme === "light" ? "#0f766e" : "#00e5a0");
  if (theme === "light") {
    return {
      bg0: "#f4f7fb",
      bg1: "#e8eef7",
      surface: "#ffffff",
      surfaceSoft: "#f8fafc",
      border: "#e2e8f0",
      text: "#0f172a",
      muted: "#64748b",
      accent,
      danger: "#e11d48",
      flat: "#94a3b8",
      glow: accent,
    };
  }
  return {
    bg0: "#0b1018",
    bg1: "#151c2a",
    surface: "#1b2433",
    surfaceSoft: "#222c3d",
    border: "#2a3344",
    text: "#ffffff",
    muted: "#8b95a8",
    accent,
    danger: "#ff4d6d",
    flat: "#6b778c",
    glow: accent,
  };
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function hexToRgba(hex, alpha) {
  const raw = String(hex || "").replace("#", "").trim();
  if (raw.length !== 3 && raw.length !== 6) return `rgba(0,229,160,${alpha})`;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

async function buildMarketPricesShareCard(current) {
  const rows = SHARE_CARD_ITEMS.map((item) => {
    const data = current?.[item.key];
    if (!data) return null;
    const raw = Number(String(data.p).replace(/,/g, ""));
    const value = item.global ? raw : raw / 10;
    return {
      icon: item.icon,
      title: item.title,
      unit: item.unit,
      value: formatShareNumber(value, item.global),
      change: formatShareChange(data),
    };
  }).filter(Boolean);

  if (!rows.length) {
    throw new Error("قیمتی برای ساخت تصویر اشتراک موجود نیست");
  }

  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }

  const theme = getShareCardTheme();
  const width = SHARE_CARD_WIDTH;
  const headerH = 280;
  const footerH = 160;
  const rowH = 210;
  const gap = 18;
  const height = headerH + rows.length * (rowH + gap) - gap + footerH + 40;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ساخت تصویر ممکن نشد");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, theme.bg0);
  gradient.addColorStop(0.45, theme.bg1);
  gradient.addColorStop(1, theme.bg0);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = hexToRgba(theme.glow, 0.16);
  ctx.beginPath();
  ctx.arc(140, 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexToRgba(theme.glow, 0.1);
  ctx.beginPath();
  ctx.arc(width - 80, height - 120, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexToRgba(theme.accent, 0.08);
  ctx.beginPath();
  ctx.arc(width * 0.55, 420, 180, 0, Math.PI * 2);
  ctx.fill();

  roundRectPath(ctx, width / 2 - 90, 56, 180, 52, 26);
  ctx.fillStyle = hexToRgba(theme.accent, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.35);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = theme.accent;
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.font = '800 30px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(SHARE_CARD_BRAND, width / 2, 91);

  ctx.fillStyle = theme.text;
  ctx.font = '800 54px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText("قیمت‌های لحظه‌ای", width / 2, 176);

  const dateText = formatPersianDateTime(new Date());
  ctx.font = '600 26px "Vazir-FD", Vazir, Tahoma, sans-serif';
  const dateWidth = Math.max(320, ctx.measureText(dateText).width + 48);
  roundRectPath(ctx, width / 2 - dateWidth / 2, 204, dateWidth, 44, 22);
  ctx.fillStyle = theme.surface;
  ctx.fill();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = theme.muted;
  ctx.fillText(dateText, width / 2, 234);

  let y = headerH;
  const cardX = 56;
  const cardW = width - 112;

  rows.forEach((row, index) => {
    ctx.fillStyle = hexToRgba("#000000", 0.18);
    roundRectPath(ctx, cardX + 4, y + 8, cardW, rowH, 32);
    ctx.fill();

    const cardGrad = ctx.createLinearGradient(cardX, y, cardX + cardW, y + rowH);
    cardGrad.addColorStop(0, theme.surface);
    cardGrad.addColorStop(1, theme.surfaceSoft);
    roundRectPath(ctx, cardX, y, cardW, rowH, 32);
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = hexToRgba(theme.accent, 0.85);
    roundRectPath(ctx, cardX, y + 28, 8, rowH - 56, 4);
    ctx.fill();

    const iconCx = width - 132;
    const iconCy = y + 72;
    ctx.beginPath();
    ctx.arc(iconCx, iconCy, 40, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(theme.accent, 0.14);
    ctx.fill();
    ctx.font = '40px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(row.icon, iconCx, iconCy + 14);

    ctx.fillStyle = theme.text;
    ctx.textAlign = "right";
    ctx.font = '800 36px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.fillText(row.title, width - 198, y + 62);

    ctx.fillStyle = theme.muted;
    ctx.font = '600 24px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.fillText(row.unit, width - 198, y + 98);

    ctx.fillStyle = theme.text;
    ctx.textAlign = "left";
    ctx.font = '800 58px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.fillText(row.value, cardX + 36, y + 158);

    const changeColor =
      row.change.tone === "up" ? theme.accent : row.change.tone === "down" ? theme.danger : theme.flat;
    ctx.font = '700 24px "Vazir-FD", Vazir, Tahoma, sans-serif';
    const badgeW = Math.max(150, ctx.measureText(row.change.text).width + 48);
    const badgeX = width - 80 - badgeW;
    const badgeY = y + 136;
    roundRectPath(ctx, badgeX, badgeY, badgeW, 42, 21);
    ctx.fillStyle = hexToRgba(changeColor, 0.16);
    ctx.fill();
    ctx.fillStyle = changeColor;
    ctx.textAlign = "center";
    ctx.fillText(row.change.text, badgeX + badgeW / 2, badgeY + 29);

    ctx.fillStyle = hexToRgba(theme.muted, 0.12);
    ctx.font = '800 64px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.textAlign = "left";
    ctx.fillText(String(index + 1).padStart(2, "0"), cardX + 28, y + 58);

    y += rowH + gap;
  });

  ctx.fillStyle = theme.muted;
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.font = '500 26px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText("برای تصمیم بهتر · قیمت لحظه‌ای بازار", width / 2, height - 88);
  ctx.fillStyle = theme.accent;
  ctx.font = '800 32px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(SHARE_CARD_BRAND, width / 2, height - 42);

  return canvas;
}

async function shareMarketPricesCard(current) {
  const canvas = await buildMarketPricesShareCard(current);
  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const fileName = `market-prices-${Date.now()}.png`;

  if (typeof AndroidApp !== "undefined" && typeof AndroidApp["shareImage"] === "function") {
    AndroidApp["shareImage"](base64, fileName, "اپلیکیشن تصمیم | قیمت لحظه‌ای");
    return { method: "android" };
  }

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("ساخت فایل تصویر ممکن نشد"));
    }, "image/png");
  });

  const file = new File([blob], fileName, { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "اپلیکیشن تصمیم | قیمت لحظه‌ای",
      text: "اپلیکیشن تصمیم | قیمت لحظه‌ای",
    });
    return { method: "web-share" };
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return { method: "download" };
}

function formatPersianDateTime(date) {
  const weekday = date.toLocaleDateString("fa-IR-u-nu-latn", {
    weekday: "long",
    calendar: "persian",
  });
  const day = date.toLocaleDateString("fa-IR-u-nu-latn", {
    day: "numeric",
    calendar: "persian",
  });
  const month = date.toLocaleDateString("fa-IR-u-nu-latn", {
    month: "long",
    calendar: "persian",
  });
  const year = date.toLocaleDateString("fa-IR-u-nu-latn", {
    year: "numeric",
    calendar: "persian",
  });
  const time = date.toLocaleTimeString("fa-IR-u-nu-latn", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${weekday} ${day} ${month} ${year} - ${time}`;
}

function initMarketPrices() {
  const container = document.getElementById("tool-market-prices");
  if (!container) return;

  const loadingEl = container.querySelector("#market-loading");
  const errorEl = container.querySelector("#market-error");
  const pricesPanelEl = container.querySelector("#market-prices-panel");
  const currencyListEl = container.querySelector("#market-currency-list");
  const goldListEl = container.querySelector("#market-gold-list");
  const errorMsgEl = container.querySelector("#market-error-msg");
  const retryBtn = container.querySelector("#market-retry-btn");
  const navRefreshBtn = container.querySelector("#market-nav-refresh");
  const navRefreshIcon = navRefreshBtn?.querySelector("svg") || null;
  const currentDateTimeEl = container.querySelector("#market-current-datetime");
  const currencyViewEl = container.querySelector("#market-view-currency");
  const goldViewEl = container.querySelector("#market-view-gold");
  const carsViewEl = container.querySelector("#market-view-cars");
  const moreViewEl = container.querySelector("#market-view-more");
  const navButtons = container.querySelectorAll("[data-market-tab]");
  const carsLoadingEl = container.querySelector("#cars-loading");
  const carsErrorEl = container.querySelector("#cars-error");
  const carsListWrapEl = container.querySelector("#cars-list-wrap");
  const carsListEl = container.querySelector("#cars-list");
  const carsErrorMsgEl = container.querySelector("#cars-error-msg");
  const carsRetryBtn = container.querySelector("#cars-retry-btn");
  const carsSearchEl = container.querySelector("#cars-search");
  const themeToggleBtn = container.querySelector("#market-theme-toggle");
  const themeToggleValueEl = container.querySelector("#market-theme-toggle-value");
  const alertsEnabledEl = container.querySelector("#market-alerts-enabled");
  const alertsThresholdEl = container.querySelector("#market-alerts-threshold");
  const extensionVersionEl = container.querySelector("#market-extension-version");
  const copyrightYearEl = container.querySelector("#market-copyright-year");
  const priceToastEl = container.querySelector("#market-price-toast");
  const sharePricesBtn = container.querySelector("#market-share-prices-btn");
  const divarUrlInputEl = container.querySelector("#divar-url-input");
  const divarEstimateBtnEl = container.querySelector("#divar-estimate-btn");
  const divarEstimateStatusEl = container.querySelector("#divar-estimate-status");
  const divarEstimateResultEl = container.querySelector("#divar-estimate-result");

  let activeMarketTab = "gold";
  let carRows = [];
  let carsLoaded = false;
  let pricesLoaded = false;
  let latestMarketPrices = null;
  let previousPricesSnapshot = null;
  let toastHideTimer = null;
  let shareCardBusy = false;
  let divarEstimateBusy = false;
  let lastDivarEstimateResult = null;
  let estimateShareBusy = false;

  function setDivarEstimateStatus(message, isError = false, isLoading = false) {
    if (!divarEstimateStatusEl) return;
    if (!message) {
      divarEstimateStatusEl.classList.add("hidden");
      divarEstimateStatusEl.textContent = "";
      divarEstimateStatusEl.classList.remove("is-error");
      divarEstimateStatusEl.classList.remove("is-loading");
      return;
    }
    divarEstimateStatusEl.textContent = message;
    divarEstimateStatusEl.classList.toggle("is-error", !!isError);
    divarEstimateStatusEl.classList.toggle("is-loading", !!isLoading);
    divarEstimateStatusEl.classList.remove("hidden");
  }

  function setDivarEstimateLoading(loading) {
    divarEstimateBusy = loading;
    if (divarEstimateBtnEl) {
      divarEstimateBtnEl.disabled = loading;
      divarEstimateBtnEl.classList.toggle("is-loading", loading);
      const label = divarEstimateBtnEl.querySelector(".divar-estimate-btn-label");
      if (label) label.textContent = loading ? "صبر کنید..." : "تخمین";
    }
    if (divarUrlInputEl) divarUrlInputEl.disabled = loading;
  }

  function clearDivarEstimateResult() {
    lastDivarEstimateResult = null;
    if (divarEstimateResultEl) {
      divarEstimateResultEl.classList.add("hidden");
      divarEstimateResultEl.innerHTML = "";
    }
    setDivarEstimateStatus("");
  }

  function handleEstimateShareClick() {
    if (estimateShareBusy || !lastDivarEstimateResult) return;
    estimateShareBusy = true;
    Promise.resolve(shareEstimateResult(lastDivarEstimateResult))
      .then(() => {
        showPriceToast("تصویر تخمین آماده اشتراک شد");
      })
      .catch((error) => {
        console.error("Estimate share error:", error);
        showPriceToast(error?.message || "اشتراک تخمین ممکن نشد");
      })
      .finally(() => {
        estimateShareBusy = false;
      });
  }

  async function handleDivarEstimateClick() {
    if (divarEstimateBusy) return;
    const url = divarUrlInputEl?.value.trim() || "";
    if (!url) {
      setDivarEstimateStatus("لینک آگهی دیوار را وارد کنید", true);
      return;
    }

    setDivarEstimateLoading(true);
    clearDivarEstimateResult();
    setDivarEstimateStatus("در حال خواندن آگهی و تخمین قیمت...", false, true);

    // AndroidApp.httpGet is synchronous and blocks the JS thread.
    // Yield so the loading spinner can paint before the network call starts.
    await new Promise((resolve) => setTimeout(resolve, 80));

    try {
      const result = await estimateFromDivarUrl(url);
      lastDivarEstimateResult = result;
      if (divarEstimateResultEl) {
        divarEstimateResultEl.innerHTML = renderDivarEstimateResult(result);
        divarEstimateResultEl.classList.remove("hidden");
      }
      setDivarEstimateStatus("");
      if (divarUrlInputEl) divarUrlInputEl.value = "";
    } catch (error) {
      console.error("Divar estimate error:", error);
      setDivarEstimateStatus(error?.message || "تخمین قیمت ممکن نشد", true);
    } finally {
      setDivarEstimateLoading(false);
    }
  }

  async function handleSharePricesClick() {
    if (shareCardBusy) return;
    if (!latestMarketPrices) {
      showPriceToast("ابتدا قیمت‌ها را دریافت کنید");
      return;
    }
    shareCardBusy = true;
    if (sharePricesBtn) sharePricesBtn.disabled = true;
    try {
      await shareMarketPricesCard(latestMarketPrices);
      showPriceToast("تصویر قیمت آماده اشتراک شد");
    } catch (error) {
      console.error("Share card error:", error);
      showPriceToast(error?.message || "اشتراک‌گذاری تصویر قیمت ممکن نشد");
    } finally {
      shareCardBusy = false;
      if (sharePricesBtn) sharePricesBtn.disabled = false;
    }
  }

  function isPriceTab(tab) {
    return tab === "currency" || tab === "gold";
  }

  function getDefaultAlertSettings() {
    return {
      enabled: false,
      threshold: DEFAULT_ALERT_THRESHOLD,
      marketHoursOnly: false,
      watch: {
        price_dollar_rl: true,
        geram18: true,
        sekee: false,
      },
    };
  }

  function getAlertSettings() {
    try {
      const raw = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
      if (!raw) return getDefaultAlertSettings();
      const parsed = JSON.parse(raw);
      const threshold = Number(parsed.threshold);
      const defaults = getDefaultAlertSettings();
      const watch = Object.assign({}, defaults.watch, parsed.watch || {});
      return {
        enabled: parsed.enabled === true,
        threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
        marketHoursOnly: parsed.marketHoursOnly === true,
        watch,
      };
    } catch {
      return getDefaultAlertSettings();
    }
  }

  function saveAlertSettings(settings) {
    localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(settings));
  }

  function loadPreviousPricesSnapshot() {
    try {
      const raw = localStorage.getItem(PREVIOUS_PRICES_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function savePreviousPricesSnapshot(current) {
    const snapshot = {};
    ALERT_WATCH_ITEMS.forEach(({ key }) => {
      const data = current[key];
      if (data?.p != null) snapshot[key] = data.p;
    });
    try {
      localStorage.setItem(PREVIOUS_PRICES_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* ignore */
    }
    previousPricesSnapshot = snapshot;
  }

  function showPriceToast(message) {
    if (!priceToastEl) return;
    priceToastEl.textContent = message;
    priceToastEl.classList.remove("hidden");
    priceToastEl.classList.add("is-visible");
    if (toastHideTimer) clearTimeout(toastHideTimer);
    toastHideTimer = setTimeout(() => {
      priceToastEl.classList.remove("is-visible");
      priceToastEl.classList.add("hidden");
    }, 5000);
  }

  function tryShowBrowserNotification(title, body) {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      new Notification(title, { body });
      return;
    }
    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") new Notification(title, { body });
      });
    }
  }

  function checkPriceAlerts(current, { silent = false } = {}) {
    const settings = getAlertSettings();
    if (!settings.enabled) {
      savePreviousPricesSnapshot(current);
      return;
    }

    if (settings.marketHoursOnly && !isTehranMarketHours()) {
      savePreviousPricesSnapshot(current);
      return;
    }

    const prev = previousPricesSnapshot || loadPreviousPricesSnapshot();
    if (!prev) {
      savePreviousPricesSnapshot(current);
      return;
    }

    const alerts = [];
    ALERT_WATCH_ITEMS.forEach(({ key, title, settingsKey }) => {
      const watchKey = settingsKey || key;
      if (settings.watch && settings.watch[watchKey] === false) return;

      const prevRaw = prev[key];
      const nextRaw = current[key]?.p;
      if (prevRaw == null || nextRaw == null) return;

      const prevVal = toDisplayValue(prevRaw, false);
      const nextVal = toDisplayValue(nextRaw, false);
      if (Number.isNaN(prevVal) || Number.isNaN(nextVal) || prevVal === 0) return;

      const changePercent = ((nextVal - prevVal) / prevVal) * 100;
      if (Math.abs(changePercent) < settings.threshold) return;

      const direction = changePercent > 0 ? "افزایش" : "کاهش";
      alerts.push(
        `${title}: ${direction} ${Math.abs(changePercent).toLocaleString("fa-IR", { maximumFractionDigits: 2 })}٪`,
      );
    });

    savePreviousPricesSnapshot(current);

    if (!alerts.length) return;

    const message = alerts.join(" · ");
    showPriceToast(message);
    tryShowBrowserNotification("تغییر قیمت", message);
  }

  function syncThemeToggleDisplay() {
    const theme =
      typeof window.AppTheme?.getStoredTheme === "function"
        ? window.AppTheme.getStoredTheme()
        : "dark";
    if (themeToggleValueEl) {
      themeToggleValueEl.textContent = theme === "light" ? "تم روشن" : "تم تاریک";
    }
  }

  function initMoreTab() {
    const alertSettings = getAlertSettings();
    previousPricesSnapshot = loadPreviousPricesSnapshot();

    if (alertsEnabledEl) alertsEnabledEl.checked = alertSettings.enabled;
    if (alertsThresholdEl) {
      alertsThresholdEl.value = String(alertSettings.threshold);
    }

    if (extensionVersionEl) {
      try {
        extensionVersionEl.textContent =
          typeof chrome !== "undefined" && chrome.runtime?.getManifest
            ? chrome.runtime.getManifest().version
            : "—";
      } catch {
        extensionVersionEl.textContent = "—";
      }
    }

    if (copyrightYearEl) {
      copyrightYearEl.textContent = String(new Date().getFullYear());
    }

    syncThemeToggleDisplay();

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        if (typeof window.AppTheme?.toggleTheme === "function") {
          window.AppTheme.toggleTheme();
        }
        syncThemeToggleDisplay();
      });
      document.addEventListener("app-theme-change", syncThemeToggleDisplay);
    }

    if (alertsEnabledEl) {
      alertsEnabledEl.addEventListener("change", () => {
        saveAlertSettings({
          ...getAlertSettings(),
          enabled: alertsEnabledEl.checked,
        });
      });
    }

    if (alertsThresholdEl) {
      alertsThresholdEl.addEventListener("change", () => {
        const threshold = Number(alertsThresholdEl.value);
        saveAlertSettings({
          ...getAlertSettings(),
          threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
        });
      });
    }
  }

  function tickCurrentDateTime() {
    if (!currentDateTimeEl) return;
    currentDateTimeEl.textContent = formatPersianDateTime(new Date());
  }

  if (currentDateTimeTimer) clearInterval(currentDateTimeTimer);
  tickCurrentDateTime();
  currentDateTimeTimer = setInterval(tickCurrentDateTime, 1000);

  function setRefreshBusy(busy) {
    if (navRefreshIcon) navRefreshIcon.classList.toggle("spin", busy);
    if (navRefreshBtn) navRefreshBtn.disabled = busy;
  }

  function showLoading() {
    showPriceLists({ endRefreshBusy: false });
    setRefreshBusy(true);
  }

  function showError(message) {
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");
    currencyListEl.classList.add("hidden");
    goldListEl.classList.add("hidden");
    errorMsgEl.textContent = message;
    setRefreshBusy(false);
  }

  function showPriceLists(options) {
    const endRefreshBusy = !options || options.endRefreshBusy !== false;
    loadingEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    if (activeMarketTab === "gold") {
      currencyListEl.classList.add("hidden");
      goldListEl.classList.remove("hidden");
    } else if (activeMarketTab === "currency") {
      goldListEl.classList.add("hidden");
      currencyListEl.classList.remove("hidden");
    } else {
      currencyListEl.classList.remove("hidden");
      goldListEl.classList.remove("hidden");
    }
    if (endRefreshBusy) setRefreshBusy(false);
  }

  function parseNumber(value) {
    if (value == null) return NaN;
    return Number(String(value).replace(/,/g, ""));
  }

  function toDisplayValue(value, isGlobal) {
    const num = parseNumber(value);
    if (Number.isNaN(num)) return NaN;
    return isGlobal ? num : num / 10;
  }

  function formatPrice(value, isGlobal) {
    const num = toDisplayValue(value, isGlobal);
    if (Number.isNaN(num)) return "—";

    if (isGlobal) {
      return num.toLocaleString("fa-IR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return num.toLocaleString("fa-IR");
  }

  function getChangeClasses(dt) {
    if (dt === "high") return "text-[var(--mp-accent)] bg-[var(--mp-surface-2)]";
    if (dt === "low") return "text-[var(--mp-danger)] bg-[var(--mp-surface-2)]";
    return "text-[var(--mp-muted)] bg-[var(--mp-surface-2)]";
  }

  function getChangeArrow(dt) {
    if (dt === "high") return "▲";
    if (dt === "low") return "▼";
    return "—";
  }

  function calculateRealGoldPrice(current) {
    const intrinsic = current.gold_intrinsic_18;
    if (intrinsic?.p) {
      const price = toDisplayValue(intrinsic.p, false);
      if (!Number.isNaN(price)) return price;
    }

    const onsData = current.ons;
    const dollarData = current.price_dollar_rl;
    if (!onsData || !dollarData) return NaN;

    const ons = parseNumber(onsData.p);
    const dollar = toDisplayValue(dollarData.p, false);

    if (Number.isNaN(ons) || Number.isNaN(dollar)) return NaN;

    return (ons * dollar) / REAL_GOLD_DIVISOR;
  }

  function getRealGoldPriceDiff(current) {
    const realPrice = calculateRealGoldPrice(current);
    const marketPrice = toDisplayValue(current.geram18?.p, false);
    if (Number.isNaN(realPrice) || Number.isNaN(marketPrice)) return NaN;
    return realPrice - marketPrice;
  }

  function getRealGoldOpportunity(diff) {
    if (Number.isNaN(diff)) return null;
    if (diff <= -REAL_GOLD_DIFF_THRESHOLD) {
      return { label: "فرصت فروش", color: "text-[#ff4d6d]" };
    }
    if (diff >= REAL_GOLD_DIFF_THRESHOLD) {
      return { label: "فرصت خرید", color: "text-[var(--mp-accent)]" };
    }
    return null;
  }

  function createRealGoldCard(current) {
    const price = calculateRealGoldPrice(current);
    const opportunity = getRealGoldOpportunity(getRealGoldPriceDiff(current));
    const onsTime = current.ons?.t || "";
    const dollarTime = current.price_dollar_rl?.t || "";

    const card = document.createElement("div");
    card.className =
      "price-card-full bg-gradient-to-l from-[var(--mp-surface-2)] to-[var(--mp-surface)] rounded-xl p-2.5 border border-[var(--mp-border)] flex items-center gap-2.5";

    card.innerHTML = `
      <div class="text-xl shrink-0 w-8 text-center">✨</div>
      <div class="flex-1 min-w-0 relative pb-4">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-sm text-[var(--mp-text)]">ارزش ذاتی طلای ۱۸ عیار</h3>
          <span class="text-[10px] text-[var(--mp-muted)]">${onsTime || dollarTime}</span>
        </div>
        <div class="flex items-baseline gap-1 mt-0.5">
          <span class="text-lg font-bold text-[var(--mp-text)]">${
            Number.isNaN(price)
              ? "—"
              : price.toLocaleString("fa-IR", {
                  maximumFractionDigits: 0,
                })
          }</span>
          <span class="text-[10px] text-[var(--mp-muted)]">تومان</span>
        </div>
        ${
          opportunity
            ? `<span class="absolute bottom-0 left-0 text-[10px] font-semibold ${opportunity.color}">${opportunity.label}</span>`
            : ""
        }
      </div>
    `;

    return card;
  }

  function calculateCoinGoldRatio(current) {
    const coinData = current.sekee;
    const goldData = current.geram18;
    if (!coinData || !goldData) return NaN;

    const coinPrice = toDisplayValue(coinData.p, false);
    const goldPerGram = toDisplayValue(goldData.p, false);

    if (Number.isNaN(coinPrice) || Number.isNaN(goldPerGram) || goldPerGram === 0) {
      return NaN;
    }

    return coinPrice / goldPerGram;
  }

  function getCoinGoldAdvice(ratio) {
    if (Number.isNaN(ratio)) return null;

    if (ratio >= 9.5 && ratio <= 10) {
      return {
        message: "طلای آبشده خود را به سکه تبدیل کنید",
        tone: "buy-coin",
      };
    }

    if (ratio >= 11 && ratio <= 11.5) {
      return {
        message: "سکه های خود را به طلای آبشده تبدیل کنید",
        tone: "buy-melted",
      };
    }

    return null;
  }

  function parseLocalizedNumber(value) {
    if (value == null || value === "") return NaN;
    const persian = "۰۱۲۳۴۵۶۷۸۹";
    const arabic = "٠١٢٣٤٥٦٧٨٩";
    const normalized = String(value)
      .replace(/[۰-۹]/g, (char) => String(persian.indexOf(char)))
      .replace(/[٠-٩]/g, (char) => String(arabic.indexOf(char)))
      .replace(/,/g, "")
      .replace(/٬/g, "")
      .trim();
    return Number(normalized);
  }

  function parseGoldGrams(value) {
    if (value == null || value === "") return NaN;
    const persian = "۰۱۲۳۴۵۶۷۸۹";
    const arabic = "٠١٢٣٤٥٦٧٨٩";
    const str = String(value)
      .replace(/[۰-۹]/g, (char) => String(persian.indexOf(char)))
      .replace(/[٠-٩]/g, (char) => String(arabic.indexOf(char)))
      .replace(/,/g, "")
      .replace(/٬/g, "")
      .trim();
    if (!str || !/^\d+(\.\d+)?$/.test(str)) return NaN;

    const [wholePart, fracPart = ""] = str.split(".");
    const wholeGrams = Number(wholePart);
    if (Number.isNaN(wholeGrams) || wholeGrams < 0) return NaN;
    if (!fracPart) return wholeGrams;

    const sot = Number(fracPart.padEnd(3, "0").slice(0, 3));
    if (Number.isNaN(sot) || sot < 0 || sot > 999) return NaN;

    return wholeGrams + sot / 1000;
  }

  function parseGoldWeightInput(value, weightUnit) {
    if (weightUnit === "sot") {
      const sot = parseLocalizedNumber(value);
      if (Number.isNaN(sot) || sot < 0) return NaN;
      return sot / 1000;
    }
    return parseGoldGrams(value);
  }

  function formatWeightInputFromGrams(grams, weightUnit) {
    if (Number.isNaN(grams) || grams < 0) return "";
    if (weightUnit === "sot") {
      return String(Math.round(grams * 1000));
    }
    const whole = Math.floor(grams + 1e-9);
    const sot = Math.round((grams - whole) * 1000);
    if (sot === 0) return String(whole);
    return `${whole}.${String(sot).padStart(3, "0")}`;
  }

  function formatGoldWeight(grams) {
    if (Number.isNaN(grams) || grams < 0) return "—";
    const whole = Math.floor(grams + 1e-9);
    const sot = Math.round((grams - whole) * 1000);
    if (sot === 0) return `${whole.toLocaleString("fa-IR")} گرم`;
    return `${whole.toLocaleString("fa-IR")} گرم و ${sot.toLocaleString("fa-IR")} سوت`;
  }

  function getDefaultGoldWageSettings() {
    return { grams: "1", weightUnit: "gram", wageMode: "percent", wageValue: "", expanded: false };
  }

  function getGoldWageSettings() {
    try {
      const raw = localStorage.getItem(GOLD_WAGE_STORAGE_KEY);
      if (!raw) return getDefaultGoldWageSettings();
      return { ...getDefaultGoldWageSettings(), ...JSON.parse(raw) };
    } catch {
      return getDefaultGoldWageSettings();
    }
  }

  function saveGoldWageSettings(settings) {
    localStorage.setItem(GOLD_WAGE_STORAGE_KEY, JSON.stringify(settings));
  }

  function calculateGoldSellerBreakdown(totalPrice, pricePerGram, grams) {
    if (
      Number.isNaN(totalPrice) ||
      totalPrice <= 0 ||
      Number.isNaN(pricePerGram) ||
      pricePerGram <= 0 ||
      Number.isNaN(grams) ||
      grams <= 0
    ) {
      return null;
    }

    const goldBase = pricePerGram * grams;
    const wageAmount = totalPrice - goldBase;
    const wagePercent = goldBase > 0 ? (wageAmount / goldBase) * 100 : NaN;

    return { grams, goldBase, wageAmount, wagePercent };
  }

  function getDefaultGoldSellerSettings() {
    return { totalPrice: "", grams: "1", weightUnit: "gram", expanded: false };
  }

  function getGoldSellerSettings() {
    try {
      const raw = localStorage.getItem(GOLD_SELLER_STORAGE_KEY);
      if (!raw) return getDefaultGoldSellerSettings();
      return { ...getDefaultGoldSellerSettings(), ...JSON.parse(raw) };
    } catch {
      return getDefaultGoldSellerSettings();
    }
  }

  function saveGoldSellerSettings(settings) {
    localStorage.setItem(GOLD_SELLER_STORAGE_KEY, JSON.stringify(settings));
  }

  function calculateGoldWageBreakdown(pricePerGram, grams, wageMode, wageValue) {
    if (Number.isNaN(pricePerGram) || Number.isNaN(grams) || grams <= 0) return null;

    const goldBase = pricePerGram * grams;
    let wagePerGram = NaN;
    let wageAmount = NaN;

    if (wageMode === "percent") {
      if (Number.isNaN(wageValue) || wageValue < 0) {
        return { goldBase, wagePerGram: NaN, wageAmount: NaN, total: NaN };
      }
      wagePerGram = pricePerGram * (wageValue / 100);
      wageAmount = wagePerGram * grams;
    } else {
      if (Number.isNaN(wageValue) || wageValue < 0) {
        return { goldBase, wagePerGram: NaN, wageAmount: NaN, total: NaN };
      }
      wagePerGram = wageValue;
      wageAmount = wagePerGram * grams;
    }

    return {
      goldBase,
      wagePerGram,
      wageAmount,
      total: goldBase + wageAmount,
    };
  }

  function formatTomans(value) {
    if (Number.isNaN(value)) return "—";
    return value.toLocaleString("fa-IR", { maximumFractionDigits: 0 });
  }

  function getWageValueDisplay(value, mode) {
    if (!value) return "";
    if (mode !== "amount") return value;
    const num = parseLocalizedNumber(value);
    return Number.isNaN(num) ? value : num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function formatWageAmountInput(value) {
    const digits = String(value)
      .replace(/[۰-۹]/g, (char) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(char)))
      .replace(/[٠-٩]/g, (char) => String("٠١٢٣٤٥٦٧٨٩".indexOf(char)))
      .replace(/[^\d]/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("en-US");
  }

  function createCoinGoldAdviceCard(current) {
    const ratio = calculateCoinGoldRatio(current);
    const advice = getCoinGoldAdvice(ratio);
    const coinTime = current.sekee?.t || "";
    const goldTime = current.geram18?.t || "";

    const ratioText = Number.isNaN(ratio)
      ? "—"
      : ratio.toLocaleString("fa-IR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        });

    const refLow = COIN_GOLD_RATIO_BUY_COIN.toLocaleString("fa-IR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    const refHigh = COIN_GOLD_RATIO_BUY_MELTED.toLocaleString("fa-IR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    const ratioPosition = Number.isNaN(ratio)
      ? 50
      : Math.max(
          0,
          Math.min(
            100,
            ((ratio - COIN_GOLD_RATIO_BUY_COIN) /
              (COIN_GOLD_RATIO_BUY_MELTED - COIN_GOLD_RATIO_BUY_COIN)) *
              100,
          ),
        );

    const adviceColor =
      advice?.tone === "buy-coin" ? "text-[var(--mp-accent)]" : "text-[var(--mp-warn)]";

    const card = document.createElement("div");
    card.className =
      "price-card-full bg-gradient-to-l from-[var(--mp-surface-2)] to-[var(--mp-surface)] rounded-xl p-2.5 border border-[var(--mp-border)] flex items-center gap-2.5";

    card.innerHTML = `
      <div class="text-xl shrink-0 w-8 text-center">⚖️</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-sm text-[var(--mp-text)]">نسبت خرید سکه به طلای آبشده</h3>
          <span class="text-[10px] text-[var(--mp-muted)]">${coinTime || goldTime}</span>
        </div>
        <div dir="ltr" class="mt-2 space-y-2">
          <div class="flex items-stretch gap-1.5">
            <div class="flex-1 rounded-lg border border-[var(--mp-accent)]/30 bg-[var(--mp-accent)]/10 px-1.5 py-1.5 text-center min-w-0">
              <p class="text-[9px] font-semibold text-[var(--mp-accent)] leading-tight">خرید سکه</p>
              <p class="text-sm font-bold text-[var(--mp-accent)] tabular-nums mt-0.5">${refLow}</p>
            </div>
            <div class="flex flex-col items-center justify-center px-1.5 py-1 shrink-0 min-w-[3.5rem]">
              <p class="text-[9px] text-[var(--mp-muted)] mb-0.5">نسبت</p>
              <p class="text-xl font-bold text-[var(--mp-text)] tabular-nums leading-none">${ratioText}</p>
            </div>
            <div class="flex-1 rounded-lg border border-[var(--mp-warn)]/30 bg-[var(--mp-warn)]/10 px-1.5 py-1.5 text-center min-w-0">
              <p class="text-[9px] font-semibold text-[var(--mp-warn)] leading-tight">خرید طلای آبشده</p>
              <p class="text-sm font-bold text-[var(--mp-warn)] tabular-nums mt-0.5">${refHigh}</p>
            </div>
          </div>
          <div class="relative h-1 rounded-full bg-[var(--mp-border-2)] overflow-visible">
            <div
              class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--mp-accent)]/50 to-[var(--mp-warn)]/50"
              style="width: 100%"
            ></div>
            <div
              class="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-[var(--mp-bg)] shadow-sm"
              style="left: calc(${ratioPosition}% - 5px)"
            ></div>
          </div>
        </div>
        ${
          advice
            ? `<p class="text-[10px] text-center mt-1.5 font-medium ${adviceColor}">${advice.message}</p>`
            : ""
        }
      </div>
    `;

    return card;
  }

  function createGoldWageCard(current) {
    const settings = getGoldWageSettings();
    const pricePerGram = toDisplayValue(current.geram18?.p, false);
    const goldTime = current.geram18?.t || "";
    let isExpanded = settings.expanded === true;

    const card = document.createElement("div");
    card.className =
      "price-card-full flex flex-col items-stretch self-start h-auto bg-gradient-to-l from-[var(--mp-surface-2)] to-[var(--mp-surface)] rounded-xl p-2.5 border border-[var(--mp-border)] min-w-0";

    card.innerHTML = `
      <button
        type="button"
        id="gold-wage-toggle"
        class="w-full flex items-center justify-between gap-2 text-right"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xl shrink-0">🧮</span>
          <h3 class="font-bold text-sm text-[var(--mp-text)]">محاسبه قیمت طلا با اجرت</h3>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[10px] text-[var(--mp-muted)]">${goldTime}</span>
          <span id="gold-wage-chevron" class="text-[var(--mp-muted)] text-xs transition-transform duration-200">▼</span>
        </div>
      </button>

      <div id="gold-wage-body" class="hidden mt-3 space-y-3 min-w-0">
        <div class="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2 items-center">
          <label class="shrink-0 text-[11px] text-[var(--mp-muted)] leading-tight" for="gold-wage-grams">وزن طلا</label>
          <div class="flex min-w-0 items-stretch gap-1.5">
            <div class="flex shrink-0 self-stretch overflow-hidden rounded-lg border border-[var(--mp-border-2)] divide-x divide-x-reverse divide-[var(--mp-border-2)]" role="group" aria-label="واحد وزن">
              <button type="button" data-weight-unit="gram"
                class="gold-weight-unit-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                گرم
              </button>
              <button type="button" data-weight-unit="sot"
                class="gold-weight-unit-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                صوت
              </button>
            </div>
            <input
              id="gold-wage-grams"
              type="text"
              inputmode="decimal"
              dir="ltr"
              value="${settings.grams}"
              placeholder="1.600"
              title="مثال: 1.600 یعنی ۱ گرم و ۶۰۰ سوت"
              class="min-w-0 flex-1 rounded-lg border border-[var(--mp-border-2)] bg-[var(--mp-bg)] px-2 py-2 text-sm text-[var(--mp-text)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--mp-accent)] tabular-nums"
            />
          </div>
        </div>

        <div class="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2 items-center">
          <label class="shrink-0 text-[11px] text-[var(--mp-muted)] leading-tight" for="gold-wage-value">
            <span id="gold-wage-value-label">اجرت طلا</span>
          </label>
          <div class="flex min-w-0 items-stretch gap-1.5">
            <div class="flex shrink-0 self-stretch overflow-hidden rounded-lg border border-[var(--mp-border-2)] divide-x divide-x-reverse divide-[var(--mp-border-2)]" role="group" aria-label="نوع اجرت">
              <button type="button" data-wage-mode="percent"
                class="gold-wage-mode-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                درصد
              </button>
              <button type="button" data-wage-mode="amount"
                class="gold-wage-mode-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                مبلغ
              </button>
            </div>
            <input
              id="gold-wage-value"
              type="text"
              inputmode="decimal"
              dir="ltr"
              value="${getWageValueDisplay(settings.wageValue, settings.wageMode === "amount" ? "amount" : "percent")}"
              placeholder="3"
              class="min-w-0 flex-1 rounded-lg border border-[var(--mp-border-2)] bg-[var(--mp-bg)] px-2 py-2 text-sm text-[var(--mp-text)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--mp-accent)] tabular-nums"
            />
          </div>
        </div>

        <div class="rounded-lg border border-[var(--mp-border-2)] bg-[var(--mp-bg)]/60 p-3 space-y-2 text-xs min-w-0">
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">وزن طلا</span>
            <span id="gold-wage-weight" class="text-[var(--mp-text)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">هر گرم</span>
            <span id="gold-wage-price-per-gram" class="text-[var(--mp-text)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">خام</span>
            <span id="gold-wage-base" class="text-[var(--mp-text)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">اجرت/گرم</span>
            <span id="gold-wage-per-gram" class="text-[var(--mp-warn)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">جمع اجرت</span>
            <span id="gold-wage-fee" class="text-[var(--mp-warn)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="h-px bg-[var(--mp-border-2)] my-0.5"></div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-text)] font-semibold shrink-0">جمع کل</span>
            <span id="gold-wage-total" class="text-base font-bold text-[var(--mp-accent)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
        </div>
      </div>
    `;

    const toggleBtn = card.querySelector("#gold-wage-toggle");
    const bodyEl = card.querySelector("#gold-wage-body");
    const chevronEl = card.querySelector("#gold-wage-chevron");
    const gramsInput = card.querySelector("#gold-wage-grams");
    const wageValueInput = card.querySelector("#gold-wage-value");
    const wageValueLabel = card.querySelector("#gold-wage-value-label");
    const modeButtons = card.querySelectorAll(".gold-wage-mode-btn");
    const weightUnitButtons = card.querySelectorAll(".gold-weight-unit-btn");
    let wageMode = settings.wageMode === "amount" ? "amount" : "percent";
    let weightUnit = settings.weightUnit === "sot" ? "sot" : "gram";

    function getCurrentSettings() {
      return {
        grams: gramsInput.value,
        weightUnit,
        wageMode,
        wageValue: wageValueInput.value,
        expanded: isExpanded,
      };
    }

    function setExpanded(expanded) {
      isExpanded = expanded;
      bodyEl.classList.toggle("hidden", !expanded);
      chevronEl.classList.toggle("rotate-180", expanded);
      saveGoldWageSettings(getCurrentSettings());
    }

    function updateWeightUnitButtons() {
      weightUnitButtons.forEach((button) => {
        const active = button.dataset.weightUnit === weightUnit;
        button.className = `gold-weight-unit-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap ${
          active
            ? "bg-[var(--mp-accent)]/15 text-[var(--mp-accent)]"
            : "bg-[var(--mp-bg)] text-[var(--mp-muted)] hover:text-[var(--mp-text)]"
        }`;
      });
      if (weightUnit === "sot") {
        gramsInput.placeholder = "۹۰۰";
        gramsInput.title = "مثلاً ۹ یعنی ۹ صوت";
        gramsInput.inputMode = "numeric";
      } else {
        gramsInput.placeholder = "1.600";
        gramsInput.title = "مثال: 1.600 یعنی ۱ گرم و ۶۰۰ سوت";
        gramsInput.inputMode = "decimal";
      }
    }

    function updateModeButtons() {
      modeButtons.forEach((button) => {
        const active = button.dataset.wageMode === wageMode;
        button.className = `gold-wage-mode-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap ${
          active
            ? "bg-[var(--mp-accent)]/15 text-[var(--mp-accent)]"
            : "bg-[var(--mp-bg)] text-[var(--mp-muted)] hover:text-[var(--mp-text)]"
        }`;
      });
      wageValueLabel.textContent = wageMode === "percent" ? "اجرت طلا٪" : "اجرت طلا";
      wageValueInput.placeholder = wageMode === "percent" ? "۳" : "۲۰۰,۰۰۰";
      wageValueInput.inputMode = wageMode === "amount" ? "numeric" : "decimal";
      if (wageMode === "amount" && wageValueInput.value.trim()) {
        wageValueInput.value = formatWageAmountInput(wageValueInput.value);
      }
    }

    function onWageValueInput() {
      if (wageMode === "amount") {
        const selectionStart = wageValueInput.selectionStart == null ? wageValueInput.value.length : wageValueInput.selectionStart;
        const digitsBeforeCursor = toEnglishNumber(wageValueInput.value.slice(0, selectionStart)).replace(/[^\d]/g, "").length;
        const formatted = formatWageAmountInput(wageValueInput.value);
        wageValueInput.value = formatted;
        let seen = 0;
        let pos = formatted.length;
        if (digitsBeforeCursor <= 0) {
          pos = 0;
        } else {
          for (let i = 0; i < formatted.length; i += 1) {
            if (/\d/.test(formatted[i])) {
              seen += 1;
              if (seen >= digitsBeforeCursor) {
                pos = i + 1;
                break;
              }
            }
          }
        }
        try {
          wageValueInput.setSelectionRange(pos, pos);
        } catch (e) {}
      }
      persistAndUpdate();
    }

    function updateGoldWageDisplay() {
      const grams = parseGoldWeightInput(gramsInput.value, weightUnit);
      const wageValue = parseLocalizedNumber(wageValueInput.value);
      const hasWageInput = wageValueInput.value.trim() !== "" && !Number.isNaN(wageValue);
      const breakdown = hasWageInput
        ? calculateGoldWageBreakdown(pricePerGram, grams, wageMode, wageValue)
        : null;
      const goldBase =
        !Number.isNaN(grams) && grams > 0 && !Number.isNaN(pricePerGram)
          ? pricePerGram * grams
          : NaN;

      card.querySelector("#gold-wage-weight").textContent = formatGoldWeight(grams);
      card.querySelector("#gold-wage-price-per-gram").textContent = `${formatTomans(pricePerGram)} تومان`;
      card.querySelector("#gold-wage-base").textContent = Number.isNaN(goldBase)
        ? "—"
        : `${formatTomans(goldBase)} تومان`;

      if (wageMode === "percent") {
        card.querySelector("#gold-wage-per-gram").textContent = hasWageInput
          ? `${wageValue.toLocaleString("fa-IR")}٪`
          : "—";
      } else {
        card.querySelector("#gold-wage-per-gram").textContent =
          breakdown && !Number.isNaN(breakdown.wagePerGram)
            ? `${formatTomans(breakdown.wagePerGram)} تومان`
            : "—";
      }

      card.querySelector("#gold-wage-fee").textContent =
        breakdown && !Number.isNaN(breakdown.wageAmount)
          ? `${formatTomans(breakdown.wageAmount)} تومان`
          : "—";
      card.querySelector("#gold-wage-total").textContent =
        breakdown && !Number.isNaN(breakdown.total)
          ? `${formatTomans(breakdown.total)} تومان`
          : "—";
    }

    function persistAndUpdate() {
      saveGoldWageSettings(getCurrentSettings());
      updateGoldWageDisplay();
    }

    toggleBtn.addEventListener("click", () => {
      setExpanded(!isExpanded);
    });

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = button.dataset.wageMode === "amount" ? "amount" : "percent";
        if (nextMode !== wageMode) {
          wageMode = nextMode;
          wageValueInput.value = "";
          updateModeButtons();
          persistAndUpdate();
        }
        wageValueInput.focus();
      });
    });

    weightUnitButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextUnit = button.dataset.weightUnit === "sot" ? "sot" : "gram";
        if (nextUnit === weightUnit) {
          gramsInput.focus();
          return;
        }
        const currentGrams = parseGoldWeightInput(gramsInput.value, weightUnit);
        weightUnit = nextUnit;
        gramsInput.value = Number.isNaN(currentGrams)
          ? ""
          : formatWeightInputFromGrams(currentGrams, weightUnit);
        updateWeightUnitButtons();
        persistAndUpdate();
        gramsInput.focus();
      });
    });

    gramsInput.addEventListener("input", persistAndUpdate);
    wageValueInput.addEventListener("input", onWageValueInput);

    updateWeightUnitButtons();
    updateModeButtons();
    updateGoldWageDisplay();
    setExpanded(isExpanded);

    return card;
  }

  function createGoldSellerCard(current) {
    const settings = getGoldSellerSettings();
    const pricePerGram = toDisplayValue(current.geram18?.p, false);
    const goldTime = current.geram18?.t || "";
    let isExpanded = settings.expanded === true;

    const card = document.createElement("div");
    card.className =
      "price-card-full flex flex-col items-stretch self-start h-auto bg-gradient-to-l from-[var(--mp-surface-2)] to-[var(--mp-surface)] rounded-xl p-2.5 border border-[var(--mp-border)] min-w-0";

    card.innerHTML = `
      <button
        type="button"
        id="gold-seller-toggle"
        class="w-full flex items-center justify-between gap-2 text-right"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xl shrink-0">🏪</span>
          <h3 class="font-bold text-sm text-[var(--mp-text)]">محاسبه طلا فروش ها</h3>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[10px] text-[var(--mp-muted)]">${goldTime}</span>
          <span id="gold-seller-chevron" class="text-[var(--mp-muted)] text-xs transition-transform duration-200">▼</span>
        </div>
      </button>

      <div id="gold-seller-body" class="hidden mt-3 space-y-3 min-w-0">
        <div class="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2 items-center">
          <label class="shrink-0 text-[11px] text-[var(--mp-muted)] leading-tight" for="gold-seller-price">قیمت کل طلا</label>
          <input
            id="gold-seller-price"
            type="text"
            inputmode="numeric"
            dir="ltr"
            value="${settings.totalPrice ? formatWageAmountInput(settings.totalPrice) : ""}"
            placeholder="۵,۵۰۰,۰۰۰"
            class="min-w-0 flex-1 rounded-lg border border-[var(--mp-border-2)] bg-[var(--mp-bg)] px-2 py-2 text-sm text-[var(--mp-text)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--mp-accent)] tabular-nums"
          />
        </div>

        <div class="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2 items-center">
          <label class="shrink-0 text-[11px] text-[var(--mp-muted)] leading-tight" for="gold-seller-grams">وزن طلا</label>
          <div class="flex min-w-0 items-stretch gap-1.5">
            <div class="flex shrink-0 self-stretch overflow-hidden rounded-lg border border-[var(--mp-border-2)] divide-x divide-x-reverse divide-[var(--mp-border-2)]" role="group" aria-label="واحد وزن">
              <button type="button" data-weight-unit="gram"
                class="gold-seller-weight-unit-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                گرم
              </button>
              <button type="button" data-weight-unit="sot"
                class="gold-seller-weight-unit-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap">
                صوت
              </button>
            </div>
            <input
              id="gold-seller-grams"
              type="text"
              inputmode="decimal"
              dir="ltr"
              value="${settings.grams}"
              placeholder="1.600"
              title="مثال: 1.600 یعنی ۱ گرم و ۶۰۰ سوت"
              class="min-w-0 flex-1 rounded-lg border border-[var(--mp-border-2)] bg-[var(--mp-bg)] px-2 py-2 text-sm text-[var(--mp-text)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--mp-accent)] tabular-nums"
            />
          </div>
        </div>

        <div class="rounded-lg border border-[var(--mp-border-2)] bg-[var(--mp-bg)]/60 p-3 space-y-2 text-xs min-w-0">
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">هر گرم (لحظه‌ای)</span>
            <span id="gold-seller-price-per-gram" class="text-[var(--mp-text)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">مقدار گرم طلا</span>
            <span id="gold-seller-weight" class="text-[var(--mp-text)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">خام</span>
            <span id="gold-seller-base" class="text-[var(--mp-text)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">درصد اجرت</span>
            <span id="gold-seller-wage-percent" class="text-[var(--mp-warn)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
          <div class="flex items-center justify-between gap-2 min-w-0">
            <span class="text-[var(--mp-muted)] shrink-0">مبلغ اجرت</span>
            <span id="gold-seller-wage-amount" class="text-[var(--mp-warn)] tabular-nums text-left min-w-0 truncate">—</span>
          </div>
        </div>
      </div>
    `;

    const toggleBtn = card.querySelector("#gold-seller-toggle");
    const bodyEl = card.querySelector("#gold-seller-body");
    const chevronEl = card.querySelector("#gold-seller-chevron");
    const priceInput = card.querySelector("#gold-seller-price");
    const gramsInput = card.querySelector("#gold-seller-grams");
    const weightUnitButtons = card.querySelectorAll(".gold-seller-weight-unit-btn");
    let weightUnit = settings.weightUnit === "sot" ? "sot" : "gram";

    function getCurrentSettings() {
      return {
        totalPrice: priceInput.value,
        grams: gramsInput.value,
        weightUnit,
        expanded: isExpanded,
      };
    }

    function setExpanded(expanded) {
      isExpanded = expanded;
      bodyEl.classList.toggle("hidden", !expanded);
      chevronEl.classList.toggle("rotate-180", expanded);
      saveGoldSellerSettings(getCurrentSettings());
    }

    function updateWeightUnitButtons() {
      weightUnitButtons.forEach((button) => {
        const active = button.dataset.weightUnit === weightUnit;
        button.className = `gold-seller-weight-unit-btn flex h-full items-center justify-center px-2 text-[10px] font-semibold transition-colors whitespace-nowrap ${
          active
            ? "bg-[var(--mp-accent)]/15 text-[var(--mp-accent)]"
            : "bg-[var(--mp-bg)] text-[var(--mp-muted)] hover:text-[var(--mp-text)]"
        }`;
      });
      if (weightUnit === "sot") {
        gramsInput.placeholder = "۹۰۰";
        gramsInput.title = "مثلاً ۹ یعنی ۹ صوت";
        gramsInput.inputMode = "numeric";
      } else {
        gramsInput.placeholder = "1.600";
        gramsInput.title = "مثال: 1.600 یعنی ۱ گرم و ۶۰۰ سوت";
        gramsInput.inputMode = "decimal";
      }
    }

    function onPriceInput() {
      priceInput.value = formatWageAmountInput(priceInput.value);
      persistAndUpdate();
    }

    function updateGoldSellerDisplay() {
      const totalPrice = parseLocalizedNumber(priceInput.value);
      const grams = parseGoldWeightInput(gramsInput.value, weightUnit);
      const hasPrice = priceInput.value.trim() !== "" && !Number.isNaN(totalPrice) && totalPrice > 0;
      const hasGrams = gramsInput.value.trim() !== "" && !Number.isNaN(grams) && grams > 0;
      const breakdown =
        hasPrice && hasGrams ? calculateGoldSellerBreakdown(totalPrice, pricePerGram, grams) : null;
      const goldBase =
        hasGrams && !Number.isNaN(pricePerGram) ? pricePerGram * grams : NaN;

      card.querySelector("#gold-seller-price-per-gram").textContent = `${formatTomans(pricePerGram)} تومان`;
      card.querySelector("#gold-seller-weight").textContent = hasGrams ? formatGoldWeight(grams) : "—";
      card.querySelector("#gold-seller-base").textContent = Number.isNaN(goldBase)
        ? "—"
        : `${formatTomans(goldBase)} تومان`;
      card.querySelector("#gold-seller-wage-percent").textContent =
        breakdown && !Number.isNaN(breakdown.wagePercent)
          ? `${breakdown.wagePercent.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}٪`
          : "—";
      card.querySelector("#gold-seller-wage-amount").textContent =
        breakdown && !Number.isNaN(breakdown.wageAmount)
          ? `${formatTomans(breakdown.wageAmount)} تومان`
          : "—";
    }

    function persistAndUpdate() {
      saveGoldSellerSettings(getCurrentSettings());
      updateGoldSellerDisplay();
    }

    toggleBtn.addEventListener("click", () => {
      setExpanded(!isExpanded);
    });

    priceInput.addEventListener("input", onPriceInput);
    gramsInput.addEventListener("input", persistAndUpdate);

    weightUnitButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextUnit = button.dataset.weightUnit === "sot" ? "sot" : "gram";
        if (nextUnit === weightUnit) {
          gramsInput.focus();
          return;
        }
        const currentGrams = parseGoldWeightInput(gramsInput.value, weightUnit);
        weightUnit = nextUnit;
        gramsInput.value = Number.isNaN(currentGrams)
          ? ""
          : formatWeightInputFromGrams(currentGrams, weightUnit);
        updateWeightUnitButtons();
        persistAndUpdate();
        gramsInput.focus();
      });
    });

    updateWeightUnitButtons();
    updateGoldSellerDisplay();
    setExpanded(isExpanded);

    return card;
  }

  function createPriceCard(item, data) {
    const isGlobal = item.global === true || item.key === "ons";
    const change = toDisplayValue(data.d, isGlobal);
    const changePercent = parseNumber(data.dp);
    const changeClasses = getChangeClasses(data.dt);
    const hasChange = !Number.isNaN(change) && change !== 0;

    const card = document.createElement("div");
    const wideMobile = item.key === "ons" || item.key === "geram18";
    card.className =
      `price-card bg-[var(--mp-surface)] rounded-xl p-2.5 shadow-sm border border-[var(--mp-border)] flex items-center gap-2.5${wideMobile ? " price-card-wide-mobile" : " price-card-compact"}`;

    const boardLabel =
      item.key === "geram18"
        ? `<p class="text-[9px] text-[var(--mp-muted)] leading-tight">قیمت تابلو</p>`
        : "";

    card.innerHTML = `
      <div class="price-card-icon text-xl shrink-0 w-8 text-center">${item.icon}</div>
      <div class="price-card-body flex-1 min-w-0">
        <div class="flex items-start justify-between gap-1 min-w-0">
          <div class="min-w-0 flex-1">
            <h3 class="price-card-title font-bold text-sm text-[var(--mp-text)]">${item.title}</h3>
            ${boardLabel}
          </div>
          <span class="price-card-time text-[10px] text-[var(--mp-muted)] shrink-0">${data.t || ""}</span>
        </div>
        <div class="flex items-baseline gap-1 mt-0.5 min-w-0">
          <span class="price-card-value text-lg font-bold text-[var(--mp-text)]">${formatPrice(data.p, isGlobal)}</span>
          <span class="text-[10px] text-[var(--mp-muted)] shrink-0">${item.unit}</span>
        </div>
      </div>
      <div class="price-card-change shrink-0 text-left">
        <span class="inline-flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg ${changeClasses}">
          ${getChangeArrow(data.dt)}
          ${hasChange ? formatPrice(Math.abs(change), isGlobal) : "۰"}
        </span>
        ${
          !Number.isNaN(changePercent) && changePercent !== 0
            ? `<p class="price-card-pct text-[10px] text-[var(--mp-muted)] mt-0.5 text-center">${Math.abs(changePercent).toLocaleString("fa-IR")}%</p>`
            : ""
        }
      </div>
    `;

    return card;
  }

  function createHeroCard(item, data) {
    const isGlobal = item.global === true || item.key === "ons";
    const change = toDisplayValue(data.d, isGlobal);
    const changePercent = parseNumber(data.dp);
    const hasChange = !Number.isNaN(change) && change !== 0;
    const directionClass =
      data.dt === "high" ? "is-up" : data.dt === "low" ? "is-down" : "is-flat";

    const card = document.createElement("div");
    card.className = "price-hero-card price-card-full";

    const body = document.createElement("div");
    body.className = "price-hero-card-body";

    body.innerHTML = `
      <div class="price-hero-card-top">
        <div class="price-hero-card-title-wrap">
          <span class="price-hero-card-icon">${item.icon}</span>
          <div>
            <h3 class="price-hero-card-title">${item.title}</h3>
            <p class="price-hero-card-subtitle">${item.unit}</p>
          </div>
        </div>
        <span class="price-hero-card-time">${data.t || ""}</span>
      </div>
      <div class="price-hero-card-value-row">
        <span class="price-hero-card-value">${formatPrice(data.p, isGlobal)}</span>
        <span class="price-hero-card-change ${directionClass}">
          ${getChangeArrow(data.dt)}
          ${
            !Number.isNaN(changePercent) && changePercent !== 0
              ? `${Math.abs(changePercent).toLocaleString("fa-IR")}٪`
              : hasChange
                ? formatPrice(Math.abs(change), isGlobal)
                : "۰"
          }
        </span>
      </div>
    `;

    card.appendChild(body);
    return card;
  }

  function renderItemGroup(items, listEl, current) {
    const ordered = [...items.filter((item) => item.hero), ...items.filter((item) => !item.hero)];
    ordered.forEach((item) => {
      const data = current[item.key];
      if (!data) return;
      if (item.hero) {
        listEl.appendChild(createHeroCard(item, data));
        return;
      }
      listEl.appendChild(createPriceCard(item, data));
    });
  }

  function renderCurrency(current) {
    currencyListEl.innerHTML = "";
    renderItemGroup(CURRENCY_ITEMS, currencyListEl, current);
  }

  function renderGold(current) {
    goldListEl.innerHTML = "";
    renderItemGroup(GOLD_ITEMS, goldListEl, current);
  }

  function renderAllPrices(current, { silent = false } = {}) {
    latestMarketPrices = current;
    renderCurrency(current);
    renderGold(current);
    checkPriceAlerts(current, { silent });

    pricesLoaded = true;
    showPriceLists();
  }

  function renderLivePriceProgress(current) {
    latestMarketPrices = current;
    renderCurrency(current);
    renderGold(current);
    pricesLoaded = true;
    showPriceLists({ endRefreshBusy: false });
  }

  async function fetchPrices({ silent = false } = {}) {
    if (!silent) {
      showLoading();
    }

    try {
      const data = await fetchMoj3PricesPayload({
        onProgress: (current) => {
          if (silent) return;
          renderLivePriceProgress(current);
        },
      });
      if (!data.current) throw new Error("داده‌ای دریافت نشد");

      renderAllPrices(data.current, { silent });
      cacheMarketPrices(data.current);
      hidePricesOfflineBanner();
    } catch (error) {
      console.error("Prices fetch error:", error);
      if (silent) return;
      const message = String(error?.message || "");
      const showExplicitError =
        message.includes("قدیمی") ||
        message.includes("پل اندروید") ||
        message.includes("داده‌ای دریافت نشد");
      if (showExplicitError) {
        showError(`ارز و طلا · ${message}`);
        return;
      }
      const cached = loadCachedMarketPrices();
      if (cached?.current) {
        renderAllPrices(cached.current, { silent: true, offline: true });
        showPricesOfflineBanner(cached.fetchedAt);
        return;
      }
      showError("ارز و طلا · خطا در دریافت قیمت‌ها. اتصال اینترنت را بررسی کنید.");
    }
  }

  function showCarsLoading() {
    carsLoadingEl.classList.remove("hidden");
    carsErrorEl.classList.add("hidden");
    carsListWrapEl.classList.add("hidden");
    setRefreshBusy(true);
  }

  function showCarsError(message) {
    carsLoadingEl.classList.add("hidden");
    carsErrorEl.classList.remove("hidden");
    carsListWrapEl.classList.add("hidden");
    carsErrorMsgEl.textContent = message;
    setRefreshBusy(false);
  }

  function showCarsList() {
    carsLoadingEl.classList.add("hidden");
    carsErrorEl.classList.add("hidden");
    carsListWrapEl.classList.remove("hidden");
    setRefreshBusy(false);
  }

  function renderCarRows(rows) {
    carRows = rows;
    const query = (carsSearchEl?.value || "").trim().toLowerCase();
    const filtered = query
      ? rows.filter((row) => {
          const haystack = [
            row.brandFa,
            row.modelFa,
            row.trimFa,
            row.className,
            String(row.modelYear),
            buildCarTitle(row),
            buildCarSubtitle(row),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        })
      : rows;

    carsListEl.innerHTML = "";

    if (!filtered.length) {
      carsListEl.innerHTML =
        '<p class="cars-empty-state">خودرویی با این مشخصات یافت نشد.</p>';
      showCarsList();
      return;
    }

    filtered.forEach((row) => {
      carsListEl.appendChild(createCarPriceCard(row));
    });

    showCarsList();
  }

  async function fetchCarPrices({ silent = false } = {}) {
    if (!silent) {
      const hasVisibleList = !carsListWrapEl.classList.contains("hidden");
      if (hasVisibleList) {
        setRefreshBusy(true);
      } else {
        showCarsLoading();
      }
    }

    try {
      const { rows } = await fetchBamaCarPrices();
      if (!rows.length) throw new Error("قیمتی برای خودروهای داخلی یافت نشد");

      renderCarRows(rows);
      carsLoaded = true;
      cacheCarPrices(rows);
      hideCarsOfflineBanner();
    } catch (error) {
      console.error("Bama car prices fetch error:", error);
      if (silent) return;
      const cached = loadCachedCarPrices();
      if (cached?.rows) {
        renderCarRows(cached.rows);
        carsLoaded = true;
        showCarsOfflineBanner(cached.fetchedAt);
        return;
      }
      showCarsError("خودرو صفر · خطا در دریافت قیمت خودرو. اتصال اینترنت را بررسی کنید.");
    }
  }

  function resetMarketTabToGold() {
    switchMarketTab("gold");
  }

  function switchMarketTab(tab) {
    if (!["currency", "gold", "cars", "more"].includes(tab)) return;

    activeMarketTab = tab;
    pricesPanelEl.classList.toggle("hidden", !isPriceTab(tab));
    currencyViewEl.classList.toggle("hidden", tab !== "currency");
    goldViewEl.classList.toggle("hidden", tab !== "gold");
    carsViewEl.classList.toggle("hidden", tab !== "cars");
    moreViewEl.classList.toggle("hidden", tab !== "more");

    navButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.marketTab === tab);
    });

    if (isPriceTab(tab)) {
      if (pricesLoaded) {
        showPriceLists();
      } else {
        fetchPrices();
      }
    }

    if (tab === "cars" && !carsLoaded) {
      fetchCarPrices();
    }
  }

  function handleMarketRefresh() {
    if (activeMarketTab === "cars") {
      fetchCarPrices();
      return;
    }
    if (isPriceTab(activeMarketTab)) {
      fetchPrices();
    }
  }

  if (container.dataset.initialized !== "true") {
    container.dataset.initialized = "true";
    initMoreTab();

    if (sharePricesBtn) {
      sharePricesBtn.addEventListener("click", () => {
        handleSharePricesClick();
      });
    }

    if (divarEstimateBtnEl) {
      divarEstimateBtnEl.addEventListener("click", () => {
        handleDivarEstimateClick();
      });
    }
    if (divarEstimateResultEl) {
      divarEstimateResultEl.addEventListener("click", (event) => {
        const target = event.target;
        if (!target || typeof target.closest !== "function") return;
        const dismissBtn = target.closest("#divarEstimateDismissBtn, .estimate-dismiss-btn");
        if (dismissBtn) {
          event.preventDefault();
          clearDivarEstimateResult();
          return;
        }
        if (target.closest(".estimate-share-btn")) {
          event.preventDefault();
          handleEstimateShareClick();
        }
      });
    }
    if (divarUrlInputEl) {
      divarUrlInputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleDivarEstimateClick();
        }
      });
    }

    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        switchMarketTab(button.dataset.marketTab);
      });
    });

    if (navRefreshBtn) {
      navRefreshBtn.addEventListener("click", handleMarketRefresh);
    }

    if (carsSearchEl) {
      carsSearchEl.addEventListener("input", () => {
        if (carRows.length) renderCarRows(carRows);
      });
    }
  }

  retryBtn.onclick = () => fetchPrices();
  carsRetryBtn.onclick = () => fetchCarPrices();

  if (pricesRefreshTimer) clearInterval(pricesRefreshTimer);
  pricesRefreshTimer = setInterval(() => {
    if (isPriceTab(activeMarketTab)) {
      fetchPrices({ silent: true });
    }
  }, 60000);

  window.__resetMarketTabToGold = resetMarketTabToGold;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resetMarketTabToGold();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) resetMarketTabToGold();
  });

  switchMarketTab("gold");
}
