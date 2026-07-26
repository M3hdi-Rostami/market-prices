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

package_service_ready() {
  local serial="${1:-}"
  local adb_cmd=(adb)
  if [[ -n "$serial" ]]; then
    adb_cmd=(adb -s "$serial")
  fi
  local check
  check="$("${adb_cmd[@]}" shell service check package 2>/dev/null | tr -d '\r' || true)"
  # Must match "Service package: found" — NOT "not found".
  [[ "$check" == "Service package: found" ]]
}

wait_for_boot() {
  local serial="${1:-}"
  local timeout_s="${2:-240}"
  local elapsed=0
  local adb_cmd=(adb)
  if [[ -n "$serial" ]]; then
    adb_cmd=(adb -s "$serial")
  fi

  echo "Waiting for emulator to finish boot ..."
  "${adb_cmd[@]}" wait-for-device >/dev/null 2>&1 || true

  local boot_seen_at=-1
  while (( elapsed < timeout_s )); do
    local boot boot2
    boot="$("${adb_cmd[@]}" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
    boot2="$("${adb_cmd[@]}" shell getprop dev.bootcomplete 2>/dev/null | tr -d '\r' || true)"
    if [[ "$boot" == "1" || "$boot2" == "1" ]]; then
      if package_service_ready "$serial"; then
        echo "Emulator is ready (package service up)."
        return 0
      fi
      if (( boot_seen_at < 0 )); then
        boot_seen_at=$elapsed
      fi
      # system_server often dies permanently — don't wait the full timeout.
      if (( elapsed - boot_seen_at >= 40 )); then
        echo "Boot flag is set but package service never appeared — treating as broken." >&2
        return 1
      fi
      if (( (elapsed - boot_seen_at) % 10 == 0 )); then
        echo "Boot completed but package service still missing ..."
      fi
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  echo "Timed out waiting for emulator boot/package service (${timeout_s}s)." >&2
  return 1
}
kill_emulator_processes() {
  local serial="${1:-}"
  if [[ -n "$serial" ]]; then
    adb -s "$serial" emu kill >/dev/null 2>&1 || true
  fi
  # Fallbacks if emu kill did not work.
  pkill -f "qemu-system-x86_64.*-avd ${AVD_NAME}" >/dev/null 2>&1 || true
  pkill -f "emulator.*-avd ${AVD_NAME}" >/dev/null 2>&1 || true
  sleep 2
}

start_emulator_background() {
  if [[ ! -x "$SDK_DIR/emulator/emulator" ]]; then
    echo "Emulator binary not found. Run: npm run bootstrap:emulator" >&2
    return 1
  fi
  echo "Starting AVD $AVD_NAME in background ..." >&2
  "$SDK_DIR/emulator/emulator" \
    -avd "$AVD_NAME" \
    -netdelay none \
    -netspeed full \
    -no-snapshot-save \
    >/tmp/market-prices-emulator.log 2>&1 &
  local pid=$!
  echo "Emulator pid=$pid (log: /tmp/market-prices-emulator.log)" >&2
  echo "$pid"
}

wait_for_emulator_serial() {
  local timeout_s="${1:-120}"
  local emu_pid="${2:-}"
  local elapsed=0
  local serial=""
  while (( elapsed < timeout_s )); do
    serial="$(emulator_running || true)"
    if [[ -n "$serial" ]]; then
      echo "$serial"
      return 0
    fi
    if [[ -n "$emu_pid" ]] && ! kill -0 "$emu_pid" 2>/dev/null; then
      echo "Emulator process exited early. See /tmp/market-prices-emulator.log" >&2
      return 1
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  return 1
}

# Ensure an emulator is up with a working package manager. Restarts if stuck.
ensure_emulator_ready() {
  local serial=""
  local emu_pid=""
  local attempt

  for attempt in 1 2 3; do
    serial="$(emulator_running || true)"
    if [[ -z "$serial" ]]; then
      emu_pid="$(start_emulator_background)"
      serial="$(wait_for_emulator_serial 120 "$emu_pid" || true)"
      if [[ -z "$serial" ]]; then
        echo "Timed out waiting for adb emulator device." >&2
        return 1
      fi
    fi

    echo "Using device: $serial (attempt $attempt/3)"
    if wait_for_boot "$serial" 180; then
      # Export for callers that want the pid when we started it.
      ENSURE_EMU_SERIAL="$serial"
      ENSURE_EMU_PID="$emu_pid"
      return 0
    fi

    echo "Emulator package service is broken — restarting AVD ..."
    kill_emulator_processes "$serial"
    emu_pid=""
    sleep 2
  done

  echo "Could not get a healthy emulator after restarts." >&2
  echo "Try manually: npm run emulator" >&2
  return 1
}

install_apk_with_retry() {
  local serial="$1"
  local apk="$2"
  local attempts="${3:-8}"
  local i out

  for ((i = 1; i <= attempts; i++)); do
    if ! package_service_ready "$serial"; then
      echo "Package service not ready (attempt $i/$attempts) — recovering emulator ..."
      if ! ensure_emulator_ready; then
        return 1
      fi
      serial="${ENSURE_EMU_SERIAL:-$serial}"
    fi

    echo "Installing $apk (attempt $i/$attempts) ..."
    if out="$(adb -s "$serial" install -r -t "$apk" 2>&1)"; then
      echo "$out"
      if echo "$out" | grep -qiE 'Success'; then
        ENSURE_EMU_SERIAL="$serial"
        return 0
      fi
    else
      echo "$out"
    fi

    if echo "$out" | grep -qiE 'Can.?t find service: package|device offline|device not found|closed|error: no devices'; then
      echo "Install failed due to dead package service — restarting emulator ..."
      kill_emulator_processes "$serial"
      if ! ensure_emulator_ready; then
        return 1
      fi
      serial="${ENSURE_EMU_SERIAL:-$serial}"
      continue
    fi

    sleep 3
  done

  echo "Failed to install APK after $attempts attempts." >&2
  return 1
}
