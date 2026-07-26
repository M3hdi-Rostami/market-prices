#!/usr/bin/env node
/**
 * Watch source files and rebuild+install the APK on the emulator whenever they change.
 * Usage: npm run reload
 * Stop with Ctrl+C.
 */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const installScript = path.join(rootDir, "scripts/install-on-emulator.sh");

const WATCH_DIRS = [
  path.join(rootDir, "scripts"),
  path.join(rootDir, "tools"),
  path.join(rootDir, "assets"),
];

const IGNORE_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "android",
  "dist",
  ".release-repo",
  ".tools",
  ".gradle",
  "build",
]);

const WATCH_EXT = new Set([
  ".mjs",
  ".js",
  ".ts",
  ".json",
  ".html",
  ".css",
  ".kt",
  ".kts",
  ".xml",
  ".properties",
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
]);

const DEBOUNCE_MS = 900;

let debounceTimer = null;
let running = false;
let pending = false;
let reloadCount = 0;

function shouldIgnore(filePath) {
  const rel = path.relative(rootDir, filePath);
  if (!rel || rel.startsWith("..")) return true;
  const parts = rel.split(path.sep);
  if (parts.some((p) => IGNORE_DIR_NAMES.has(p))) return true;
  // Generated page at repo root — rebuilt by the pipeline itself.
  if (rel === "market-prices.html" || rel === "market-prices-app-version.json") return true;
  const base = path.basename(filePath);
  if (base.startsWith(".") && !WATCH_EXT.has(path.extname(base))) return true;
  return false;
}

function isWatchedFile(filePath) {
  if (shouldIgnore(filePath)) return false;
  const ext = path.extname(filePath).toLowerCase();
  if (!ext) return false;
  return WATCH_EXT.has(ext);
}

function stamp() {
  return new Date().toLocaleTimeString("fa-IR", { hour12: false });
}

function runReload(reason) {
  if (running) {
    pending = true;
    console.log(`[${stamp()}] change while building — will reload again after current build`);
    return;
  }

  running = true;
  pending = false;
  reloadCount += 1;
  const n = reloadCount;
  console.log("");
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`[${stamp()}] reload #${n}${reason ? ` · ${reason}` : ""}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const child = spawn("bash", [installScript], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code) => {
    running = false;
    if (code === 0) {
      console.log(`[${stamp()}] reload #${n} done — watching for changes (Ctrl+C to stop)`);
    } else {
      console.error(`[${stamp()}] reload #${n} failed (exit ${code}) — still watching`);
    }
    if (pending) {
      pending = false;
      runReload("queued changes");
    }
  });
}

function scheduleReload(filePath) {
  const rel = path.relative(rootDir, filePath);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runReload(rel);
  }, DEBOUNCE_MS);
}

function watchDir(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      const full = path.join(dir, filename);
      if (!isWatchedFile(full)) return;
      // Ignore transient editor files
      if (filename.endsWith("~") || filename.endsWith(".swp") || filename.includes(".tmp")) return;
      scheduleReload(full);
    });
    watcher.on("error", (err) => {
      console.error(`[watch] error on ${path.relative(rootDir, dir)}:`, err.message);
    });
  } catch (err) {
    console.error(`[watch] failed to watch ${dir}:`, err.message);
  }
}

console.log("Emulator reload watcher");
console.log("Watching:");
for (const dir of WATCH_DIRS) {
  console.log(`  · ${path.relative(rootDir, dir)}/`);
  watchDir(dir);
}
console.log("");
console.log("First build starting…");
runReload("startup");

function shutdown() {
  console.log("\nStopped watching.");
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
