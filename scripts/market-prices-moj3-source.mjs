export const MOJ3_PRICES_PAGE_URL = "https://moj3.ir/price/";

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

export function stripHtmlTags(value) {
  return String(value || "").replace(/<[^>]+>/g, "").trim();
}

export function normalizeMoj3Label(label) {
  return String(label || "").replace(/\s+/g, " ").trim();
}

export function toTgjuPriceString(tomanValue, isGlobal) {
  const cleaned = String(tomanValue).replace(/,/g, "").trim();
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return "";
  if (isGlobal) {
    if (cleaned.includes(".")) return cleaned;
    return String(Math.round(num));
  }
  return String(Math.round(num * 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseMoj3Change(cells, isGlobal) {
  const pctRaw = stripHtmlTags(cells[2] || "");
  const amountRaw = stripHtmlTags(cells[3] || "");
  const dp = Math.abs(parseFloat(pctRaw.replace(/[^\d.-]/g, "")) || 0);
  const dt = pctRaw.includes("-") ? "low" : pctRaw.includes("+") ? "high" : "";
  let d = "";
  if (amountRaw) {
    const toman = Number(amountRaw.replace(/,/g, "").replace(/[^\d.-]/g, ""));
    if (Number.isFinite(toman)) d = toTgjuPriceString(Math.abs(toman), isGlobal);
  }
  return { dp, dt, d };
}

export function parseMoj3PriceHtml(html) {
  const current = {};
  const labelMap = new Map(MOJ3_LABEL_SPECS.map((spec) => [spec.label, spec]));
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRe.exec(html)) !== null) {
    const cells = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) =>
      stripHtmlTags(cell[1]),
    );
    if (!cells.length) continue;

    const label = normalizeMoj3Label(cells[0]);
    const spec = labelMap.get(label);
    if (!spec || current[spec.key]) continue;

    const priceToman = cells[1];
    if (!priceToman) continue;

    const change = parseMoj3Change(cells, spec.global);
    current[spec.key] = {
      p: toTgjuPriceString(priceToman, spec.global),
      dp: change.dp,
      dt: change.dt,
      ...(change.d ? { d: change.d } : {}),
    };
  }

  return current;
}
