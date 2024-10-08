---
title: "迁移至Android Jetpack之Android视图绑定"
outline: deep
desc: "迁移至Android Jetpack"
tags: "Android"
updateTime: "2024-09-09 09:40"
---

### 视图绑定简介
视图绑定主要用来替代 findViewById，它能够让开发者在 XML 布局文件中直接访问对应的视图对象。


### 启用视图绑定
在模块的`build.gradle`文件中添加如下配置：
```kotlin
android {
    ...
    buildFeatures {
        viewBinding = true
    }
}
```
如果需要在生成绑定类时忽略某个布局文件,请添加 tools:viewBindingIgnore="true" 属性添加到该布局的根视图文件：
```xml
<LinearLayout
        ...
        tools:viewBindingIgnore="true" >
    ...
</LinearLayout>
```

### 用法
如果为模块启用了视图绑定，系统会为每个模块包含的 XML 布局文件生成一个绑定类,每个绑定类都包含 根视图和具体ID视图的引用.视图名称会自动转变为驼峰命名法。
举个例子.假设有一个名为 `result_profile.xml` 的布局文件，该文件布局如下：
```xml
<LinearLayout ... >
    <TextView android:id="@+id/name" />
    <ImageView android:cropToPadding="true" />
    <Button android:id="@+id/button"
        android:background="@drawable/rounded_button" />
</LinearLayout>
```
所生成的绑定类为 `ResultProfileBinding`，它包含一个根布局视图 `root` 和两个具体 ID 视图引用.

1. 在Activity中使用

如需设置绑定类的实例以与 activity 搭配使用，请执行 请在 activity 的 onCreate() 方法：

调用生成的绑定类中包含的静态 inflate() 方法。 此操作会创建该绑定类的实例以供 Activity 使用。
通过调用 getRoot() 方法或 使用 Kotlin 属性 语法。
将根视图传递给 setContentView() 使其成为屏幕上的活动视图

```kotlin
private lateinit var binding: ResultProfileBinding

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ResultProfileBinding.inflate(layoutInflater)
    val view = binding.root
    setContentView(view)

    // 访问绑定类中的视图
    binding.name.text = viewModel.name
    binding.button.setOnClickListener { viewModel.userClicked() }
}
```

2. 在Fragment中使用
如需设置绑定类的实例与 fragment 搭配使用，请执行下面这个 fragment 的 onCreateView() 方法：

调用生成的绑定类中包含的静态 inflate() 方法。 此操作会创建该绑定类的实例以供 Fragment 使用。
通过调用 getRoot() 方法或 使用 Kotlin 属性 语法。
从 onCreateView() 方法返回根视图，使其成为 Active View

```kotlin
private var _binding: ResultProfileBinding? = null
// This property is only valid between onCreateView and
// onDestroyView.
private val binding get() = _binding!!

override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
): View? {
    _binding = ResultProfileBinding.inflate(inflater, container, false)
    val view = binding.root
    return view
}

override fun onDestroyView() {
    super.onDestroyView()
    _binding = null
}
```




### 参考链接
1. [Android视图绑定](https://developer.android.com/topic/libraries/view-binding?hl=zh-cn#kts)

