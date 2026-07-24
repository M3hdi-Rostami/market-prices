const PRICES_API_URL =
  "https://call4.tgju.org/ajax.json?rev=rkXd7MtZswGDnAWc9uSNu3zdUdENM51sHxeFxJBABfGe356D9V4zWBkdoIC4";
const BAMA_PRICE_API_URL = "https://bama.ir/cad/api/price/hierarchy";
const BAMA_PAGE_SIZE = 100;

const REAL_GOLD_DIVISOR = 41.4713;
const REAL_GOLD_DIFF_THRESHOLD = 500_000;
const COIN_GOLD_RATIO_BUY_COIN = 9.5;
const COIN_GOLD_RATIO_BUY_MELTED = 11.5;
const COIN_GOLD_RATIO_NEAR_THRESHOLD = 0.5;
const GOLD_WAGE_STORAGE_KEY = "market-prices-gold-wage";
const PRICE_ALERTS_STORAGE_KEY = "market-prices-alerts";
const PREVIOUS_PRICES_STORAGE_KEY = "market-prices-previous";
const DEFAULT_ALERT_THRESHOLD = 1;

const CURRENCY_HERO_KEY = "price_dollar_rl";
const GOLD_HERO_KEY = "geram18";

const CURRENCY_ITEMS = [
  { key: "price_dollar_rl", title: "دلار", unit: "تومان", icon: "💵", hero: true },
  { key: "crypto-tether-irr", title: "تتر", unit: "تومان", icon: "₮" },
  { key: "price_eur", title: "یورو", unit: "تومان", icon: "💶" },
  { key: "price_aed", title: "درهم", unit: "تومان", icon: "🇦🇪" },
  { key: "price_gbp", title: "پوند", unit: "تومان", icon: "🇬🇧" },
  { key: "price_try", title: "لیر", unit: "تومان", icon: "🇹🇷" },
];

const GOLD_ITEMS = [
  { key: "geram18", title: "طلای ۱۸ عیار", unit: "تومان", icon: "🥇", hero: true },
  { key: "ons", title: "انس جهانی طلا", unit: "دلار", icon: "🌍" },
  { key: "sekee", title: "سکه امامی", unit: "تومان", icon: "🪙" },
  { key: "mesghal", title: "مثقال طلا", unit: "تومان", icon: "⚖️" },
];

const ALERT_WATCH_ITEMS = [
  { key: CURRENCY_HERO_KEY, title: "دلار" },
  { key: GOLD_HERO_KEY, title: "طلای ۱۸ عیار" },
];

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
const BAMA_CALCULATOR_VEHICLES_API = "https://bama.ir/cad/api/PriceCalculator/vehicles";
const BAMA_CALCULATOR_CALCULATE_API = "https://bama.ir/cad/api/PriceCalculator/calculate";

let bamaCalculatorVehiclesCache = null;

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

/** Divar year field is often like "۱۳۹۵ - ۲۰۱۶" — Bama wants Jalali 1395. */
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

function emptyBamaBodyParts() {
  return {
    mudguard_left_front: 0,
    mudguard_left_rear: 0,
    mudguard_right_front: 0,
    mudguard_right_rear: 0,
    door_right_front: 0,
    door_right_rear: 0,
    door_left_front: 0,
    door_left_rear: 0,
    hood: 0,
    trunc: 0,
    roof: 0,
  };
}

/**
 * Map Divar body text to Bama calculator body_status.
 * Part codes: 0 سالم، 1 صافکاری، 2 رنگ، 3 تعویض
 */
