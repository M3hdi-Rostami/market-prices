import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WATERMARK_PATH = path.join(__dirname, "../assets/images/gold-medal-watermark.png");

export const GOLD_MEDAL_WATERMARK_URL = (() => {
  const bytes = fs.readFileSync(WATERMARK_PATH);
  return `data:image/png;base64,${bytes.toString("base64")}`;
})();
