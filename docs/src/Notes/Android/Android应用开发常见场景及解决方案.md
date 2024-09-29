---
title: "Android应用开发常见场景及解决方案"
outline: deep
desc: "开发技巧"
tags: "Android"
updateTime: "2024-09-24 09:40"
---

### Activity/Fragment与ViewModel进行关联
视图中要使用`ViewModel`，需要先获取`ViewModel`实例.
```java
//写法1
private  val viewModel: ChatViewModel by viewModels()
//写法2
private  val viewModel by viewModels<ChatViewModel>()
//写法3
val viewModel: ChatViewModel = ViewModelProvider(this)[ChatViewModel::class.java]
或
val viewModel: ChatViewModel = ViewModelProvider(this).get(ChatViewModel::class.java)
```
以上是没有使用`Hilt`组件的使用方式.如果使用了`Hilt`组件，则使用如下方式获取`ViewModel`实例.
//TODO