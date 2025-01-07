---
title: "SpringBoot Redis配置相关(Window)"
outline: deep
desc: "SpringBoot Redis配置相关(Window)"
tags: "Redis"
updateTime: "2025-01-07"
---
### 设置密码
由于安全性要求,不设置密码的情况下,很容易遭遇攻击,尚未设置密码的情况下在Redis目录下使用
```bash
redis-server redis.windows.conf
```
启动Redis服务

### 设置临时密码
```bash
# 查看密码
config get requirepass
# 设置临时密码
config set requirepass 123456
# 验证密码
auth 123456
```
> 临时密码,顾名思义就是重启服务后被擦除

### 设置永久密码
`redis.windows-service.conf`和`redis.windows.conf`都需要设置
```bash
# 密码演示用,生产环境上请使用更加复杂的密码
requirepass 123456
```




