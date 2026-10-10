# ==============================================================================
# Oistarian-NEXUS-ONE: Enterprise ProGuard & R8 Optimization Rules
# Target: Android App Bundle (AAB), APK, Hybrid WebKit/WebView, Native JNI
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. GENERAL SHRINKING, OPTIMIZATION & OBFUSCATION
# ------------------------------------------------------------------------------
# Perform aggressive optimization passes (default 5 for R8/ProGuard)
-optimizationpasses 5

# Allow optimizations across packages
-allowaccessmodification

# Repackage all obfuscated classes into a single root package (or leave empty)
-repackageclasses ''

# Overload aggressively for maximum obfuscation without ambiguity
-overloadaggressively

# Use unique class member names across packages
-useuniqueclassmembernames

# Do not skip non-public library classes
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers

# Print processing details to build outputs
-verbose

# ------------------------------------------------------------------------------
# 2. PRESERVE ESSENTIAL DEBUG & STACK TRACE ATTRIBUTES
# Critical for Google Play Console deobfuscation and crash reporting
# ------------------------------------------------------------------------------
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

-keepattributes Exceptions,InnerClasses,EnclosingMethod,Deprecated
-keepattributes Signature,*Annotation*,EnclosingMethod
-keepattributes JavascriptInterface

# Keep generic signatures for reflection/deserialization
-keepattributes *Annotation*,Signature

# ------------------------------------------------------------------------------
# 3. ANDROID FRAMEWORK & LIFECYCLE COMPONENTS
# ------------------------------------------------------------------------------
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep public class com.android.vending.licensing.ILicensingService

# Keep custom Views referenced in XML layouts
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}

# Keep onClick handlers referenced in XML layouts
-keepclassmembers class * extends android.app.Activity {
   public void *(android.view.View);
}

# Keep Parcelable CREATORs
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}

# Keep Serializable class fields
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep enum methods required for reflection
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Native JNI methods
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# ------------------------------------------------------------------------------
# 4. WEBVIEW & JAVASCRIPT BRIDGES (CRITICAL FOR NEXUS HYBRID/PWA APPS)
# ------------------------------------------------------------------------------
# Preserve WebKit JavaScriptInterface annotations and methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep custom WebView bridge interfaces
-keepclassmembers class * {
    @org.xwalk.core.JavascriptInterface <methods>;
}

-keep public class * extends android.webkit.WebViewClient {
    public <methods>;
}

-keep public class * extends android.webkit.WebChromeClient {
    public <methods>;
}

# ------------------------------------------------------------------------------
# 5. ANNOTATION PROCESSORS & @KEEP SUPPORTS
# ------------------------------------------------------------------------------
-keep @interface androidx.annotation.Keep
-keep @androidx.annotation.Keep class * {*;}
-keepclasseswithmembers class * {
    @androidx.annotation.Keep <methods>;
}
-keepclasseswithmembers class * {
    @androidx.annotation.Keep <fields>;
}
-keepclasseswithmembers class * {
    @androidx.annotation.Keep <init>(...);
}

# ------------------------------------------------------------------------------
# 6. JSON SERIALIZATION (GSON / MOSHI / JACKSON / KOTLINX)
# ------------------------------------------------------------------------------
# Gson
-keepattributes Signature
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
    @com.google.gson.annotations.Expose <fields>;
}
-keep public class com.google.gson.** { *; }

# Moshi
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.squareup.moshi.Json <fields>;
}

# ------------------------------------------------------------------------------
# 7. NETWORKING (OKHTTP, RETROFIT, COROUTINES)
# ------------------------------------------------------------------------------
# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Retrofit
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# Kotlin Coroutines
-dontwarn kotlinx.coroutines.**
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ------------------------------------------------------------------------------
# 8. GOOGLE PLAY SERVICES & FIREBASE
# ------------------------------------------------------------------------------
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Google Play In-App Review & In-App Update
-keep class com.google.android.play.core.** { *; }

# ------------------------------------------------------------------------------
# 9. LOGGING & TELEMETRY STRIPPING (PRODUCTION PERFORMANCE)
# Remove debug logging statements in release builds
# ------------------------------------------------------------------------------
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
}

# ------------------------------------------------------------------------------
# 10. SUPPRESS BENIGN WARNINGS
# ------------------------------------------------------------------------------
-dontwarn sun.misc.Unsafe
-dontwarn java.lang.invoke.**
