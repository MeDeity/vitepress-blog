---
title: "Jenkins实现Vue项目自动化部署"
outline: deep
desc: "Jenkins实现Vue项目自动化部署"
tags: "Jenkins,Vue"
updateTime: "2025-01-17"
---
### 安装NodeJs插件
Vue项目自动化部署需要确保Jenkins服务器上安装了NodeJs插件，否则无法执行npm命令。
在插件管理页面搜索NodeJs插件，并安装。安装后会出现在已安装的插件列表中。如下图所示

![nodejs插件安装](images/2025/01/17/nodejs插件安装.png)

### 安装Publish Over SSH插件
这个组件主要是将构建好的项目发布到远程服务器上。

![Publish Over SSH插件](images/2025/01/17/PublishOverSSH插件.png)

### 安装Git插件
由于我们的代码一般托管在Git上，所以需要安装Git插件来访问代码仓库

![Git插件](images/2025/01/17/Git插件.png)


### 配置插件

![配置工具入口](images/2025/01/17/配置工具入口.png)

1. 配置NodeJs插件
上面我们已经安装了NodeJs插件，NodeJs插件辅助jenkins对NodeJs进行调用。如果之前没有安装过NodeJs,则需要先安装NodeJs.

![node版本安装](images/2025/01/17/node版本安装.png)

2. 配置SSH插件

设置远程服务器的信息,其中Romete Directory指的是默认上传的根目录,一般推荐直接写为`/`,这样上传的文件就会出现在远程服务器的根目录下。

![设置远程服务器的信息](images/2025/01/17/远程服务器的信息.png)

设置SSH密钥,用于Jenkins服务器与远程服务器的免密登录。

![Alt text](images/2025/01/17/ssh插件密钥设置.png)

### 自动化任务构建
Jenkins为各种任务的构建提供了模版,这里我们选择一个自由风格的项目进行构建
![Alt text](image.png)

### 参考链接
1. [Jenkins自动打包部署VUE项目](https://blog.csdn.net/qq_41085087/article/details/143161461)
