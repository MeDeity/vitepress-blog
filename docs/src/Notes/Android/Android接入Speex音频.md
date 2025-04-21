---
title: "Android接入Speex音频"
outline: deep
desc: "Android接入Speex音频"
tags: "Android,Speex"
updateTime: "2025-04-14"
---

#### Speex介绍


#### 编译Speex相关SO库文件
1. 从[官网](https://www.speex.org/downloads/)或者[Git仓库](https://github.com/xiph/speex)上下载,(因为官网可能下载不了啊!!!)

2. 将源码解压,并将include、libspeex文件夹复制到自己新建工程的jni目录下
TODO : 这里最好配图

3. 新增Android.mk文件,添加Speex库的编译信息
```mk
LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE    := libspeex
LOCAL_CFLAGS = -DFIXED_POINT -DUSE_KISS_FFT -DEXPORT="" -UHAVE_CONFIG_H
LOCAL_C_INCLUDES := $(LOCAL_PATH)/include

#LOCAL_SRC_FILES :=
LOCAL_SRC_FILES :=speex_jni.cpp \
        ./libspeex/bits.c \
        ./libspeex/cb_search.c \
        ./libspeex/exc_10_16_table.c \
        ./libspeex/exc_10_32_table.c \
        ./libspeex/exc_20_32_table.c \
        ./libspeex/exc_5_256_table.c \
        ./libspeex/exc_5_64_table.c \
        ./libspeex/exc_8_128_table.c \
        ./libspeex/filters.c \
        ./libspeex/gain_table_lbr.c \
        ./libspeex/gain_table.c \
        ./libspeex/hexc_10_32_table.c \
        ./libspeex/hexc_table.c \
        ./libspeex/high_lsp_tables.c \
        ./libspeex/kiss_fft.c \
        ./libspeex/kiss_fftr.c \
        ./libspeex/lpc.c \
        ./libspeex/lsp_tables_nb.c \
        ./libspeex/lsp.c \
        ./libspeex/ltp.c \
        ./libspeex/modes_wb.c \
        ./libspeex/modes.c \
        ./libspeex/nb_celp.c \
        ./libspeex/quant_lsp.c \
        ./libspeex/sb_celp.c \
        ./libspeex/smallft.c \
        ./libspeex/speex_callbacks.c \
        ./libspeex/speex_header.c \
        ./libspeex/speex.c \
        ./libspeex/stereo.c \
        ./libspeex/vbr.c \
        ./libspeex/vorbis_psy.c \
        ./libspeex/vq.c \
        ./libspeex/window.c \

include $(BUILD_SHARED_LIBRARY)
```

4.新增 `Application.mk` 打所有架构的`so`库文件
```mk
APP_ABI := all
```
此时应该可以执行`ndk-build`指令了,执行该命令会在`libs`目录下生成对应架构的`so`库文件了。
![so库生成路径](images/2025/04/18/so库生成路径.png)
这里需要特别注意下,`Android`中默认的`so`库加载路径是在`src/main/jniLibs`目录下,若将`so`库放置于其他目录下，需在`build.gradle`文件中配置`jniLibs`目录路径。
```gradle
main {
   // 指定自定义 SO 库路径（若未使用默认 jniLibs 目录）
   jniLibs.srcDirs = ['libs']
}
```



#### 参考链接
1. [speex编译](https://www.cnblogs.com/mingfeng002/p/7800439.html)
