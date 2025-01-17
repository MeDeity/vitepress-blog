---
title: "Android高仿微信"
outline: deep
desc: "Android高仿微信"
tags: "Android,项目实战"
updateTime: "2024-10-08 10:00"
---

### MVI 架构模式

### ViewModel 的作用

### 获取ViewModel实例
有多种方式可以获取到ViewModel实例,下面是一些常见的方法:
1. 使用 by viewModels() 委托属性
这是最简单的方法，适用于不需要传递参数给 ViewModel 构造函数的情况。
```kotlin
val viewModel: MyViewModel by viewModels()
```
> viewModels() 是一个扩展函数，它默认调用 ViewModelProvider.NewInstanceFactory 来查找或者创建指定的 ViewModel 类型的 ViewModel 的实例

2. 使用 ViewModelProvider 创建
```kotlin
val viewModel: MyViewModel = ViewModelProvider(this).get(MyViewModel::class.java)
```

3. 使用Hilt
如果你正在使用 Hilt 作为依赖注入库，你需要添加 Hilt 依赖并在应用模块中启用 Hilt.
```gradle
// build.gradle
dependencies {
    implementation "androidx.hilt:hilt-lifecycle-viewmodel:1.0.0-alpha03"
    kapt "androidx.hilt:hilt-compiler:1.0.0-alpha03"
    // 其他依赖项...
}
```

```kotlin
import javax.inject.Inject
import androidx.lifecycle.ViewModel

@HiltViewModel
class MyViewModel @Inject constructor() : ViewModel() {
    // ViewModel 的实现
}

// 在 Fragment 或 Activity 中使用
private val viewModel: MyViewModel by viewModels()
```


### Data Persistence 数据持久化
Room 是目前 Android 推荐的数据库工具


### Android开发 Jetpack Compose 与xml的混合开发AndroidView
虽然jetpack compose 在逐渐完善,
1. 但极少数 View 暂时还没有 Compose 版本，比如 MapView, WebView、
2. 有之前写好的UI想直接拿过来用
3. 初学者用 Compose 实现不了想要的效果，先用 View
这时候就需要用到AndroidView这个组件了.

### Jetpack Compose 状态管理

创建`State`对象的方法
```kotlin
import androidx.compose.runtime.mutableStateOf

val state = remember { mutableStateOf(0) }
```
这个`remember`方法确保了在整个 Composable 函数调用期间`state`对象的状态不会被重置。
```kotlin
/**
 * Remember the value produced by [calculation]. [calculation] will only be evaluated during the composition.
 * Recomposition will always return the value produced by composition.
 */
@Composable
inline fun <T> remember(crossinline calculation: @DisallowComposableCalls () -> T): T =
    currentComposer.cache(false, calculation)
```
> 注意：`remember` 函数会对包裹的变量值进行缓存,后续发生重组时会返回缓存的值、不会重新初始化

上面创建的`state`对象,其类型是`MutableState`,使用时需要通过`state.value`来访问其值.借助于 Kotlin 委托语法

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableStateOf

var state by remember { mutableStateOf(0) }
```
使用委托语法创建的对象是`MutableState`包装的对象类型,这里我们初始化时传的是`0`,根据类型推导`state`是Int类型的数据，这样使用的时候我们直接写`state`就能拿到值了,
另外由于`state`可变,因此需要使用`var`将其声明为可变类型对象

> TODO Kotlin 委托语法

### rememberSaveable
使用`remember`虽然可以解决重组过程中状态被重复初始化的问题,但是当Activity发生重建时,比如旋转屏幕，`state.value`的值会被重置为初始值。
针对这种场景,Compose 提供了`rememberSaveable`函数来解决这个问题
```kotlin
var state by rememberSaveable { mutableStateOf(0) }
```
这种写法在横竖屏旋转等场景中，仍能够对其包裹的数据进行缓存,避免了数据丢失的问题。代价就是性能相对`remember`要差一些。因此是否需要使用`rememberSaveable`,需要根据实际场景进行选择。

### Composable 的副作用
Composable在重组的过程中可能会执行多次，如果在Composable中执行了比如网络请求、数据库查询等,那么在每次重组时都需要重新执行这些操作。这显然是不合理的。Compose 提供了一系列`Effect`函数(国内翻译成副作用)，来确保行为的可预期性,比如`LaunchedEffect`, `DisposableEffect`,`SideEffect`等

1. SideEffect -在每次成功重组的时候都会执行
Composable 在重组过程中可能会反复执行，并且重组不一定每次都会成功，有的可能会被中断，中途失败。 SideEffect 仅在重组成功的时候才会执行

2. DisposableEffect - 预处理和收尾
DisposableEffect 可以感知 Composable 的 onActive 和 onDispose, 允许使用该函数完成一些预处理和收尾工作。典型使用场景就是 注册和注销事件监听器
```kotlin
//当 keys 变化时， DisposableEffect 会重新执行，如果在整个生命周期内，只想执行一次，则可以传入 Unit
DisposableEffect(vararg keys: Any?) {
    // register(callback)
    onDispose {
        // unregister(callback)  onDispose 代码块则会在 Composable 进入 onDispose 时执行
    }
}
```

3. LaunchedEffect - 在 Composable 中启动协程
LaunchedEffect 用于在 Composable 中启动协程，当 Composable 进入 onAtive 时，LaunchedEffect 会自动启动协程，执行 block 中的代码。当 Composable 进入 onDispose 时，协程会自动取消。

```kotlin
// 当 keys 变化时，LaunchedEffect 会重新执行。如果在整个生命周期内只想执行一次，则可以传入 Unit
LaunchedEffect(vararg keys: Any?) {
    // do Something async
}
```

4. rememberCoroutineScope - 在非 Composable 环境中使用协程
LaunchedEffect 只能在 Composable 中调用，如果想在非 Composable 环境中使用协程，比如在 Button 的 OnClick 中开启协程，并希望在 Composable 进入 onDispose 时自动取消，则可以使用 rememberCoroutineScope
```kotlin
@Composable
fun Test() {
    val scope = rememberCoroutineScope()
    Button(
        onClick = {
            scope.launch {
                // do something
            }
        }
    ) {
        Text("click me")
    }
}
```


### 参考链接
1. [Jetpack Compose版来啦！高仿微信朋友圈大图缩放、切换、预览功能](https://juejin.cn/post/7091206855153877000/)
2. [ComposeWechat](https://github.com/ChaoqinLiu/ComposeWechat)
3. [高仿微信图库](https://github.com/ThirdPrince/VanGogh)
4. [jetpack compose 组件库](https://github.com/D10NGYANG/DLJetpackComposeUtil)
5. [一款基于Jetpack Compose开发的图片浏览库](https://github.com/jvziyaoyao/scale)
6. [深入理解 Compose Navigation 实现原理](https://www.mdnice.com/writing/902163c0d8fa455eba52505aa883d461)
7. [Android开发 Jetpack Compose 与xml的混合开发AndroidView](https://www.cnblogs.com/guanxinjing/p/17607554.html)
8. [在 Compose 中使用 View](https://developer.android.google.cn/develop/ui/compose/migrate/interoperability-apis/views-in-compose?hl=zh-cn)
9. [Jetpack Compose系列](https://www.cnblogs.com/joy99/p/18035950)
10. [语音条](https://github.com/GitLqr/LQRAudioRecord)
11. [Kotlin高仿微信-第11篇-单聊-语音](https://blog.csdn.net/maoning20080808/article/details/128109017)