function mapBodyStatusForBama(bodyStatus) {
  const value = String(bodyStatus || "");
  const parts = emptyBamaBodyParts();

  if (!value || value === "سالم و بی‌خط و خش" || value === "سالم") {
    return { body_status: "Healthy", parts };
  }
  if (value === "دوررنگ" || value === "رنگ‌شدگی در 2 ناحیه") {
    return { body_status: "Painted", parts };
  }
  if (value === "تمام‌رنگ" || value === "اوراقی" || value === "تصادفی") {
    return { body_status: "Repainted", parts };
  }

  // Damaged / partial paint — mark N panels as painted when Divar reports N areas.
  const areaMatch = value.match(/(\d+)\s*ناحیه/);
  const areaCount = areaMatch ? Math.min(Number(areaMatch[1]) || 1, 5) : 1;
  const panelKeys = ["hood", "door_right_front", "door_left_front", "mudguard_right_front", "mudguard_left_front"];
  const partCode = value.includes("صافکاری") ? 1 : 2;
  for (let i = 0; i < areaCount; i++) parts[panelKeys[i]] = partCode;
  return { body_status: "Damaged", parts };
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

function flattenBamaVehicles(tree) {
  const rows = [];
  for (const brand of Array.isArray(tree) ? tree : []) {
    for (const model of brand.models || []) {
      const trims = Array.isArray(model.trims) && model.trims.length ? model.trims : [null];
      for (const trim of trims) {
        rows.push({ brand, model, trim });
      }
    }
  }
  return rows;
}

function scoreBamaVehicleRow(row, ad) {
  const brandEn = normalizeMatchText(ad.brandModel);
  const brandFa = normalizeMatchText(ad.brandModelFa);
  const title = normalizeMatchText(ad.title);
  const hay = `${brandEn} ${brandFa} ${title}`.trim();

  const bEn = normalizeMatchText(row.brand.brand_name);
  const bFa = normalizeMatchText(row.brand.brand_name_fa);
  const mEn = normalizeMatchText(row.model.model_name);
  const mFa = normalizeMatchText(row.model.model_name_fa);
  const tEn = normalizeMatchText(row.trim?.trim_name);
  const tFa = normalizeMatchText(row.trim?.trim_name_fa);

  let score = 0;
  if (bEn && hay.includes(bEn)) score += 60;
  if (bFa && hay.includes(bFa)) score += 60;
  if (mFa && hay.includes(mFa)) score += 40;
  if (mEn && mEn.length > 1 && hay.includes(mEn)) score += 25;
  if (tFa && hay.includes(tFa)) score += 30;
  if (tEn && tEn.length > 1 && hay.includes(tEn)) score += 20;

  // Divar "Dena basic 2" / معمولی تیپ → Bama dena / معمولی (1.7) without trim
  if ((/\bbasic\b/.test(brandEn) || brandFa.includes("معمولی")) && (mEn === "1.7" || mFa.includes("معمولی"))) {
    score += 35;
  }
  if ((brandFa.includes("پلاس") || brandEn.includes("plus")) && (mFa.includes("پلاس") || mEn.includes("plus"))) {
    score += 35;
  }
  if (!row.trim && (brandFa.includes("معمولی") || /\bbasic\b/.test(brandEn))) score += 8;
  if (row.trim && !tFa && !tEn) score -= 5;

  return score;
}

function pickBamaVehicle(tree, ad) {
  const rows = flattenBamaVehicles(tree);
  let best = null;
  let bestScore = 0;
  for (const row of rows) {
    const score = scoreBamaVehicleRow(row, ad);
    if (score > bestScore) {
      best = row;
      bestScore = score;
    }
  }
  if (!best || bestScore < 60) return null;
  return best;
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
  const payload = await fetchHttpJson(BAMA_CALCULATOR_VEHICLES_API, {
    headers: {
      Origin: "https://bama.ir",
      Referer: "https://bama.ir/calculator",
    },
  });
  const data = payload?.data;
  if (!Array.isArray(data) || !data.length) {
    throw new Error("لیست مدل‌های خودرو برای تخمین دریافت نشد");
  }
  bamaCalculatorVehiclesCache = data;
  return data;
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

function bodyPartsForManualStatus(bodyStatus) {
  const parts = emptyBamaBodyParts();
  if (bodyStatus === "Damaged") {
    parts.hood = 2;
    parts.door_right_front = 2;
  }
  return parts;
}

async function postBamaCalculate(requestBody) {
  const payload = await fetchHttpJson(BAMA_CALCULATOR_CALCULATE_API, {
    method: "POST",
    headers: {
      Origin: "https://bama.ir",
      Referer: "https://bama.ir/calculator",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const data = payload?.data;
  if (!data) {
    const message =
      (Array.isArray(payload?.errors) && payload.errors[0]) || "تخمین قیمت دریافت نشد";
    throw new Error(String(message));
  }
  return data;
}

function mapBamaCalculateToEstimate(data, extras = {}) {
  const minPrice = Number(data.min_price) || 0;
  const maxPrice = Number(data.max_price) || 0;
  const suggestedPrice = Number(data.price) || 0;
  if (!minPrice && !maxPrice && !suggestedPrice) {
    throw new Error("تخمین قیمت دریافت نشد");
  }
  const adPrice = Number(extras.adPrice) || 0;
  return {
    minPrice: minPrice || suggestedPrice,
    maxPrice: maxPrice || suggestedPrice,
    suggestedPrice,
    verdict: verdictFromBama(adPrice, minPrice || suggestedPrice, maxPrice || suggestedPrice),
    brandFa: data.brand || extras.brandFa || "",
    modelFa: data.model || extras.modelFa || "",
    trimFa: data.trim || extras.trimFa || "",
    modelYear: data.model_year || Number(extras.modelYear) || 0,
    mileage: data.mileage != null ? Number(data.mileage) : Number(extras.mileage) || 0,
    color: extras.color || data.default_color || "",
    imageUrl: data.image_url || extras.imageUrl || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    calculateId: data.id || "",
  };
}

/**
 * Manual estimate from selected brand/model/trim IDs (Bama calculator).
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

  const tree = await getBamaCalculatorVehicles();
  const matched = findBamaBrandModelTrim(tree, brandId, modelId, selection?.trimId);
  if (!matched) throw new Error("مدل انتخاب‌شده برای تخمین معتبر نیست");

  const bodyStatus = selection?.bodyStatus || "Healthy";
  const trimId =
    selection?.trimId == null || selection?.trimId === ""
      ? null
      : Number(selection.trimId);
  if ((matched.trims || []).length > 0 && (trimId == null || !Number.isFinite(trimId))) {
    throw new Error("تیپ خودرو را انتخاب کنید");
  }

  const requestBody = {
    brand_id: brandId,
    model_id: modelId,
    trim_id: trimId,
    mileage: Math.round(mileage),
    model_year: modelYear,
    body_status: bodyStatus,
    ...bodyPartsForManualStatus(bodyStatus),
  };

  const data = await postBamaCalculate(requestBody);
  return mapBamaCalculateToEstimate(data, {
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
 * Same API as https://bama.ir/calculator — POST /cad/api/PriceCalculator/calculate
 */
async function estimateBamaPrice(ad) {
  const year = extractCarYear(ad.model);
  const mileage = Number(extractMileage(ad.mileage)) || 0;
  if (!year || !/^\d{4}$/.test(year)) {
    throw new Error("سال ساخت خودرو از آگهی استخراج نشد");
  }

  const tree = await getBamaCalculatorVehicles();
  const matched = pickBamaVehicle(tree, ad);
  if (!matched) {
    throw new Error("مدل این خودرو برای تخمین پیدا نشد");
  }

  const { body_status, parts } = mapBodyStatusForBama(ad.bodyStatus);
  const requestBody = {
    brand_id: matched.brand.brand_id,
    model_id: matched.model.model_id,
    trim_id: matched.trim?.trim_id || null,
    mileage,
    model_year: Number(year),
    body_status,
    ...parts,
  };

  const data = await postBamaCalculate(requestBody);
  const tipFromAd = extractTipFromBrandModelFa(ad.brandModelFa);
  const estimate = mapBamaCalculateToEstimate(data, {
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
    </article>
  `;
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
  for (const section of sections) {
    if (section?.section_name !== "DESCRIPTION") continue;
    for (const widget of section?.widgets || []) {
      const text = String(widget?.data?.text || "").trim();
      if (text) {
        specs.description = text;
        break;
      }
    }
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
        <button type="button" class="housing-open-btn" data-housing-open="${escapeHtml(listing.url)}">مشاهده در دیوار</button>
      </div>
    </article>
  `;
}

const SHARE_CARD_BRAND = "تصمیم";
const SHARE_CARD_WIDTH = 1080;
const SHARE_CARD_HEIGHT = 1680;
const SHARE_CARD_ITEMS = [
  { key: "price_dollar_rl", title: "دلار", unit: "تومان", icon: "💵", global: false },
  { key: "crypto-tether-irr", title: "تتر", unit: "تومان", icon: "₮", global: false },
  { key: "geram18", title: "طلای ۱۸ عیار", unit: "تومان", icon: "🥇", global: false },
  { key: "ons", title: "انس جهانی طلا", unit: "دلار", icon: "🌍", global: true },
  { key: "sekee", title: "سکه امامی", unit: "تومان", icon: "🪙", global: false },
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
  const isLight = theme === "light";
  if (isLight) {
    return {
      bg0: "#f1f5f9",
      bg1: "#ffffff",
      surface: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      muted: "#64748b",
      accent: "#059669",
      danger: "#e11d48",
      flat: "#94a3b8",
    };
  }
  return {
    bg0: "#0d121c",
    bg1: "#111621",
    surface: "#1a2230",
    border: "#2a3344",
    text: "#ffffff",
    muted: "#8b95a8",
    accent: "#00e5a0",
    danger: "#ff4d6d",
    flat: "#6b778c",
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
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ساخت تصویر ممکن نشد");

  const gradient = ctx.createLinearGradient(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
  gradient.addColorStop(0, theme.bg0);
  gradient.addColorStop(1, theme.bg1);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  ctx.fillStyle = theme.accent;
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(180, 220, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(920, 1480, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = theme.text;
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.font = '800 58px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(SHARE_CARD_BRAND, SHARE_CARD_WIDTH / 2, 140);

  ctx.fillStyle = theme.muted;
  ctx.font = '500 30px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(formatPersianDateTime(new Date()), SHARE_CARD_WIDTH / 2, 200);

  let y = 260;
  const rowHeight = 230;
  rows.forEach((row) => {
    roundRectPath(ctx, 72, y, SHARE_CARD_WIDTH - 144, rowHeight - 20, 28);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '52px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.textAlign = "right";
    ctx.fillText(row.icon, SHARE_CARD_WIDTH - 120, y + 78);

    ctx.fillStyle = theme.text;
    ctx.font = '700 38px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.fillText(row.title, SHARE_CARD_WIDTH - 200, y + 68);

    ctx.fillStyle = theme.muted;
    ctx.font = '500 24px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.fillText(row.unit, SHARE_CARD_WIDTH - 200, y + 104);

    ctx.fillStyle = theme.text;
    ctx.font = '800 56px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.textAlign = "left";
    ctx.fillText(row.value, 120, y + 150);

    const changeColor =
      row.change.tone === "up" ? theme.accent : row.change.tone === "down" ? theme.danger : theme.flat;
    roundRectPath(ctx, 120, y + 165, 200, 36, 18);
    ctx.fillStyle = changeColor;
    ctx.globalAlpha = 0.16;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = changeColor;
    ctx.font = '700 24px "Vazir-FD", Vazir, Tahoma, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(row.change.text, 220, y + 191);

    y += rowHeight;
  });

  ctx.fillStyle = theme.muted;
  ctx.textAlign = "center";
  ctx.font = '500 28px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText("قیمت لحظه‌ای · قابل اشتراک‌گذاری", SHARE_CARD_WIDTH / 2, SHARE_CARD_HEIGHT - 100);
  ctx.fillStyle = theme.accent;
  ctx.font = '700 30px "Vazir-FD", Vazir, Tahoma, sans-serif';
  ctx.fillText(SHARE_CARD_BRAND, SHARE_CARD_WIDTH / 2, SHARE_CARD_HEIGHT - 55);

  return canvas;
}

async function shareMarketPricesCard(current) {
  const canvas = await buildMarketPricesShareCard(current);
  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const fileName = `market-prices-${Date.now()}.png`;

  if (typeof AndroidApp !== "undefined" && typeof AndroidApp["shareImage"] === "function") {
    AndroidApp["shareImage"](base64, fileName);
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
      title: SHARE_CARD_BRAND,
      text: "قیمت لحظه‌ای دلار، تتر، طلا و سکه",
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

  let activeMarketTab = "currency";
  let carRows = [];
  let carsLoaded = false;
  let pricesLoaded = false;
  let latestMarketPrices = null;
  let previousPricesSnapshot = null;
  let toastHideTimer = null;
  let shareCardBusy = false;
  let divarEstimateBusy = false;

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
    if (divarEstimateResultEl) {
      divarEstimateResultEl.classList.add("hidden");
      divarEstimateResultEl.innerHTML = "";
    }
    setDivarEstimateStatus("");
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
    return { enabled: false, threshold: DEFAULT_ALERT_THRESHOLD };
  }

  function getAlertSettings() {
    try {
      const raw = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
      if (!raw) return getDefaultAlertSettings();
      const parsed = JSON.parse(raw);
      const threshold = Number(parsed.threshold);
      return {
        enabled: parsed.enabled === true,
        threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_ALERT_THRESHOLD,
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

    const prev = previousPricesSnapshot || loadPreviousPricesSnapshot();
    if (!prev) {
      savePreviousPricesSnapshot(current);
      return;
    }

    const alerts = [];
    ALERT_WATCH_ITEMS.forEach(({ key, title }) => {
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
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    currencyListEl.classList.add("hidden");
    goldListEl.classList.add("hidden");
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

  function showPriceLists() {
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
    setRefreshBusy(false);
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
          <h3 class="font-bold text-sm text-[var(--mp-text)]">قیمت واقعی طلای ۱۸ عیار</h3>
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

  function createPriceCard(item, data) {
    const isGlobal = item.key === "ons";
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
    const isGlobal = item.key === "ons";
    const change = toDisplayValue(data.d, isGlobal);
    const changePercent = parseNumber(data.dp);
    const hasChange = !Number.isNaN(change) && change !== 0;
    const directionClass =
      data.dt === "high" ? "is-up" : data.dt === "low" ? "is-down" : "is-flat";

    const card = document.createElement("div");
    card.className = "price-hero-card price-card-full";

    card.innerHTML = `
      <div class="price-hero-card-inner">
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
      </div>
    `;

    return card;
  }

  function renderItemGroup(items, listEl, current) {
    items.forEach((item) => {
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
    goldListEl.appendChild(createRealGoldCard(current));
    goldListEl.appendChild(createCoinGoldAdviceCard(current));
    goldListEl.appendChild(createGoldWageCard(current));
  }

  function renderAllPrices(current, { silent = false } = {}) {
    latestMarketPrices = current;
    renderCurrency(current);
    renderGold(current);
    checkPriceAlerts(current, { silent });

    pricesLoaded = true;
    showPriceLists();
  }

  async function fetchPrices({ silent = false } = {}) {
    if (!silent) {
      const hasVisibleList =
        pricesLoaded &&
        ((activeMarketTab === "currency" && !currencyListEl.classList.contains("hidden")) ||
          (activeMarketTab === "gold" && !goldListEl.classList.contains("hidden")));
      if (hasVisibleList) {
        setRefreshBusy(true);
      } else if (isPriceTab(activeMarketTab) || !pricesLoaded) {
        showLoading();
      }
    }

    try {
      const response = await fetch(PRICES_API_URL);
      if (!response.ok) throw new Error("پاسخ سرور نامعتبر بود");

      const data = await response.json();
      if (!data.current) throw new Error("داده‌ای دریافت نشد");

      renderAllPrices(data.current, { silent });
    } catch (error) {
      console.error("Prices fetch error:", error);
      if (silent) return;
      showError("خطا در دریافت قیمت‌ها. اتصال اینترنت را بررسی کنید.");
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
    } catch (error) {
      console.error("Bama car prices fetch error:", error);
      if (silent) return;
      showCarsError("خطا در دریافت قیمت خودرو. اتصال اینترنت را بررسی کنید.");
    }
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

  fetchPrices();
}
