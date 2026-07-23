# Market Prices (Android)

Standalone Android app for gold, currency, and car prices.

Previously lived inside `super-extension`; this repo owns the WebView UI, Kotlin shell, and APK build/release pipeline.

## Requirements

- Node.js 18+
- First-time Android deps (cached under `android/.tools/`):

```bash
npm install
npm run bootstrap:apk   # use VPN if Google Maven is blocked
```

## Common commands

```bash
# Build obfuscated market-prices.html (+ car-prices.json)
npm run build

# Build signed/debug APK → android/market-prices.apk
npm run build:apk

# Create release keystore (once)
npm run setup:apk-signing

# Bump APK version, build, upload GitHub release, publish update metadata
npm run release:apk
```

Useful flags for `release:apk`:

- `--no-bump` — keep current versionCode/versionName
- `--no-build` — reuse existing `android/market-prices.apk`
- `--no-upload` — skip GitHub release upload
- `--no-push` — commit update metadata locally only

## Project layout

```
android/                 # Gradle project (gitignored local tools/SDK/keystore)
assets/fonts/            # Vazir-FD.ttf bundled into the APK
tools/market-prices/     # Shared UI logic extracted into the WebView page
scripts/
  android-src/           # Kotlin + AndroidManifest sources (synced into android/)
  android-app-build.gradle.kts
  android-apk-version.json
  build-market-prices-page.mjs
  build-market-prices-apk.mjs
  publish-market-prices-apk.mjs
```

## Versioning & updates

- APK version lives in `scripts/android-apk-version.json`
- In-app update metadata is published to the configured GitHub repo
  (`market-prices-app-version.json` on branch `main`)
- APK binary is attached to the `android-apk` GitHub release tag

## Signing

Release signing uses `android/keystore.properties` + `android/keystore/`.

```bash
npm run setup:apk-signing
```

Back up the `.jks` and passwords. Losing them breaks in-place updates.
