---
title: "Android Framework展锐项目解锁"
outline: deep
desc: "Android Framework展锐项目解锁"
tags: "Android Framework"
updateTime: "2025-03-31"
---
#### 解锁展锐项目
[展锐解锁工具](https://github.com/MeDeity/AndroidFrameworkTools/tree/master/SprdUnlock)放在Github上,下载后解压，里面有解锁脚本和解锁工具


找到项目中的  /bsp/tools/secureboot_key/config/目录下的rsa4096_vbmeta.pem文件
![rsa4096_vbmeta.pem](images/2025/03/31/rsa4096_vbmeta目录位置.png)

复制到AndroidRUnlockTool的unlock目录下
![rsa4096_vbmeta替换位置](images/2025/03/31/rsa4096_vbmeta替换位置.png)

将unlock.sh文件中 "rasFile=XXXX" 替换成复制进来的文件名。
![资源文件名称替换](images/2025/03/31/资源文件名称替换.png)

最后，双击运行unlock.bat即可（这一步手机不需要关机）
![执行脚本](images/2025/03/31/执行脚本.png)

出现这个时根据手机提示，按手机音量键，+或者-，进行操作
![确认解锁](images/2025/03/31/确认解锁.png)

即可解锁成功
![解锁成功](images/2025/03/31/解锁成功.png)