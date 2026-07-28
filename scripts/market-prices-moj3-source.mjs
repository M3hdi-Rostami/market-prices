export const MOJ3_PRICES_PAGE_URL = "https://moj3.ir/price/";
export const TGJU_AJAX_URL = "https://call4.tgju.org/ajax.json";

export const MOJ3_LABEL_SPECS = [
  { label: "طلای 18 عیار", key: "geram18", global: false },
  { label: "طلای 24 عیار", key: "geram24", global: false },
  { label: "دلار", key: "price_dollar_rl", global: false },
  { label: "سکه طرح جدید", key: "sekee", global: false },
  { label: "سکه طرح قدیم", key: "sekeb", global: false },
  { label: "نیم سکه", key: "nim", global: false },
  { label: "ربع سکه", key: "rob", global: false },
  { label: "نقره 925", key: "silver_925", global: false },
  { label: "انس جهانی طلا", key: "ons", global: true },
  { label: "انس جهانی نقره", key: "silver", global: true },
  { label: "نفت برنت (BRENT)", key: "oil_brent", global: true },
  { label: "تتر", key: "crypto-tether-irr", global: false },
  { label: "درهم", key: "price_aed", global: false },
  { label: "یورو", key: "price_eur", global: false },
  { label: "ارزش ذاتی طلای 18 عیار", key: "gold_intrinsic_18", global: false, intrinsic: true },
  { label: "ارزش ذاتی طلای 24 عیار", key: "gold_intrinsic_24", global: false, intrinsic: true },
  { label: "عیار", key: "ime_fund_ayar", global: false, fund: true },
];

/** Daily change for gold funds is not in moj3 HTML (only bubble %). */
export const MOJ3_FUND_TGJU_CHANGE_KEYS = {
  ime_fund_ayar: "ime_fund_ayar",
};

export function stripHtmlTags(value) {
  return String(value || "").replace(/<[^>]+>/g, "").trim();
}

export function normalizeMoj3Label(label) {
  return String(label || "").replace(/\s+/g, " ").trim();
}

export function toTgjuPriceString(tomanValue, isGlobal) {
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
  const scaled = String(Math.round(abs * 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + scaled;
}

export function parseSignedPercent(pctRaw) {
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

export function parseMoj3ChangeValues(pctRaw, amountRaw, isGlobal) {
  const { dp, dt } = parseSignedPercent(pctRaw);
  let d = "";
  if (amountRaw) {
    const normalized = String(amountRaw).replace(/[−–—]/g, "-").replace(/,/g, "");
    const toman = Number(normalized.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(toman) && toman !== 0) {
      d = toTgjuPriceString(toman, isGlobal);
    }
  }
  return { dp, dt, d };
}

export function parseMoj3RowCells(rowHtml) {
  return [...rowHtml.matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/gi)].map((match) => {
    const attrs = match[1] || "";
    const labelMatch = attrs.match(/data-label="([^"]+)"/i);
    return {
      label: labelMatch ? labelMatch[1] : "",
      text: stripHtmlTags(match[2]),
    };
  });
}

export function parseMoj3ChangeFromCells(cells, spec) {
  if (spec.fund || spec.intrinsic) {
    return { dp: 0, dt: "", d: "" };
  }

  const byLabel = {};
  for (const cell of cells) {
    if (cell.label) byLabel[cell.label] = cell.text;
  }

  const pctRaw = byLabel["Change (%)"] || "";
  const amountRaw = byLabel["Change Amount"] || "";

  if (pctRaw || amountRaw) {
    return parseMoj3ChangeValues(pctRaw, amountRaw, spec.global);
  }

  const fallbackPct = cells[2];
  if (fallbackPct && fallbackPct.label && fallbackPct.label.toLowerCase() === "bubble") {
    return { dp: 0, dt: "", d: "" };
  }

  const fallbackAmount = cells[3];
  if (fallbackAmount && fallbackAmount.label && fallbackAmount.label.toLowerCase() === "bubble") {
    return parseMoj3ChangeValues(fallbackPct?.text || "", "", spec.global);
  }

  return parseMoj3ChangeValues(fallbackPct?.text || "", fallbackAmount?.text || "", spec.global);
}

export function signedDpFromTgjuItem(item) {
  const dp = Number(item?.dp);
  if (!Number.isFinite(dp) || dp === 0) return 0;
  if (item.dt === "low") return -Math.abs(dp);
  if (item.dt === "high") return Math.abs(dp);
  return dp;
}

export function applyTgjuFundChanges(current, tgjuCurrent) {
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

export function parseMoj3PriceHtml(html) {
  const current = {};
  const labelMap = new Map(MOJ3_LABEL_SPECS.map((spec) => [spec.label, spec]));
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRe.exec(html)) !== null) {
    const cells = parseMoj3RowCells(match[1]);
    if (!cells.length) continue;

    const label = normalizeMoj3Label(cells[0].text);
    const spec = labelMap.get(label);
    if (!spec || current[spec.key]) continue;

    const priceToman = cells[1]?.text;
    if (!priceToman) continue;

    const change = parseMoj3ChangeFromCells(cells, spec);
    current[spec.key] = {
      p: toTgjuPriceString(priceToman, spec.global),
      dp: change.dp,
      dt: change.dt,
      ...(change.d ? { d: change.d } : {}),
    };
  }

  return current;
}
