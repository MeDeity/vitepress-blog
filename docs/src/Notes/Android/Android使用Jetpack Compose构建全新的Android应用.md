---
title: "Android使用Jetpack Compose构建全新的Android应用"
outline: deep
desc: "Android使用Jetpack Compose构建全新的Android应用"
tags: "Android"
updateTime: "2025-02-24"
---

### Jetpack Compose 的优势
   传统的Android View 体系是一种命令式UI,开发人员需要手动操作UI组件的状态,
典型的应用就是通过`findViewById`拿到控件的实例,再调用`setText()`、`setVisibility()` 等方法直接修改UI。
   在使用上，传统的Android View 体系采用xml进行界面布局,通过java/kotlin加载布局进行逻辑控制,
编写方式相对原始;UI状态与数据源容易不同步，需手动保证一致性;频繁操作视图易引发过度绘制或布局嵌套问题,存在性能隐患。
   Jetpack Compose是一种现代化的声明式UI,开发者通过搭积木的方式使用组合函数构建好最终的UI形态,
Jetpack Compose框架会自动处理状态变化后的更新(简化了传统View的数据源同步问题),当数据发生变化后，框架会触发重组，仅更新受影响的部分(优化了传统View体系的性能隐患),除此之外

   1. Jetpack Compose 完全使用kotlin编写UI,告别了xml与java/kotlin的双重维护
   2. 组合优于继承，使用简单的函数组合构建复杂的UI，无需多层继承或者重写
   3. @Preview 在Android Studio中实时预览组件效果
   4. 可在Compose中嵌入传统View组件（如 AndroidView），支持渐进式迁移,同时Compose未来将支持跨平台（如 Compose Multiplatform），减少多平台UI开发成本(无缝兼容过去,未来无限)

### Compose 使用基础
   我们这里使用一个简单的示例来演示下Jetpack Compose在构建UI上的使用场景
   ![一张聊天列表页面](https://www.baidu.com)
   要实现这样的一张UI图片,需要怎么做

### 导航与多页面
   一个应用是由很多页面组成的,传统的View体系一般是通过`startActivity`实现页面的跳转,
在Jetpack Compose中也有对应的库来实现页面的跳转,
在项目的 build.gradle (Module级别) 中添加依赖：
```gradle
dependencies {
    implementation "androidx.navigation:navigation-compose:2.7.7"  // 使用最新版本
}
```
