#!/usr/bin/env bash
# Shared Android SDK / JDK / AVD paths for local tooling.
# Sourced by emulator and install scripts. Everything lives under android/
# which is gitignored.

_ANDROID_ENV_SRC="${BASH_SOURCE[0]:-$0}"
ROOT="$(cd "$(dirname "$_ANDROID_ENV_SRC")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
TOOLS_DIR="$ANDROID_DIR/.tools"
SDK_DIR="$TOOLS_DIR/android-sdk"
JDK_DIR="$TOOLS_DIR/jdk-17"
AVD_HOME="$TOOLS_DIR/avd"
AVD_NAME="${AVD_NAME:-market-prices}"
APP_ID="ir.superextension.marketprices"
APP_ACTIVITY=".MainActivity"
APK_PATH="$ANDROID_DIR/market-prices.apk"

# Lightweight x86_64 image matching compileSdk 34 (no Play Store).
SYSTEM_IMAGE="system-images;android-34;google_apis;x86_64"
EMULATOR_PACKAGES=(
  "emulator"
  "platform-tools"
  "$SYSTEM_IMAGE"
)

export ANDROID_HOME="$SDK_DIR"
export ANDROID_SDK_ROOT="$SDK_DIR"
export ANDROID_AVD_HOME="$AVD_HOME"
export ANDROID_USER_HOME="$TOOLS_DIR/android-user"

if [[ -d "$JDK_DIR" ]]; then
  export JAVA_HOME="$JDK_DIR"
fi

PATH_PREFIX="$SDK_DIR/emulator:$SDK_DIR/platform-tools:$SDK_DIR/cmdline-tools/latest/bin"
if [[ -n "${JAVA_HOME:-}" ]]; then
  PATH_PREFIX="$JAVA_HOME/bin:$PATH_PREFIX"
fi
export PATH="$PATH_PREFIX:$PATH"

mkdir -p "$AVD_HOME" "$ANDROID_USER_HOME"

sdkmanager_bin() {
  echo "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager"
}

avdmanager_bin() {
  echo "$SDK_DIR/cmdline-tools/latest/bin/avdmanager"
}

require_sdk() {
  if [[ ! -x "$(sdkmanager_bin)" ]]; then
    echo "Android cmdline-tools missing under android/.tools/android-sdk" >&2
    echo "Run: npm run bootstrap:apk" >&2
    exit 1
  fi
  if [[ -z "${JAVA_HOME:-}" || ! -x "$JAVA_HOME/bin/java" ]]; then
    echo "JAVA_HOME is not set and bundled JDK was not found at $JDK_DIR" >&2
    exit 1
  fi
}

emulator_running() {
  adb devices 2>/dev/null | awk 'NR>1 && $2=="device" && $1 ~ /^emulator-/' | head -1 | awk '{print $1}'
}

wait_for_boot() {
  local serial="${1:-}"
  local timeout_s="${2:-180}"
  local elapsed=0
  local adb_cmd=(adb)
  if [[ -n "$serial" ]]; then
    adb_cmd=(adb -s "$serial")
  fi

  echo "Waiting for emulator to finish boot ..."
  while (( elapsed < timeout_s )); do
    local boot
    boot="$("${adb_cmd[@]}" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
    if [[ "$boot" == "1" ]]; then
      echo "Emulator is ready."
      return 0
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  echo "Timed out waiting for emulator boot (${timeout_s}s)." >&2
  return 1
}
