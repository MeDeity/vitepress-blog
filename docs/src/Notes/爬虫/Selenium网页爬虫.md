---
title: "Selenium网页爬虫"
outline: deep
desc: "调试技巧"
tags: "爬虫"
updateTime: "2024-09-19 09:40"
---

### ChromeDriver配置
`ChromeDriver`一般放在`Python`安装目录下的`Scripts`文件夹中,并且`ChromeDriver`版本需要跟`Chrome`版本对应,否则会报错.
一般情况下,我们在搭建爬虫开发环境时,都逃不过这步配置,相当繁琐.本篇文章的目的是尝试使用python脚本自动配置这个环境,省去手动配置的麻烦.

### 实现思路
我们假设`Chrome`是存在的，如果不存在,则下载对应版本的`Chrome`,并安装到默认路径.
1. 获取`Chrome`安装路径,并获取`Chrome`的版本号;
2. 获取`ChromeDriver`安装路径,并判断是否为空;
3. 如果`ChromeDriver`存在并且版本号跟chrome对应的版本号一致,则跳过配置;
4. 如果存在但是版本号跟chrome对应的版本号不一致,则下载对应版本的`ChromeDriver`;
5. 如果不存在,则下载对应版本的`ChromeDriver`.并放置到`Python`安装目录下的`Scripts`文件夹中.
