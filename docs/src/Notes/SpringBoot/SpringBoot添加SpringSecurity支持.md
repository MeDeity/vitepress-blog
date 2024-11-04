---
title: "🚀 SpringBoot添加SpringSecurity支持"
outline: deep
desc: "SpringBoot添加SpringSecurity支持"
tags: "SpringBoot"
updateTime: "2024-11-04 10:00"
---

### 添加依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 默认登录
项目运行时会生成默认密码,默认用户名就是`user`
![生成默认密码](images\2024\11\04\SpringBoot添加SpringSecurity支持01.png)
验证通过了就进入主页了

>需要特别注意的是,maven首次下载时,最好也添加下镜像配置
在maven中的`settings.xml`文件中增加镜像配置
```xml
<mirror>  
    <id>alimaven</id>  
    <name>aliyun maven</name>  
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>  
    <mirrorOf>central</mirrorOf>          
</mirror>
```

