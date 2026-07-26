# Market Prices (Android)

Standalone Android app for gold, currency, and car prices.

Previously lived inside `super-extension`; this repo owns the WebView UI, Kotlin shell, and APK build/release pipeline.

## Requirements

- Node.js 24.16+
- First-time Android deps (cached under `android/.tools/`):

```bash
npm install
npm run bootstrap:apk   # use VPN if Google Maven is blocked
```

## Common commands

```bash
# Build obfuscated market-prices.html
npm run build

# Build signed/debug APK → android/market-prices.apk
npm run build:apk

# Create release keystore (once)
npm run setup:apk-signing

# Bump APK version, build, upload GitHub release, publish update metadata
npm run release:apk
```

## Local Android emulator

Test on your PC without releasing / sideloading on a phone. Emulator SDK packages and the AVD live under `android/.tools/` (already gitignored).

```bash
# One-time: download emulator + API 34 system image, create AVD
npm run bootstrap:emulator   # use VPN if Google downloads are blocked

# Start the emulator window (keep it open)
npm run emulator

# Watch sources: rebuild + install on every change (leave running)
npm run reload

# One-shot rebuild + install (no watch)
npm run reload:once

# Reinstall existing APK only (does NOT pick up source changes)
npm run run:apk:fast
```

`run:apk` also starts the emulator in the background if none is running.

Useful flags for `release:apk`:

- `--no-bump` — keep current versionCode/versionName
- `--no-build` — reuse existing `android/market-prices.apk`
- `--no-upload` — skip GitHub release upload
- `--no-push` — commit update metadata locally only

## Project layout

```
android/                 # Gradle project (gitignored local tools/SDK/keystore/AVD)
assets/fonts/            # Vazir-FD.ttf bundled into the APK
tools/market-prices/     # Shared UI logic extracted into the WebView page
scripts/
  android-src/           # Kotlin + AndroidManifest sources (synced into android/)
  android-app-build.gradle.kts
  android-apk-version.json
  android-sdk-env.sh
  bootstrap-android-emulator.sh
  run-android-emulator.sh
  install-on-emulator.sh
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
