# ProGuard & R8 Obfuscation Guide

This document details the ProGuard and R8 configuration for **Oistarian-NEXUS-ONE** across Android native wrappers, hybrid WebViews, and Google Play Store distributions.

---

## 1. Overview of ProGuard / R8 in NEXUS-ONE

ProGuard and R8 perform three critical operations on the production bytecode:
1. **Shrinking (Tree Shaking)**: Detects and safely strips unused classes, fields, methods, and attributes from third-party libraries and application code.
2. **Optimization**: Rewrites bytecode to reduce execution overhead, inlines short functions, merges interfaces, and eliminates dead code branches.
3. **Obfuscation**: Renames remaining classes, methods, and fields into short, cryptic identifiers (e.g., `a`, `b`, `c`), preventing reverse-engineering while preserving runtime reflection and serialization contracts.

The primary configuration files are located at:
- **Root configuration**: `/proguard-rules.pro`
- **Android module configuration**: `/android/app/proguard-rules.pro`

---

## 2. Key Configuration Directives

### A. Preserving Line Numbers and Deobfuscation Mapping
To allow crash logs reported in Google Play Console to be deobfuscated into human-readable stack traces, we retain `LineNumberTable` and `SourceFile`:

```proguard
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
```

### B. WebView & JavaScriptInterface Bridges
NEXUS-ONE features high-performance web components running inside Android WebKit/WebView containers. Javascript bridges must not have their annotated interface methods stripped or renamed:

```proguard
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep public class * extends android.webkit.WebViewClient {
    public <methods>;
}
-keep public class * extends android.webkit.WebChromeClient {
    public <methods>;
}
```

### C. Reflection & JSON Serialization
Serialization models using Gson, Moshi, or Jackson require preservation of `@SerializedName` annotations and field signatures:

```proguard
-keepattributes *Annotation*,Signature
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
    @com.google.gson.annotations.Expose <fields>;
}
```

### D. Production Telemetry & Log Stripping
Release builds automatically strip verbose and debug log statements to maximize runtime performance and avoid leaking operational telemetry:

```proguard
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
}
```

---

## 3. Build & Gradle Integration

In your `android/app/build.gradle` file, enable minification and reference the rules:

```groovy
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 
                          'proguard-rules.pro',
                          '../../proguard-rules.pro'
            
            ndk {
                debugSymbolLevel 'FULL'
            }
        }
    }
}
```

---

## 4. Troubleshooting Deobfuscation & Verification

### Verifying Obfuscation Output
When running `./gradlew assembleRelease` or `./gradlew bundleRelease`, R8 outputs the following artifacts in `android/app/build/outputs/mapping/release/`:
- `mapping.txt`: Maps original class and method names to their obfuscated names. **Keep this file backed up for every release.**
- `seeds.txt`: Lists classes and members that matched `-keep` rules and were not obfuscated.
- `usage.txt`: Lists code stripped by the tree shaker.
- `configuration.txt`: The consolidated set of ProGuard rules applied from all dependencies.

### Re-tracing an Obfuscated Stack Trace Locally
To deobfuscate a crash trace locally using Android's `retrace` tool:
```bash
retrace.sh build/playstore-symbols/mapping.txt crash_stacktrace.txt
```
Or using R8's `retrace` CLI:
```bash
java -jar r8.jar retrace --mapping build/playstore-symbols/mapping.txt < crash_stacktrace.txt
```
