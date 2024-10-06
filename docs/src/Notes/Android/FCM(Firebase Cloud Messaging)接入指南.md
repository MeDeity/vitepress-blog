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

### 业务级推送
业务级推送就要求后端也接入Firebase,客户端在线时采用MQTT协议推送(RabbitMQ),离线时采用FCM进行消息推送.要求后端也整合`Firebase Admin SDK`,当发现客户端设备离线时,走FCM消息推送.

