# ==============================================================================
# Android App Specific ProGuard / R8 Rules
# Inherits root /proguard-rules.pro
# ==============================================================================
-include ../../proguard-rules.pro

# App-specific keeps for Oistarian-NEXUS-ONE Android Native wrappers
-keep class com.oistars.nexusone.** { *; }
-dontwarn com.oistars.nexusone.**
