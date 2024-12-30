---
title: "本地JAR文件安装到Maven本地仓库"
outline: deep
desc: "本地JAR文件安装到Maven本地仓库"
tags: "SpringBoot,maven"
updateTime: "2024-12-30"
---

### 场景
有些jar包并没有在maven中进行管理,则需要手动安装到本地仓库中,供项目进行使用.

### 如何安装到 Maven 本地仓库

```bash
# 依次是本地jar文件的路径,groupId,artifactId和version等信息
mvn install:install-file -Dfile=path/to/your/local-jar.jar -DgroupId=com.example -DartifactId=local-jar -Dversion=1.0.0 -Dpackaging=jar
```

### 在 pom.xml 中添加依赖
现在可以在项目的 `pom.xml` 文件中添加对本地jar包的依赖了。例如：

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>local-jar</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 后续打包应用就会自动包名含该jar包了。
```bash
mvn clean package
```







