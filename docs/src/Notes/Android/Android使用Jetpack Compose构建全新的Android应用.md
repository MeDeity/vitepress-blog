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
   1. 编写方式相对原始,更改UI可能需要同时修改xml或者java/kotlin;
   2. UI状态与数据源容易不同步，需手动保证一致性;
   3. 频繁操作视图易引发过度绘制或布局嵌套问题,存在性能隐患。

   Jetpack Compose是一种现代化的声明式UI,开发者通过搭积木的方式使用组合函数构建好最终的UI形态,
Jetpack Compose框架会自动处理状态变化后的更新(简化了传统View的数据源同步问题),当数据发生变化后，框架会触发重组，仅更新受影响的部分(优化了传统View体系的性能隐患),除此之外

   1. Jetpack Compose 完全使用kotlin编写UI,告别了xml与java/kotlin的双重维护
   2. 组合优于继承，使用简单的函数组合构建复杂的UI，无需多层继承或者重写
   3. @Preview 在Android Studio中实时预览组件效果
   4. 可在Compose中嵌入传统View组件（如 AndroidView），支持渐进式迁移,同时Compose未来将支持跨平台（如 Compose Multiplatform），减少多平台UI开发成本(无缝兼容过去,未来无限)

### Jetpack Compose 使用基础
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
这个导航库有三个关键的核心组件
1. NavController：管理导航逻辑和返回栈
2. NavHost：容器，用于承载不同页面（Composable函数）
3. NavGraph：定义页面间的导航关系

### 结合ViewModel进行状态管理
Composable 函数仅负责渲染 UI,而ViewModel 负责管理业务逻辑和 UI 无关的状态，一般采用Hilt注入框架避免`ViewModel`直接实例化,

在使用ViewModel需要引入
```gradle
implementation "androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0"  // 最新版本
```
获取ViewModel实例的几种方式
1. 直接通过 viewModel() 函数获取（需 Compose 环境）：
```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel = viewModel()) {
    // 使用 viewModel 中的状态和方法
}
```
2. 通过 Activity/Fragment 传递 ViewModel（适合跨组件共享）：
```kotlin
// 在 Activity 中初始化
val viewModel: MyViewModel by viewModels()
setContent { MyScreen(viewModel) }
```

3. 依赖注入：使用 Hilt 或 Koin 实现 ViewModel 的依赖注入（提高可测试性）
以下是一个ViewModel定义
```kotlin
@HiltViewModel
class MyViewModel @Inject constructor() : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val data = fetchDataFromNetwork()
                _uiState.value = UiState.Success(data)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message)
            }
        }
    }

    /**逻辑状态 */
    sealed class UiState {
        object Loading : UiState()
        data class Success(val data: String) : UiState()
        data class Error(val message: String?) : UiState()
    }
}
```
在这个`ViewModel`中,我们定义了逻辑所需的状态`UiState`,`MutableStateFlow`是 Kotlin 协程中的 热流（Hot Flow），始终持有最新的状态值,通过 `asStateFlow()` 转换为只读的 StateFlow，防止外部直接修改状态
当`_uiState`的数据发生变化时,对外暴露的`uiState`会立即通知所有活跃的收集者`Collector`,而`collectAsState()`会将`Flow`转化为`Compose`所需的`State`,当Flow发出新值,State会更新，从而触发组件重组

```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel = hiltViewModel()) { 
    val uiState by viewModel.uiState.collectAsState()

    when (val state = uiState) {
        is UiState.Loading -> {
            // 显示加载动画
            CircularProgressIndicator()
        }
        is UiState.Success -> {
            // 显示数据
            Text("Data: ${state.data}")
        }
        is UiState.Error -> {
            // 显示错误信息，并提供重试按钮
            Column {
                Text("Error: ${state.message}")
                Button(onClick = { viewModel.loadData() }) {
                    Text("Retry")
                }
            }
        }
    }
}
```

### 参考链接
1. [Android 全新的 UI 框架](https://www.cnblogs.com/joy99/p/18035909)
2. [Android 上的 Kotlin 协程](https://developer.android.google.cn/kotlin/coroutines?hl=zh-cn)