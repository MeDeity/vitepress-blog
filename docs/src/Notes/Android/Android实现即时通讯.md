---
title: "Android实现即时通讯"
outline: deep
desc: "Android实现即时通讯"
tags: "Android,RabbitMQ"
updateTime: "2024-10-12 10:00"
---

### 小插曲
安装webrtc服务时,yum源被我弄出了问题,导致yum源无法使用.不知道怎么排查,只要清掉重新下载
把/etc/yum.repos.d/下面所有的源给删除掉了,重新下载就好了,这里我选择国内阿里云的镜像
```bash
# CentOS 5
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
# CentOS 6
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
# CentOS 7
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# CentOS 7 官方镜像
rpm -Uvh --force http://mirror.centos.org/centos-7/7/os/x86_64/Packages/centos-release-7-4.1708.el7.centos.x86_64.rpm
```
执行命令，重新生成cache
```bash
yum clean all
yum makecache
```


### 参考链接
1. [RabbitMQ实现即时通讯居然如此简单](https://blog.csdn.net/weixin_42907150/article/details/136666041)
2. [android WebRtc 视频通话(P2P)](https://github.com/meshenger-app/meshenger-android)
3. [WebRtc实现音视频通话、屏幕共享流程详解](https://juejin.cn/post/7303160474757742602)
4. [WebRTC入门教程(三) | Android 端如何使用 WebRTC](https://juejin.cn/post/6844903848864120839)
5. [WebRTC--从编译到部署，打造点对点音视频通话服务器](https://www.cnblogs.com/aruba233/p/17163797.html)
6. [webrtc 快速搭建 视频通话 视频会议](https://blog.csdn.net/u011077027/article/details/86225524)
7. [webrtc_android](https://github.com/ddssingsong/webrtc_android)
8. [给centos重新安装yum的base-repo源](https://www.cnblogs.com/sharpest/p/8384768.html)