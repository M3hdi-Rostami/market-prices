import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WATERMARK_PATH = path.join(__dirname, "../assets/images/dollar-bill-watermark.png");

export const DOLLAR_BILL_WATERMARK_URL = (() => {
  const bytes = fs.readFileSync(WATERMARK_PATH);
  return `data:image/png;base64,${bytes.toString("base64")}`;
})();
