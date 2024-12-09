---
title: "SpringBoot在控制台上打印二维码"
outline: deep
desc: "SpringBoot在控制台上打印二维码"
tags: "SpringBoot"
updateTime: "2024-12-09"
---

### ZXING依赖包支持
```xml
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.5.1</version>
</dependency>
```

### 代码实现
```java
package com.falcon.teach.scratchserver.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;


import java.io.Serializable;
import java.util.HashMap;


public class QrCodeUtils {

    public static void printQrCode(String content) {
        int width = 1;
        int height = 1;

        // 定义二维码的参数
        HashMap<EncodeHintType, Serializable> hints = new HashMap<EncodeHintType, java.io.Serializable>();
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");//编码方式
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);//纠错等级

        // 打印二维码
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(content, BarcodeFormat.QR_CODE, width, height, hints);
            for (int j = 0; j < bitMatrix.getHeight(); j++) {
                for (int i = 0; i < bitMatrix.getWidth(); i++) {
                    if (bitMatrix.get(i, j)) {
                        System.out.print("■");
                    } else {
                        System.out.print("  ");
                    }

                }
                System.out.println();
            }
        } catch (WriterException e) {
            // log.info("显示二维码异常:{}",e.getMessage());
        }
    }
}
```

### 参考链接

1. [JAVA生成及解析二维码](https://www.cnblogs.com/qijunhui/p/8284447.html)
2. [Java实现终端/CMD控制窗口输出二维码（以字符方式，非图片）](https://blog.csdn.net/qq_40738764/article/details/130181727)