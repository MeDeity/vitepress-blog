---
title: "Android Framework实现流量统计笔记"
outline: deep
desc: "Android Framework实现流量统计笔记"
tags: "Framework"
updateTime: "2025-12-13"
---

## 概述
需求是对Android设备上的当天流量使用情况进行统计，包括上行和下行数据。考虑到每天都需要上报，可以做成定时任务,而且由于上报存在失败的情况(比如没有网络),
所以需要重试机制(一般采用回退策略)。

![deepseek提供的架构图](images/2025/06/09/架构图.png)




