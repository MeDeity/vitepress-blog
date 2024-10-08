---
title: "FCM(Firebase Cloud Messaging)接入指南"
outline: deep
desc: "Android社交应用消息推送方案"
tags: "Android"
updateTime: "2024-10-06 09:40"
---

### FCM(Firebase Cloud Messaging)
FCM是Google推出的消息推送服务，通过FCM可以向移动设备发送消息。是Android 海外推送方案的标配。在客户端启动时,注册FCM服务,并获取Token,将该Token通过MQTT发送到服务器进行存储,
客户端在线时,使用MQTT协议实现消息推送,离线时服务端通过第三方Token使用FCM实现消息推送。


### 官方实现
目前官方有提供Android的示例Demo [quickstart-android](https://github.com/firebase/quickstart-android/tree/master),整体上对接还是蛮简单的,在配置完google-services.json文件后,成功启动Demo应用. 启动过程中存在一个小插曲.应用报错
```java
firebase java.io.IOException: AUTHENTICATION_FAILED
```
然后在登录Google应用商店后,`firebase`的消息推送服务就正常了. 

使用过程中需要登录Firebase官网,创建项目,配置google-services.json文件,下载后放置在模块的`app`根目录下.


### 业务级推送
业务级推送就要求后端也接入Firebase,客户端在线时采用MQTT协议推送(RabbitMQ),离线时采用FCM进行消息推送.要求后端也整合`Firebase Admin SDK`,当发现客户端设备离线时,走FCM消息推送.


### Android FCM 推送无法接收到消息

关于推送率问题,不管是原生系统还是国内定制系统,受网络环境影响,网络阻塞或者FCM服务器阻塞,都可能导致消息延迟收到.

1. 国外原生系统
对于国外原生系统,由于google服务是原装的随系统启动,Google Service可以长期后台运行.所以大概率(99.99%)是可以接收到推送.

2. 国内非原生系统
在科学上网后,应用运行的状态下,大概率会收到推送,但应用被Killed后,无法收到推送.因为国内的定制系统FCM服务被阉割了.


应用被Killed后,如果广播或者service无法启动,FCM无法收到推送,不管是国内定制机还是国外原生系统.国内定制机尤其严重.因为国内的定制机FCM服务真的是直接阉割掉了.
当FCM服务重新连接上FCM后台,FCM后将最近的离线消息一并推送.[消息的有效期](https://firebase.google.com/docs/cloud-messaging/concept-options?hl=zh-cn#lifetime)

应用处于后台的情况下,FCM推送可能也会略有延迟,这个是正常现象.[设置消息的优先级](https://firebase.google.com/docs/cloud-messaging/concept-options?hl=zh-cn#setting-the-priority-of-a-message)

电源管理同样也会影响FCM的推送 [电源管理限制](https://developer.android.com/topic/performance/power/power-details?hl=zh-cn)


### 将应用设置成系统应用并且保活是不是就不需要离线推送了
将应用设置成系统应用并且保活,可以一定程度上减少对离线推送的依赖,但并不意味着不需要离线推送了。

系统应用有更高的权限,可以更容易实现保活.例如可以加入白名单避免被系统清理工具Kill.但是保活并没有那么容易。

随着Android系统的更新，系统对后台应用的限制越来越严格。即使是系统应用，也可能会受到系统电源管理策略的影响，导致无法完全保活

即使应用能够保活，持续在后台运行可能会消耗更多的电池资源，影响用户体验。而离线推送可以在不消耗过多资源的情况下，确保用户能够接收到重要通知。

不同设备厂商的定制系统可能有不同的保活限制。而离线推送服务通常与设备厂商合作，能够更好地兼容各种系统和设备。



### 参考链接
1. [Android FCM 推送无法接收的原因](https://blog.csdn.net/xukai59740/article/details/111353836 