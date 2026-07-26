#!/usr/bin/env bash
set -euo pipefail

# Build (optional), install, and launch the app on a running emulator.
# Starts / restarts the emulator if the package service is dead.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=android-sdk-env.sh
source "$SCRIPT_DIR/android-sdk-env.sh"

SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --no-build) SKIP_BUILD=1 ;;
    -h|--help)
      echo "Usage: $0 [--no-build]"
      echo "  --no-build  reuse existing android/market-prices.apk"
      exit 0
      ;;
  esac
done

require_sdk

if [[ ! -d "$AVD_HOME/$AVD_NAME.avd" ]]; then
  echo "Emulator AVD not set up yet." >&2
  echo "Run: npm run bootstrap:emulator" >&2
  exit 1
fi

ENSURE_EMU_SERIAL=""
ENSURE_EMU_PID=""
ensure_emulator_ready
serial="${ENSURE_EMU_SERIAL}"
emulator_pid="${ENSURE_EMU_PID}"

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  echo "Building APK (includes latest HTML/JS) ..."
  (cd "$ROOT" && npm run build:apk)
  # Build can take minutes; emulator may die or lose package service.
  echo "Re-checking emulator after build ..."
  ensure_emulator_ready
  serial="${ENSURE_EMU_SERIAL}"
  if [[ -n "${ENSURE_EMU_PID}" ]]; then
    emulator_pid="${ENSURE_EMU_PID}"
  fi
else
  if [[ ! -f "$APK_PATH" ]]; then
    echo "APK not found: $APK_PATH" >&2
    echo "Run: npm run reload   (rebuilds + installs)" >&2
    exit 1
  fi
  echo "Reusing existing APK (no rebuild): $APK_PATH"
  echo "Tip: use npm run reload to apply source changes."
fi

echo "Stopping previous app instance ..."
adb -s "$serial" shell am force-stop "$APP_ID" >/dev/null 2>&1 || true

install_apk_with_retry "$serial" "$APK_PATH" 8
serial="${ENSURE_EMU_SERIAL:-$serial}"

# Drop WebView HTTP cache so bundled asset changes show up immediately.
adb -s "$serial" shell "run-as $APP_ID sh -c 'rm -rf cache/WebView app_webview/Default/Cache 2>/dev/null; true'" >/dev/null 2>&1 || true

echo "Launching $APP_ID ..."
adb -s "$serial" shell am start -n "$APP_ID/$APP_ACTIVITY"

echo ""
echo "App is running on the emulator with the installed APK."
if [[ -n "$emulator_pid" ]]; then
  echo "Emulator keeps running in the background (pid $emulator_pid)."
  echo "To stop it: kill $emulator_pid"
fi
