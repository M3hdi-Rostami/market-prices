import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const BANK_LOGOS_DIR = path.join(__dirname, "..", "assets", "bank-logos");

/** Iranian Shetab card BIN (first 6 digits) → bank display info. */
export const IRAN_BANK_BY_BIN = {
  "603799": { name: "بانک ملی ایران", shortName: "ملی", logo: "melli", c1: "#0b3d91", c2: "#1a6bc7" },
  "170019": { name: "بانک ملی ایران", shortName: "ملی", logo: "melli", c1: "#0b3d91", c2: "#1a6bc7" },
  "610433": { name: "بانک ملت", shortName: "ملت", logo: "mellat", c1: "#b00020", c2: "#e53935" },
  "991975": { name: "بانک ملت", shortName: "ملت", logo: "mellat", c1: "#b00020", c2: "#e53935" },
  "603769": { name: "بانک صادرات ایران", shortName: "صادرات", logo: "saderat", c1: "#1b4d3e", c2: "#2e7d5b" },
  "903769": { name: "بانک صادرات ایران", shortName: "صادرات", logo: "saderat", c1: "#1b4d3e", c2: "#2e7d5b" },
  "603770": { name: "بانک کشاورزی", shortName: "کشاورزی", logo: "keshavarzi", c1: "#1b5e20", c2: "#43a047" },
  "639217": { name: "بانک کشاورزی", shortName: "کشاورزی", logo: "keshavarzi", c1: "#1b5e20", c2: "#43a047" },
  "589210": { name: "بانک سپه", shortName: "سپه", logo: "sepah", c1: "#0d47a1", c2: "#1976d2" },
  "627353": { name: "بانک تجارت", shortName: "تجارت", logo: "tejarat", c1: "#004d40", c2: "#00897b" },
  "585983": { name: "بانک تجارت", shortName: "تجارت", logo: "tejarat", c1: "#004d40", c2: "#00897b" },
  "628023": { name: "بانک مسکن", shortName: "مسکن", logo: "maskan", c1: "#e65100", c2: "#fb8c00" },
  "589463": { name: "بانک رفاه کارگران", shortName: "رفاه", logo: "refah", c1: "#00695c", c2: "#26a69a" },
  "627760": { name: "پست بانک ایران", shortName: "پست‌بانک", logo: "postbank", c1: "#33691e", c2: "#7cb342" },
  "502908": { name: "بانک توسعه تعاون", shortName: "توسعه تعاون", logo: "tosee_taavon", c1: "#1565c0", c2: "#42a5f5" },
  "627648": { name: "بانک توسعه صادرات", shortName: "توسعه صادرات", logo: "tosee_saderat", c1: "#283593", c2: "#5c6bc0" },
  "207177": { name: "بانک توسعه صادرات", shortName: "توسعه صادرات", logo: "tosee_saderat", c1: "#283593", c2: "#5c6bc0" },
  "627961": { name: "بانک صنعت و معدن", shortName: "صنعت و معدن", logo: "sanat_madan", c1: "#37474f", c2: "#607d8b" },
  "606373": { name: "بانک قرض‌الحسنه مهر ایران", shortName: "مهر ایران", logo: "mehr_iran", c1: "#1a237e", c2: "#3949ab" },
  "504172": { name: "بانک قرض‌الحسنه رسالت", shortName: "رسالت", logo: "resalat", c1: "#006064", c2: "#00acc1" },
  "628157": { name: "موسسه اعتباری توسعه", shortName: "توسعه", logo: "tosee", c1: "#4527a0", c2: "#7e57c2" },
  "622106": { name: "بانک پارسیان", shortName: "پارسیان", logo: "parsian", c1: "#4a148c", c2: "#8e24aa" },
  "627884": { name: "بانک پارسیان", shortName: "پارسیان", logo: "parsian", c1: "#4a148c", c2: "#8e24aa" },
  "639194": { name: "بانک پارسیان", shortName: "پارسیان", logo: "parsian", c1: "#4a148c", c2: "#8e24aa" },
  "502229": { name: "بانک پاسارگاد", shortName: "پاسارگاد", logo: "pasargad", c1: "#000000", c2: "#424242" },
  "639347": { name: "بانک پاسارگاد", shortName: "پاسارگاد", logo: "pasargad", c1: "#000000", c2: "#424242" },
  "621986": { name: "بانک سامان", shortName: "سامان", logo: "saman", c1: "#01579b", c2: "#0288d1" },
  "627412": { name: "بانک اقتصاد نوین", shortName: "اقتصاد نوین", logo: "eghtesad_novin", c1: "#6a1b9a", c2: "#ab47bc" },
  "636214": { name: "بانک آینده", shortName: "آینده", logo: "ayandeh", c1: "#880e4f", c2: "#ec407a" },
  "502806": { name: "بانک شهر", shortName: "شهر", logo: "shahr", c1: "#bf360c", c2: "#ff7043" },
  "504706": { name: "بانک شهر", shortName: "شهر", logo: "shahr", c1: "#bf360c", c2: "#ff7043" },
  "502938": { name: "بانک دی", shortName: "دی", logo: "dey", c1: "#1a237e", c2: "#3f51b5" },
  "639346": { name: "بانک سینا", shortName: "سینا", logo: "sina", c1: "#0d47a1", c2: "#2196f3" },
  "639607": { name: "بانک سرمایه", shortName: "سرمایه", logo: "sarmayeh", c1: "#311b92", c2: "#7c4dff" },
  "505416": { name: "بانک گردشگری", shortName: "گردشگری", logo: "gardeshgari", c1: "#00695c", c2: "#26a69a" },
  "505426": { name: "بانک گردشگری", shortName: "گردشگری", logo: "gardeshgari", c1: "#00695c", c2: "#26a69a" },
  "505785": { name: "بانک ایران زمین", shortName: "ایران‌زمین", logo: "iran_zamin", c1: "#b71c1c", c2: "#ef5350" },
  "627488": { name: "بانک کارآفرین", shortName: "کارآفرین", logo: "karafarin", c1: "#1b5e20", c2: "#66bb6a" },
  "502910": { name: "بانک کارآفرین", shortName: "کارآفرین", logo: "karafarin", c1: "#1b5e20", c2: "#66bb6a" },
  "585947": { name: "بانک خاورمیانه", shortName: "خاورمیانه", logo: "khavar_mianeh", c1: "#263238", c2: "#546e7a" },
  "505809": { name: "بانک خاورمیانه", shortName: "خاورمیانه", logo: "khavar_mianeh", c1: "#263238", c2: "#546e7a" },
  "606256": { name: "موسسه اعتباری ملل", shortName: "ملل", logo: "melall", c1: "#3e2723", c2: "#8d6e63" },
  "627381": { name: "بانک انصار", shortName: "انصار", logo: "ansar", c1: "#1b5e20", c2: "#43a047" },
  "639599": { name: "بانک قوامین", shortName: "قوامین", logo: "ghavamin", c1: "#33691e", c2: "#9ccc65" },
  "636949": { name: "بانک حکمت ایرانیان", shortName: "حکمت", logo: "hekmat", c1: "#0d47a1", c2: "#64b5f6" },
  "639370": { name: "بانک مهر اقتصاد", shortName: "مهر اقتصاد", logo: "mehr_eghtesad", c1: "#4e342e", c2: "#a1887f" },
  "606737": { name: "بانک مهر اقتصاد", shortName: "مهر اقتصاد", logo: "mehr_eghtesad", c1: "#4e342e", c2: "#a1887f" },
  "505801": { name: "موسسه اعتباری کوثر", shortName: "کوثر", logo: "kosar", c1: "#4a148c", c2: "#ce93d8" },
  "636795": { name: "بانک مرکزی", shortName: "مرکزی", logo: "markazi", c1: "#102a43", c2: "#486581" },
  "636797": { name: "بانک مرکزی", shortName: "مرکزی", logo: "markazi", c1: "#102a43", c2: "#486581" },
};

export const IRAN_BANK_UNKNOWN = {
  name: "بانک نامشخص",
  shortName: "کارت",
  logo: null,
  c1: "#0e4d5c",
  c2: "#1a7a8c",
};

/** Load tiny webp logos as data URIs for offline WebView / content updates. */
export function loadIranBankLogoDataUris(logosDir = BANK_LOGOS_DIR) {
  const map = {};
  if (!fs.existsSync(logosDir)) return map;
  for (const fileName of fs.readdirSync(logosDir)) {
    if (!fileName.endsWith(".webp")) continue;
    const id = fileName.slice(0, -".webp".length);
    const bytes = fs.readFileSync(path.join(logosDir, fileName));
    map[id] = `data:image/webp;base64,${bytes.toString("base64")}`;
  }
  return map;
}
