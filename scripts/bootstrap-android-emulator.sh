#!/usr/bin/env bash
set -euo pipefail

# One-time: install Android Emulator + system image and create a local AVD.
# All artifacts land under android/.tools/ (gitignored via android/).
#
# Prefer sdkmanager; if Google repo is blocked, fall back to mirror ZIP downloads
# (same pattern as the existing android/.tools/sdk-zips/ packages).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=android-sdk-env.sh
source "$SCRIPT_DIR/android-sdk-env.sh"

require_sdk

ZIP_DIR="$TOOLS_DIR/sdk-zips"
mkdir -p "$ZIP_DIR" "$SDK_DIR"

# Stable package filenames (channel-0 emulator + API 34 google_apis x86_64).
EMULATOR_ZIP="emulator-linux_x64-15507667.zip"
EMULATOR_DIR_NAME="emulator"
SYSIMG_ZIP="x86_64-34_r14.zip"
SYSIMG_REL="system-images/android-34/google_apis/x86_64"

# gvt1 CDN usually works when dl.google.com is blocked; Tencent as fallback.
MIRRORS=(
  "https://redirector.gvt1.com/edgedl/android/repository"
  "https://mirrors.cloud.tencent.com/AndroidSDK"
)

download_one() {
  local url="$1"
  local dest="$2"
  local partial="$dest.partial"
  local meta="$dest.partial.url"
  local attempt

  # Switching mirrors mid-file would corrupt a resumed download.
  if [[ -f "$partial" && -f "$meta" ]]; then
    if [[ "$(cat "$meta")" != "$url" ]]; then
      rm -f "$partial" "$meta"
    fi
  fi

  echo "  trying $url"
  for attempt in 1 2 3 4 5; do
    echo "$url" >"$meta"
    if curl -fL --retry 2 --retry-delay 3 --connect-timeout 30 \
      --continue-at - \
      -o "$partial" "$url"; then
      mv "$partial" "$dest"
      rm -f "$meta"
      echo "  downloaded $(du -h "$dest" | awk '{print $1}')"
      return 0
    fi
    echo "  attempt $attempt failed; retrying in 5s ..."
    sleep 5
  done
  return 1
}

download_zip() {
  local filename="$1"
  local subpath="${2:-}" # e.g. sys-img/google_apis/ for system images
  local dest="$ZIP_DIR/$filename"
  local urls=()
  local base url

  if [[ -f "$dest" ]]; then
    local size
    size="$(wc -c <"$dest" | tr -d ' ')"
    if (( size > 1000000 )); then
      echo "  using cached $dest"
      return 0
    fi
    rm -f "$dest"
  fi

  for base in "${MIRRORS[@]}"; do
    if [[ -n "$subpath" ]]; then
      urls+=("$base/$subpath$filename")
    fi
    urls+=("$base/$filename")
  done

  for url in "${urls[@]}"; do
    if download_one "$url" "$dest"; then
      return 0
    fi
  done

  echo "Failed to download $filename. Tried:" >&2
  printf '  %s\n' "${urls[@]}" >&2
  echo "Partial file kept at ${dest}.partial (resume on re-run)." >&2
  echo "Use VPN / another network, then re-run: npm run bootstrap:emulator" >&2
  exit 1
}

install_emulator_from_zip() {
  if [[ -x "$SDK_DIR/emulator/emulator" ]]; then
    echo "Emulator already installed."
  else
    echo "Downloading Android Emulator ..."
    download_zip "$EMULATOR_ZIP"
    echo "Extracting emulator ..."
    rm -rf "$SDK_DIR/$EMULATOR_DIR_NAME"
    unzip -q -o "$ZIP_DIR/$EMULATOR_ZIP" -d "$SDK_DIR"
    if [[ ! -x "$SDK_DIR/emulator/emulator" ]]; then
      echo "Emulator binary missing after extract." >&2
      exit 1
    fi
  fi

  # Official ZIP only ships source.properties; avdmanager needs package.xml.
  if [[ ! -f "$SDK_DIR/emulator/package.xml" ]]; then
    cat >"$SDK_DIR/emulator/package.xml" <<'EOF'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:repository xmlns:ns2="http://schemas.android.com/repository/android/common/02"
                 xmlns:ns5="http://schemas.android.com/repository/android/generic/02"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <license id="android-sdk-license" type="text">Placeholder</license>
  <localPackage path="emulator" obsolete="false">
    <type-details xsi:type="ns5:genericDetailsType"/>
    <revision>
      <major>36</major>
      <minor>6</minor>
      <micro>11</micro>
    </revision>
    <display-name>Android Emulator</display-name>
    <uses-license ref="android-sdk-license"/>
  </localPackage>
</ns2:repository>
EOF
  fi
}

