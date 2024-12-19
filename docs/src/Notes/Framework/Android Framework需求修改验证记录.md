---
title: "Android Framework需求修改验证记录"
outline: deep
desc: "Android Framework需求修改验证记录"
tags: "Framework"
updateTime: "2025-12-13"
---

### 一、关于device_append.mk的修改如何验证

有些需求需要修改device_append.mk文件中的配置,之前一直以为需要进行提交后，再进行全编验证,可直接在
/device/sprd/mpool/module/generic/app/main.mk
中进行修改,之后执行 source zmk 即可编译验证.

### 二、全编的情况下user/userdebug模式下不会清除客制化版本里面未提交的内容
这个特性可以用于验证Config.mk或者device_append.mk的更改,但是user_ota脚本的指令增加了一个clean_code的命令,会清楚客制化版本未提交的内容

### 三、关于modem及编译工程获取
在 RevisionHistory.txt 文件中可以查看 modem 版本信息
其中 CP0/CP1 指的就是 modem 版本信息
2023-08-22	Modem:		4G_MODEM_22B_W23.28.2_P2_UMS9230_CP0/4G_MODEM_22B_W23.28.2_P2_UMS512_CP0/4G_MODEM_22B_W23.28.2_P2_SC9863_CP0/4G_MODEM_22B_W23.28.2_P2_SC9832E_CP0
比如这串信息是最新的升级记录.根据平台,可以确定当前项目使用的modem是哪个(UMS9230->4G_MODEM_22B_W23.28.2_P2_UMS9230_CP0)
至于项目的编译工程在Config.mk文件中 插卡 MK_FILE_NAME 关键字
MK_FILE_NAME=ums9230_1h10_Natv

### 四、关于铃声资源合入的注意事项
在合入铃声资源时,铃声资源的映射文件最后需要保留一行空行,否则会导致编译失败
frameworks/base/data/sounds/AllAudio.mk

