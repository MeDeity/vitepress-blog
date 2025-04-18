---
title: "在Android14上预置智能语音助手"
outline: deep
desc: "在Android14上预置智能语音助手笔记"
tags: "Android,权限,语音助手,展锐"
updateTime: "2024-11-01 10:00"
---
### 简介
需求需要将智能语音助手内置为系统应用用于提升权限.以下记录了相关操作流程及遇到的问题以及解决方案
当前预置应用包名为`com.jx.intellai`

### 内置权限设置
在`frameworks/base/data/etc/Android.bp` 中添加以下内容：
```xml
prebuilt_etc {
    name: "privapp_whitelist_com.jx.intellai",
    system_ext_specific: true,
    sub_dir: "permissions",
    src: "com.jx.intellai.xml",
    filename_from_src: true,
}
```

新建`frameworks/base/data/etc/com.jx.intellai.xml`并添加以下内容：
```xml
<?xml version="1.0" encoding="utf-8"?>
<!--
  ~ Copyright (C) 2019 The Android Open Source Project
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~      http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License
  -->
<permissions>
    <privapp-permissions package="com.jx.intellai">
        <permission name="android.permission.KILL_BACKGROUND_PROCESSES"/>
        <permission name="android.permission.RECORD_AUDIO"/>
        <permission name="android.permission.INTERNET"/>
        <permission name="android.permission.ACCESS_WIFI_STATE"/>
        <permission name="android.permission.REQUEST_INSTALL_PACKAGES"/>
        <permission name="android.permission.ACCESS_NETWORK_STATE"/>
        <permission name="android.permission.WAKE_LOCK"/>
        <permission name="android.permission.CAMERA"/>
        <permission name="android.permission.MODIFY_AUDIO_SETTINGS"/>
        <permission name="android.permission.START_ACTIVITIES_FROM_BACKGROUND"/>
    </privapp-permissions>
</permissions>
```

### 关于权限问题说明
Android 10（API 级别 29）及更高版本对应用在后台运行时可以启动 activity 的时间施加了限制,这里推荐查看下这篇文章
[[AMS] Android 后台进程启动 activity 限制](https://blog.csdn.net/qq_27122177/article/details/136659140)
解决方案就是增加`android.permission.START_ACTIVITIES_FROM_BACKGROUND`权限,这是系统应用才有的权限


### 预置APK应用

将APK放置在`/packages/apps/JxAi/JxAi.apk `目录下即可,并在同目录下新建`Android.mk`文件：
```bash
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

# Module name should match apk name to be installed
LOCAL_MODULE := JxAi
LOCAL_MODULE_TAGS := optional
LOCAL_SRC_FILES := $(LOCAL_MODULE).apk
LOCAL_MODULE_CLASS := APPS
LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
LOCAL_CERTIFICATE := PRESIGNED
LOCAL_REQUIRED_MODULES := privapp_whitelist_com.jx.intellai
LOCAL_REPLACE_PREBUILT_APK_INSTALLED := $(LOCAL_PATH)/$(LOCAL_MODULE).apk
LOCAL_PRIVILEGED_MODULE := true
# 告诉构建系统使用 BUILD_PREBUILT 规则来处理这个模块,将预编译的文件安装到最终的系统映像中
include $(BUILD_PREBUILT)
```
> 由于我们直接APK预置(非源码预置),`Android.mk`出奇的简单


在`\frameworks\base\data\etc\privapp-permissions-platform.xml`中需要为AI应用声明可后台启动的权限：
```xml
<!--{@ add @20241031 for start activity from background-->
<privapp-permissions package="com.jx.intellai">
    <permission name="android.permission.START_ACTIVITIES_FROM_BACKGROUND"/>
</privapp-permissions>
<!--@}-->
```



sys\packages\apps\Settings\src\com\android\settings\password\ChooseLockGeneric.java


### 默认不锁屏
sys\frameworks\base\packages\SettingsProvider\res\values\defaults.xml
```xml
<!--{@ modify @20241031 设置设备默认不锁屏-->
<bool name="def_lockscreen_disabled">true</bool>
<!--@}-->
```

### 在Config.mk中添加预置应用
```mk
#---内置APP配置区 device.mk 添加--------------------------------------------
PRODUCT_PACKAGES=JxAi Moonchat
```

> 以下内容可能不通用仅当记录用

做好以上的配置后,在`vnd`目录下执行`source zlunch.sh && source zmk`
