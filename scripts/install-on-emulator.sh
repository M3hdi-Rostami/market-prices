#!/usr/bin/env bash
set -euo pipefail

# Build (optional), install, and launch the app on a running emulator.
# Starts the emulator in the background if none is running.

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

serial="$(emulator_running || true)"
emulator_pid=""

if [[ -z "$serial" ]]; then
  if [[ ! -x "$SDK_DIR/emulator/emulator" ]]; then
    echo "Emulator binary not found. Run: npm run bootstrap:emulator" >&2
    exit 1
  fi
  echo "No emulator running — starting $AVD_NAME in background ..."
  "$SDK_DIR/emulator/emulator" \
    -avd "$AVD_NAME" \
    -netdelay none \
    -netspeed full \
    -no-snapshot-save \
    >/tmp/market-prices-emulator.log 2>&1 &
  emulator_pid=$!
  echo "Emulator pid=$emulator_pid (log: /tmp/market-prices-emulator.log)"

  # Wait until adb sees an emulator device.
  for _ in $(seq 1 60); do
    serial="$(emulator_running || true)"
    if [[ -n "$serial" ]]; then
      break
    fi
    if ! kill -0 "$emulator_pid" 2>/dev/null; then
      echo "Emulator process exited early. See /tmp/market-prices-emulator.log" >&2
      exit 1
    fi
    sleep 2
  done

  if [[ -z "$serial" ]]; then
    echo "Timed out waiting for adb emulator device." >&2
    exit 1
  fi
fi

echo "Using device: $serial"
wait_for_boot "$serial" 240

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  echo "Building APK (includes latest HTML/JS) ..."
  (cd "$ROOT" && npm run build:apk)
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

echo "Installing $APK_PATH ..."
adb -s "$serial" install -r -t "$APK_PATH"

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
