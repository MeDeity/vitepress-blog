---
title: "安装MinIO实现本地存储笔记"
outline: deep
desc: "安装MinIO实现本地存储笔记"
tags: "运维笔记,MinIO,本地存储"
updateTime: "2025-05-07"
---

### Centos安装MinIO(普通安装)
```bash
# 下载MinIO安装包
wget https://dl.minio.io/server/minio/release/linux-amd64/minio
# 赋予执行权限
chmod +x minio
# 启动MinIO服务
./minio server  /opt/minio/data/
```


