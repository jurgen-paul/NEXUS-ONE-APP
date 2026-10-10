# Google Play Store Symbols & Deobfuscation Guide

This guide describes how **Oistarian-NEXUS-ONE** manages native debug symbols and ProGuard deobfuscation files for Google Play Console release management, crash deobfuscation, and Android Vitals tracking.

---

## 1. Why Play Store Symbols Are Required

When publishing release Android App Bundles (`.aab`) or APKs to Google Play:
1. **JVM Deobfuscation (`mapping.txt`)**: R8/ProGuard shrinks and renames classes and methods to single letters. Without the corresponding `mapping.txt`, crash reports in Google Play Console appear illegible (e.g., `at com.oistars.nexusone.a.b.c(Unknown Source:1)`).
2. **Native Debug Symbols (`native-debug-symbols.zip`)**: Native C/C++ libraries (`.so`) compiled via NDK for audio synthesis, WebGL/LiDAR point-cloud rendering, or cryptographic routines are stripped of DWARF debug symbols to save bandwidth. The Play Console requires unstripped symbol files to reconstruct native C++ call stacks from tombstone crash files.

---

## 2. Automated Generation with Gradle

Configure your release build block in `android/app/build.gradle` to automatically generate full native symbol tables and preserve deobfuscation mappings:

```groovy
android {
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.oistars.nexusone"
        minSdkVersion 26
        targetSdkVersion 34
        versionCode 100
        versionName "5.1.0"

        ndk {
            abiFilters 'arm64-v8a', 'armeabi-v7a', 'x86_64'
            debugSymbolLevel 'FULL' // Generates complete DWARF debug symbols
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            
            ndk {
                debugSymbolLevel 'FULL'
            }
        }
    }
}
```

When building an App Bundle via:
```bash
./gradlew bundleRelease
```
Gradle automatically embeds both the `mapping.txt` and native debug symbols directly into the `.aab` archive under `BUNDLE-METADATA/com.android.tools.build.obfuscation/` and `BUNDLE-METADATA/com.android.tools.build.debugsymbols/`.

---

## 3. Manual Packaging via NEXUS-ONE Automation Script

If building standalone APKs or using external CI/CD pipelines, package symbols using the included helper script:

```bash
chmod +x scripts/package-playstore-symbols.sh
./scripts/package-playstore-symbols.sh
```

This creates a release archive bundle in `build/playstore-symbols/`:
- `mapping.txt` - R8 obfuscation mapping
- `native-debug-symbols.zip` - Structured DWARF symbols partitioned by ABI (`arm64-v8a`, `armeabi-v7a`, `x86_64`)
- `SHA256SUMS.txt` - Cryptographic verification hashes

---

## 4. Uploading to Google Play Console

### Method A: Direct App Bundle Upload (Recommended)
If `debugSymbolLevel 'FULL'` is configured, building with `./gradlew bundleRelease` already embeds the debug metadata into the `.aab`. Google Play Console extracts and indexes symbols upon upload automatically.

### Method B: Manual Upload via Play Console Web UI
If Google Play Console alerts: *"This App Bundle contains native code, and you haven't uploaded debug symbols"*, follow these steps:
1. Open [Google Play Console](https://play.google.com/console).
2. Select **Oistarian-NEXUS-ONE** > **Release** > **App bundle explorer**.
3. Select the target release version tab.
4. Navigate to **Downloads** > **Assets**.
5. Locate **Deobfuscation files**:
   - Click **Upload** next to **ProGuard mapping file** and upload `build/playstore-symbols/mapping.txt`.
   - Click **Upload** next to **Native debug symbols** and upload `build/playstore-symbols/native-debug-symbols.zip`.

### Method C: Automated CI/CD via Fastlane or Gradle Play Publisher
Using the `gradle-play-publisher` plugin:
```bash
./gradlew publishReleaseBundle \
  --upload-mapping \
  --upload-native-debug-symbols
```

---

## 5. Verifying Symbol Deobfuscation in Android Vitals

1. In Google Play Console, navigate to **Quality** > **Android vitals** > **Crashes and ANRs**.
2. Select any recent stack trace.
3. If symbols are correctly registered, stack frames display exact package names, class names, file names, and line numbers (e.g. `SpatialLiDARScanner.kt:142`) instead of obfuscated identifiers.
