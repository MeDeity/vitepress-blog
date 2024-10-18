---
title: "Android上JetpackCompose使用笔记"
outline: deep
desc: "JetpackCompose使用笔记"
tags: "Android,JetpackCompose"
updateTime: "2024-09-06 09:40"
---
### JetpackCompose
JetpackCompose在初次使用时,总有一些反常规的用法无法很好的理解,这里记录一下,方便理解使用.

### "= remember" 和 "by remember" 有什么区别？
```kotlin
val isComplete = remember { mutableStateOf(false) }
val isCompleteBy by remember { mutableStateOf(false) }
```
`val isComplete = remember { mutableStateOf(false) }`返回的`isComplete`类型是 `MutableState<Boolean>` 如果要访问`Boolean`类型，需要使用`value`属性 isComplete.value

而 `val isCompleteBy by remember { mutableStateOf(false) }`返回的`isCompleteBy`类型是 `Boolean`

整体上它们是等价的.根据实际情况使用即可



### 参考链接
1. [whats-difference-between-remember-and-by-remember](https://stackoverflow.com/questions/69326413/whats-difference-between-remember-and-by-remember)