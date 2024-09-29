---
title: "🚀 SpringBoot中yml多环境配置"
outline: deep
desc: "SpringBoot中yml多环境配置"
tags: "SpringBoot"
updateTime: "2021-01-25 20:48"
---

### 为什么需要多环境配置
在开发中，我们通常会使用多个环境来运行我们的应用程序。例如，您可能有一个用于本地开发的开发环境，一个用于测试的测试环境和一个用于生产环境的生产环境。
为了方便管理，我们需要将不同的环境配置分开，以便在不同的环境中运行应用程序。加快开发速度，减少部署错误。

### 配置多环境
在SpringBoot中，我们可以使用application.yml文件来配置应用程序。该文件包含所有环境共享的属性，例如数据库连接信息等。
通过配置多个不同的环境，我们可以为每个环境指定不同的属性值。通过运用不同的yaml配置,实现快速切换环境。
```bash
application.yml      主配置文件
application-dev.yml  开发环境配置文件
application-test.yml 测试环境配置文件
application-prod.yml 生产环境配置文件
```
然后在`application.yml`文件中指定要激活的环境：
```yaml
spring:
  profiles:
    active: dev # 激活的配置文件后缀
```
这样，在启动应用程序时，SpringBoot会自动加载`application-dev.yml`文件中的配置信息。如果要切换环境，只需要修改`application.yml`文件中`spring.profiles.active`的值即可。
当所选择的配置文件中和`application.yml`中有相同的配置时,`application.yml`的配置会被覆盖



