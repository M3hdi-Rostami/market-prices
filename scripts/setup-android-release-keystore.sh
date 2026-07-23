#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
KEYSTORE_DIR="$ANDROID_DIR/keystore"
KEYSTORE_FILE="$KEYSTORE_DIR/market-prices-release.jks"
PROPS_FILE="$ANDROID_DIR/keystore.properties"
KEY_ALIAS="${KEYSTORE_KEY_ALIAS:-market-prices}"
VALIDITY_DAYS="${KEYSTORE_VALIDITY_DAYS:-10000}"
DNAME="${KEYSTORE_DNAME:-CN=Super Extension, OU=Mobile, O=Super Extension, L=Tehran, ST=Tehran, C=IR}"

resolve_keytool() {
  if [[ -x "$ANDROID_DIR/.tools/jdk-17/bin/keytool" ]]; then
    echo "$ANDROID_DIR/.tools/jdk-17/bin/keytool"
    return
  fi
  if command -v keytool >/dev/null 2>&1; then
    command -v keytool
    return
  fi
  echo "keytool not found. Install JDK or run: npm run bootstrap:apk" >&2
  exit 1
}

prompt_secret() {
  local label="$1"
  local var_name="$2"
  local value=""

  if [[ -n "${!var_name:-}" ]]; then
    return 0
  fi

  read -r -s -p "$label: " value
  echo ""
  if [[ -z "$value" ]]; then
    echo "Password cannot be empty." >&2
    exit 1
  fi
  printf -v "$var_name" "%s" "$value"
}

KEYTOOL="$(resolve_keytool)"

if [[ ! -d "$ANDROID_DIR" ]]; then
  echo "Android project not found: $ANDROID_DIR" >&2
  exit 1
fi

mkdir -p "$KEYSTORE_DIR"

if [[ -f "$KEYSTORE_FILE" ]]; then
  echo "Release keystore already exists:"
  echo "  $KEYSTORE_FILE"
  echo ""
  echo "To inspect:"
  echo "  $KEYTOOL -list -v -keystore \"$KEYSTORE_FILE\" -alias \"$KEY_ALIAS\""
  exit 0
fi

prompt_secret "Keystore password (storePassword)" KEYSTORE_STORE_PASSWORD
prompt_secret "Key password (keyPassword, Enter = same as keystore)" KEYSTORE_KEY_PASSWORD

if [[ -z "${KEYSTORE_KEY_PASSWORD:-}" ]]; then
  KEYSTORE_KEY_PASSWORD="$KEYSTORE_STORE_PASSWORD"
fi

echo ""
echo "Creating release keystore ..."
echo "  file : $KEYSTORE_FILE"
echo "  alias: $KEY_ALIAS"
echo "  dname: $DNAME"
echo ""

"$KEYTOOL" -genkeypair -v \
  -keystore "$KEYSTORE_FILE" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity "$VALIDITY_DAYS" \
  -storetype JKS \
  -storepass "$KEYSTORE_STORE_PASSWORD" \
  -keypass "$KEYSTORE_KEY_PASSWORD" \
  -dname "$DNAME"

cat > "$PROPS_FILE" <<EOF
storeFile=keystore/market-prices-release.jks
storePassword=${KEYSTORE_STORE_PASSWORD}
keyAlias=${KEY_ALIAS}
keyPassword=${KEYSTORE_KEY_PASSWORD}
EOF

chmod 600 "$PROPS_FILE" 2>/dev/null || true

echo ""
echo "Done."
echo "  keystore : $KEYSTORE_FILE"
echo "  props    : $PROPS_FILE"
echo ""
echo "IMPORTANT: back up the .jks file and passwords somewhere safe."
echo "If you lose them, users cannot update the app in-place."
echo ""
echo "Next: npm run build:apk"
