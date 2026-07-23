#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
GRADLE_HOME="$ANDROID_DIR/.tools/gradle-home"
GRADLEW="$ANDROID_DIR/gradlew"
JDK="$ANDROID_DIR/.tools/jdk-17"

if [[ ! -x "$GRADLEW" ]]; then
  echo "Gradle wrapper not found: $GRADLEW" >&2
  exit 1
fi

if [[ -d "$JDK" ]]; then
  export JAVA_HOME="$JDK"
elif [[ -z "${JAVA_HOME:-}" ]]; then
  echo "JAVA_HOME is not set and bundled JDK was not found." >&2
  exit 1
fi

export GRADLE_USER_HOME="$GRADLE_HOME"
mkdir -p "$GRADLE_HOME"

echo "Downloading Android Gradle dependencies ..."
echo "Use VPN if Google Maven is blocked in your region."
echo ""

cd "$ANDROID_DIR"
"$GRADLEW" --no-daemon \
  :app:dependencies \
  :app:assembleRelease \
  --refresh-dependencies

touch "$GRADLE_HOME/.deps-ready"

echo ""
echo "Dependencies cached in android/.tools/gradle-home"
echo "You can now run: npm run build:apk"
