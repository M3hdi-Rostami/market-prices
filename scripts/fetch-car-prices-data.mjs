const BAMA_PRICE_API_URL = "https://bama.ir/cad/api/price/hierarchy";
const BAMA_PAGE_SIZE = 100;

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

async function fetchBamaPricePage(pageIndex) {
  const url = `${BAMA_PRICE_API_URL}?pageIndex=${pageIndex}&pageSize=${BAMA_PAGE_SIZE}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
      Referer: "https://bama.ir/price",
    },
  });

  if (!response.ok) {
    throw new Error(`Bama API HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchCarPricesData() {
  const allItems = [];
  let pageIndex = 0;
  let lastUpdate = null;

  while (true) {
    const payload = await fetchBamaPricePage(pageIndex);
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
  if (!rows.length) {
    throw new Error("No Iranian car prices returned from Bama API");
  }

  return {
    rows,
    lastUpdate: lastUpdate || null,
    fetchedAt: new Date().toISOString(),
  };
}