install_sysimg_from_zip() {
  local target="$SDK_DIR/$SYSIMG_REL"
  if [[ -f "$target/system.img" || -f "$target/system-qemu.img" ]]; then
    echo "System image already installed: $SYSIMG_REL"
    return 0
  fi

  echo "Downloading system image (API 34 google_apis x86_64, ~1.5GB) ..."
  download_zip "$SYSIMG_ZIP" "sys-img/google_apis/"
  echo "Extracting system image ..."
  mkdir -p "$target"
  # Zip may contain files at root or under google_apis/x86_64/
  local tmp
  tmp="$(mktemp -d "$TOOLS_DIR/sysimg-extract.XXXXXX")"
  unzip -q -o "$ZIP_DIR/$SYSIMG_ZIP" -d "$tmp"
  if [[ -f "$tmp/system.img" || -f "$tmp/system-qemu.img" ]]; then
    cp -a "$tmp"/. "$target"/
  elif [[ -d "$tmp/x86_64" ]]; then
    cp -a "$tmp/x86_64"/. "$target"/
  else
    # nested google_apis/x86_64
    local nested
    nested="$(find "$tmp" -type f \( -name system.img -o -name system-qemu.img \) | head -1)"
    if [[ -z "$nested" ]]; then
      echo "Could not find system.img inside $SYSIMG_ZIP" >&2
      rm -rf "$tmp"
      exit 1
    fi
    cp -a "$(dirname "$nested")"/. "$target"/
  fi
  rm -rf "$tmp"

  # Ensure package.xml exists so avdmanager can see the image.
  if [[ ! -f "$target/package.xml" ]]; then
    cat >"$target/package.xml" <<EOF
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:repository xmlns:ns2="http://schemas.android.com/repository/android/common/02"
                 xmlns:sys-img="http://schemas.android.com/sdk/android/repo/sys-img2/02">
  <localPackage path="system-images;android-34;google_apis;x86_64" obsolete="false">
    <type-details xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:type="sys-img:sysImgDetailsType">
      <api-level>34</api-level>
      <tag>
        <id>google_apis</id>
        <display>Google APIs</display>
      </tag>
      <abi>x86_64</abi>
    </type-details>
    <revision>
      <major>14</major>
    </revision>
    <display-name>Google APIs Intel x86_64 Atom System Image</display-name>
  </localPackage>
</ns2:repository>
EOF
  fi
}

try_sdkmanager_install() {
  # Skip quickly when Google's primary host is unreachable (common in some regions).
  if ! curl -fsI --connect-timeout 5 --max-time 8 \
    "https://dl.google.com/android/repository/repository2-1.xml" >/dev/null 2>&1; then
    echo "dl.google.com unreachable — skipping sdkmanager, using mirror ZIPs."
    return 1
  fi

  echo "Trying sdkmanager install ..."
  yes | "$(sdkmanager_bin)" --sdk_root="$SDK_DIR" --licenses >/dev/null 2>&1 || true
  if "$(sdkmanager_bin)" --sdk_root="$SDK_DIR" "${EMULATOR_PACKAGES[@]}" 2>/tmp/sdkmanager-emulator.err; then
    return 0
  fi
  echo "sdkmanager failed. Falling back to mirror ZIPs."
  if [[ -s /tmp/sdkmanager-emulator.err ]]; then
    tail -n 5 /tmp/sdkmanager-emulator.err | sed 's/^/  /'
  fi
  return 1
}

echo "Installing emulator packages (under android/.tools/) ..."
echo "Use VPN if downloads fail in your region."
echo ""

if ! try_sdkmanager_install; then
  install_emulator_from_zip
  install_sysimg_from_zip
fi

if [[ ! -x "$SDK_DIR/emulator/emulator" ]]; then
  echo "Emulator binary missing: $SDK_DIR/emulator/emulator" >&2
  exit 1
fi

if [[ -d "$AVD_HOME/$AVD_NAME.avd" ]]; then
  echo "AVD already exists: $AVD_NAME"
else
  echo "Creating AVD: $AVD_NAME ($SYSTEM_IMAGE)"
  echo no | "$(avdmanager_bin)" create avd \
    --name "$AVD_NAME" \
    --package "$SYSTEM_IMAGE" \
    --device "pixel_6" \
    --force
fi

# Tune AVD for local desktop use (idempotent).
AVD_CONFIG="$AVD_HOME/$AVD_NAME.avd/config.ini"
if [[ -f "$AVD_CONFIG" ]]; then
  python3 - "$AVD_CONFIG" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
overrides = {
    "hw.ramSize": "2048",
    "hw.heapSize": "256",
    "disk.dataPartition.size": "4G",
    "hw.keyboard": "yes",
    "hw.gpu.enabled": "yes",
    "hw.gpu.mode": "auto",
}
lines, seen = [], set()
for line in p.read_text().splitlines():
    if "=" not in line or line.strip().startswith("#"):
        lines.append(line)
        continue
    key = line.split("=", 1)[0].strip()
    if key in overrides:
        if key in seen:
            continue
        lines.append(f"{key}={overrides[key]}")
        seen.add(key)
    else:
        lines.append(line)
for key, val in overrides.items():
    if key not in seen:
        lines.append(f"{key}={val}")
p.write_text("\n".join(lines) + "\n")
PY
fi

touch "$TOOLS_DIR/.emulator-ready"

echo ""
echo "Emulator ready (gitignored under android/.tools/)."
echo "Next:"
echo "  npm run emulator          # start the AVD window"
echo "  npm run run:apk           # build APK, install, and launch"
