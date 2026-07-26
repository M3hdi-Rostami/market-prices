#!/usr/bin/env bash
set -euo pipefail

# Start the local Android emulator AVD (foreground by default).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=android-sdk-env.sh
source "$SCRIPT_DIR/android-sdk-env.sh"

require_sdk

if [[ ! -f "$TOOLS_DIR/.emulator-ready" && ! -d "$AVD_HOME/$AVD_NAME.avd" ]]; then
  echo "Emulator AVD not set up yet." >&2
  echo "Run: npm run bootstrap:emulator" >&2
  exit 1
fi

if [[ ! -x "$SDK_DIR/emulator/emulator" ]]; then
  echo "Emulator binary not found. Run: npm run bootstrap:emulator" >&2
  exit 1
fi

existing="$(emulator_running || true)"
if [[ -n "$existing" ]]; then
  echo "Emulator already running: $existing"
  exit 0
fi

if [[ ! -e /dev/kvm ]]; then
  echo "Warning: /dev/kvm not found — emulator will be slow without KVM." >&2
fi

echo "Starting AVD: $AVD_NAME"
echo "Close the emulator window or Ctrl+C to stop."
echo ""

exec "$SDK_DIR/emulator/emulator" \
  -avd "$AVD_NAME" \
  -netdelay none \
  -netspeed full \
  -no-snapshot-save \
  "$@"
