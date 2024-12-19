---
title: "Android 权限申请"
outline: deep
desc: "Android 权限申请"
tags: "Android"
updateTime: "2024-12-19"
---

### Jetpack Compose 版本的权限申请


```java

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InCallView(
    navCtrl: NavHostController,
    modifier: Modifier = Modifier,
    viewModel: InCallViewModel = hiltViewModel()
) {

    val permissionState = remember {  mutableStateOf(emptyMap<String, Boolean>()) }
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions(),
        onResult = { permissions  ->
            // 更新权限状态
            permissionState.value = permissions
            // 检查录音和相机权限是否被授予
            val isAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
            val isCameraGranted = permissions[Manifest.permission.CAMERA] ?: false

            viewModel.dispatch(InCallViewAction.RequestPermission(
                isGranted = isAudioGranted && isCameraGranted,
                permission = listOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA)
            ))
        }
    )

    LaunchedEffect(key1 = permissionState.value) {
        // 检查录音和相机权限是否都被授予
        val isAudioGranted = permissionState.value[Manifest.permission.RECORD_AUDIO] ?: false
        val isCameraGranted = permissionState.value[Manifest.permission.CAMERA] ?: false
        if (isAudioGranted && isCameraGranted) {
            viewModel.dispatch(InCallViewAction.Init(context = context))
        } else if (!isAudioGranted || !isCameraGranted) {
            // 如果权限没有被授予，则请求权限
            permissionLauncher.launch(arrayOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA))
        }
    }
    LaunchedEffect(Unit) {
        permissionLauncher.launch(arrayOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA))
    }

}
```
