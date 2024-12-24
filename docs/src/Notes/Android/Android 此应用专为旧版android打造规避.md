---
title: "Android 此应用专为旧版android打造规避"
outline: deep
desc: "Android 此应用专为旧版android打造规避"
tags: "Android"
updateTime: "2024-12-19"
---

### 此应用专为旧版android打造弹窗
很多早期的应用安装到新版Android上都会弹出这个提示，在维护一些老项目时，需要兼容旧版Android系统，那么如何规避这个提示呢？

这个行为是`frameworks/base/services/core/java/com/android/server/wm/AppWarnings.java` 中的`showDeprecatedTargetDialogIfNeeded`方法实现的
```java
/** Shows the "deprecated target sdk" warning, if necessary.
 *
 * @param r activity record for which the warning may be displayed
 */
public void showDeprecatedTargetDialogIfNeeded(ActivityRecord r) {
    if (r.info.applicationInfo.targetSdkVersion < Build.VERSION.MIN_SUPPORTED_TARGET_SDK_INT) {
        mUiHandler.showDeprecatedTargetDialog(r);
    }
}
```

`frameworks/base/core/java/android/os/Build.java`
```java
/**
 * The current lowest supported value of app target SDK. Applications targeting
 * lower values may not function on devices running this SDK version. Its possible
 * values are defined in {@link Build.VERSION_CODES}.
 *
 * @hide
 */
public static final int MIN_SUPPORTED_TARGET_SDK_INT = SystemProperties.getInt(
        "ro.build.version.min_supported_target_sdk", 0);
```
通过以下命令可以知道,只要低于该值，就会弹出提示
```bash
adb shell getprop ro.build.version.min_supported_target_sdk
# 例如返回 28,表示只要APK的targetSdkVersion低于28,就会弹出提示
```
如果可以修改APK,那么把targetSdkVersion改为返回值以上即可

