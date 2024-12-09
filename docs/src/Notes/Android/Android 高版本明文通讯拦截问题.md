---
title: "Android 高版本明文通讯拦截问题"
outline: deep
desc: "Android 高版本明文通讯拦截问题"
tags: "Android"
updateTime: "2024-12-05 10:00"
---

### 问题描述
`CLEARTEXT communication to xxx.xxx.xxx.xxx not permitted by network security policy`
> 应用尝试与IP地址xxx.xxx.xxx.xxx进行明文（非加密）通信，但是被网络安全策略阻止了

该问题是由于 Android 9.0 及以上版本默认禁止了明文通讯，需要配置 `android:usesCleartextTraffic="true"`。
这个问题发生概率很高,一般开发人员在应用开发初期,基本不会进行加密通信,所以会经常遇到这个问题。庆幸的是，Android 9.0 及以上版本提供了 `android:usesCleartextTraffic="true"` 属性来允许应用进行明文通信。

### 解决方案
在 AndroidManifest


