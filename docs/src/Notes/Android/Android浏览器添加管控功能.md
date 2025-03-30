---
title: "Android浏览器添加管控功能"
outline: deep
desc: "Android浏览器添加管控功能"
tags: "Android"
updateTime: "2025-03-28"
---

### 需求简介
在学校试点的时候很多学生经常进入浏览器, 浏览一些限制的内容, 希望通过管控的手段, 禁止学生进入浏览器.在系统设置页面可以设置密码或者修改密码、点击浏览器时弹出密码框, 输入正确密码后才可进入浏览器. 若密码错误则提示重新输入或者退出应用. 

### 方案设计
首先我们要找到Launche应用, 然后通过广播接收器拦截启动浏览器的事件, 弹出密码框. 如果密码输入正确, 则允许启动浏览器, 如果密码错误则不允许启动.
同时, 我们还需要提供一个设置页面, 允许用户设置密码或者修改密码.

### 实现步骤
1. 在Launcher应用中实现浏览器拦截功能
目前定位到该文件`packages\apps\Launcher3\src\com\android\launcher3\touch\ItemClickHandler.java`是Launcher3中处理点击事件的核心类. 我们可以在这里拦截浏览器启动的事件, 并弹出密码框.
```java
public static void onClickAppShortcut(View v, WorkspaceItemInfo shortcut, Launcher launcher) {
    if (shortcut.isDisabled() && handleDisabledItemClicked(shortcut, launcher)) {
        return;
    }

    // 检查是否是受限应用
    String packageName = shortcut.getIntent().getComponent() != null
            ? shortcut.getIntent().getComponent().getPackageName()
            : shortcut.getIntent().getPackage();
    
    if (isRestrictedApp(packageName)) {
        verifyDeviceControlPassword(v, shortcut, launcher);
        return;
    }

    startAppShortcutOrInfoActivity(v, shortcut, launcher);
}

private static boolean isRestrictedApp(String packageName) {
    // 使用Set提高查找效率
    Set<String> restrictedApps = new HashSet<>(Arrays.asList(
            "com.android.chrome",
            "com.android.browser",
            "org.mozilla.firefox"
            // 可以从配置文件或数据库动态读取
    ));
    return restrictedApps.contains(packageName);
}

private static void verifyDeviceControlPassword(View v, WorkspaceItemInfo shortcut, Launcher launcher) {
    // 从系统设置获取密码
    String correctPassword = Settings.Secure.getString(
            launcher.getContentResolver(), 
            "device_control_password");
    
    if (TextUtils.isEmpty(correctPassword)) {
        // 如果没有设置密码，直接启动应用
        startAppShortcutOrInfoActivity(v, shortcut, launcher);
        return;
    }

    View dialogView = LayoutInflater.from(launcher).inflate(R.layout.password_dialog, null);
    EditText passwordInput = dialogView.findViewById(R.id.password_input);

    AlertDialog dialog = new AlertDialog.Builder(launcher)
            .setTitle(R.string.device_control_title)
            .setView(dialogView)
            .setPositiveButton(R.string.device_control_confirm, null) // 先设为null，避免自动关闭
            .setNegativeButton(R.string.device_control_cancel, null)
            .create();

    dialog.setOnShowListener(dialogInterface -> {
        Button button = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
        button.setOnClickListener(view -> {
            String password = passwordInput.getText().toString();
            if (correctPassword.equals(password)) {
                dialog.dismiss();
                startAppShortcutOrInfoActivity(v, shortcut, launcher);
            } else {
                passwordInput.setText("");
                Toast.makeText(launcher, 
                    R.string.device_control_wrong_password, 
                    Toast.LENGTH_SHORT).show();
            }
        });
    });

    dialog.show();
}
```
我们还需要创建密码输入框的布局文件-`password_dialog.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp">

    <EditText
        android:id="@+id/password_input"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="请输入密码"
        android:inputType="textPassword" />

</LinearLayout>
```
> 注意对相关的文字进行国际化,这里仅作为演示 `strings.xml`
```xml
<string name="device_control_password_hint">请输入管控密码</string>
<string name="device_control_title">需要验证</string>
<string name="device_control_confirm">确认</string>
<string name="device_control_cancel">取消</string>
<string name="device_control_wrong_password">密码错误</string>
```

2. 在设置页面添加密码设置和修改功能, 可以在系统设置界面添加一个设置项, 允许用户输入密码或者修改密码.
这里我们需要在系统设置界面的1级菜单添加一个设置页面,

`packages/apps/Settings/res/xml/top_level_settings.xml`
在这个文件中，我们可以新增入口:`应用管控`, 然后在这个页面中添加密码设置和修改的入口.
```xml
<!-- ... existing entries ... -->
<com.android.settings.widget.HomepagePreference
    android:fragment="com.android.settings.devicecontrol.DeviceControlPasswordSettings"
    android:icon="@drawable/ic_lock_outline_24dp"
    android:key="device_control_password"
    android:order="-30"
    android:title="@string/device_control_settings_title"
    android:summary="@string/device_control_settings_summary"
    settings:highlightableMenuKey="device_control_password"
    settings:controller="com.android.settings.devicecontrol.DeviceControlSettingsController"/>
<!-- ... existing entries ... -->
```

这里比较重要的就是`fragment`页面和`controller`控制器了
```bash
icon: 设置图标
key: 设置项的唯一标识
order: 设置项的排序
title: 设置项的标题
summary: 设置项的摘要
highlightableMenuKey: 高亮显示的菜单项
controller: 控制器类名
fragment: 对应的Fragment类名
```

然后我们在strings.xml中添加对应的字符串资源
```xml
<resources>
    <!-- ... existing strings ... -->
    <string name="set_device_control_password">设置管控密码</string>
    <string name="verify_device_control_password">验证管控密码</string>
    <string name="enter_password">输入密码</string>
    <string name="confirm_password">确认密码</string>
    <string name="enter_current_password">输入当前密码</string>
    <string name="wrong_password">密码错误</string>
    <string name="password_empty_error">密码不能为空</string>
    <string name="password_mismatch_error">两次输入的密码不一致</string>
    <string name="device_control_password_not_set">未设置密码</string>
    <string name="device_control_password_set">已设置密码</string>
    <!-- ... existing strings ... -->
</resources>
```
创建 Fragment 类-`DeviceControlPasswordSettings.java`：
```java
package com.android.settings.devicecontrol;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.widget.EditText;
import androidx.preference.Preference;
import androidx.preference.PreferenceScreen;
import com.android.settings.R;
import com.android.settings.dashboard.DashboardFragment;

public class DeviceControlPasswordSettings extends DashboardFragment implements
        Preference.OnPreferenceClickListener {
    private static final String TAG = "DeviceControlPasswordSettings";
    private static final String KEY_DEVICE_CONTROL_PASSWORD = "device_control_password";
    private static final String SETTINGS_DEVICE_CONTROL_PASSWORD = "device_control_password";

    private Preference mPasswordPreference;

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        super.onCreatePreferences(savedInstanceState, rootKey);
        mPasswordPreference = findPreference(KEY_DEVICE_CONTROL_PASSWORD);
        if (mPasswordPreference != null) {
            mPasswordPreference.setOnPreferenceClickListener(this);
            updatePasswordSummary();
        }
    }

    @Override
    protected int getPreferenceScreenResId() {
        return R.xml.device_control_password_settings;
    }

    @Override
    protected String getLogTag() {
        return TAG;
    }

    @Override
    public int getMetricsCategory() {
        return SettingsEnums.DEVICE_CONTROL_SETTINGS;
    }

    @Override
    public boolean onPreferenceClick(Preference preference) {
        if (KEY_DEVICE_CONTROL_PASSWORD.equals(preference.getKey())) {
            showPasswordDialog();
            return true;
        }
        return false;
    }

    private void showPasswordDialog() {
        String currentPassword = Settings.Secure.getString(
                getContext().getContentResolver(), SETTINGS_DEVICE_CONTROL_PASSWORD);
        
        if (TextUtils.isEmpty(currentPassword)) {
            showSetPasswordDialog();
        } else {
            showVerifyPasswordDialog();
        }
    }

    private void showSetPasswordDialog() {
        View view = LayoutInflater.from(getContext()).inflate(R.layout.device_control_password_dialog, null);
        EditText passwordEdit = view.findViewById(R.id.password_edit);
        EditText confirmPasswordEdit = view.findViewById(R.id.confirm_password_edit);

        new AlertDialog.Builder(getContext())
                .setTitle(R.string.set_device_control_password)
                .setView(view)
                .setPositiveButton(android.R.string.ok, (dialog, which) -> {
                    String password = passwordEdit.getText().toString();
                    String confirmPassword = confirmPasswordEdit.getText().toString();
                    if (validateNewPassword(password, confirmPassword)) {
                        savePassword(password);
                    }
                })
                .setNegativeButton(android.R.string.cancel, null)
                .show();
    }

    private void showVerifyPasswordDialog() {
        View view = LayoutInflater.from(getContext()).inflate(R.layout.device_control_verify_password_dialog, null);
        EditText passwordEdit = view.findViewById(R.id.password_edit);

        new AlertDialog.Builder(getContext())
                .setTitle(R.string.verify_device_control_password)
                .setView(view)
                .setPositiveButton(android.R.string.ok, (dialog, which) -> {
                    String inputPassword = passwordEdit.getText().toString();
                    if (verifyPassword(inputPassword)) {
                        showSetPasswordDialog();
                    } else {
                        showError(R.string.wrong_password);
                    }
                })
                .setNegativeButton(android.R.string.cancel, null)
                .show();
    }

    private boolean validateNewPassword(String password, String confirmPassword) {
        if (TextUtils.isEmpty(password)) {
            showError(R.string.password_empty_error);
            return false;
        }
        if (!password.equals(confirmPassword)) {
            showError(R.string.password_mismatch_error);
            return false;
        }
        return true;
    }

    private boolean verifyPassword(String password) {
        String savedPassword = Settings.Secure.getString(
                getContext().getContentResolver(), SETTINGS_DEVICE_CONTROL_PASSWORD);
        return !TextUtils.isEmpty(password) && password.equals(savedPassword);
    }

    private void savePassword(String password) {
        Settings.Secure.putString(
                getContext().getContentResolver(), SETTINGS_DEVICE_CONTROL_PASSWORD, password);
        updatePasswordSummary();
    }

    private void updatePasswordSummary() {
        String currentPassword = Settings.Secure.getString(
                getContext().getContentResolver(), SETTINGS_DEVICE_CONTROL_PASSWORD);
        mPasswordPreference.setSummary(TextUtils.isEmpty(currentPassword) 
                ? R.string.device_control_password_not_set
                : R.string.device_control_password_set);
    }

    private void showError(int messageResId) {
        new AlertDialog.Builder(getContext())
                .setMessage(messageResId)
                .setPositiveButton(android.R.string.ok, null)
                .show();
    }
}
```
创建控制器-`DeviceControlSettingsController.java`
```java
package com.android.settings.devicecontrol;

import android.content.Context;
import com.android.settings.core.BasePreferenceController;

public class DeviceControlSettingsController extends BasePreferenceController {
    
    public DeviceControlSettingsController(Context context, String key) {
        super(context, key);
    }

    @Override
    public int getAvailabilityStatus() {
        return AVAILABLE;
    }
}
```

另外我还应该在 `sys\packages\apps\Settings\src\com\android\settings\core\gateway\SettingsGateway.java` 这个文件中的`ENTRY_FRAGMENTS`数组中添加我们的`fragment`, 以便在设置界面显示.(否则系统会报错)
```java
public class SettingsGateway {
    // ... existing code ...
    public static final String[] ENTRY_FRAGMENTS = {
        // ... existing fragments ...
        DeviceControlPasswordSettings.class.getName(),
        // ... existing fragments ...
    };
    // ... existing code ...
}
```

创建设置页面布局：
```xml
<?xml version="1.0" encoding="utf-8"?>
<PreferenceScreen
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:settings="http://schemas.android.com/apk/res-auto"
    android:title="@string/device_control_settings_title">

    <com.android.settings.widget.PasswordEditTextPreference
        android:key="device_control_password"
        android:title="@string/device_control_password_title"
        android:summary="@string/device_control_password_summary"
        settings:controller="com.android.settings.devicecontrol.DeviceControlPasswordController"/>

</PreferenceScreen>
```

### 开搞
我拉了个分支`XIAOXING_TABLET_CONTROL`, 用于测试设备应用管控

1. 环境编译
```
source zmake zprj/FM961L6/CF13/XIAOXING_TABLET_CONTROL userdebug 20
```


### 参考链接
1. [Android 系统进入设置项需要输入密码](https://blog.csdn.net/lancelots/article/details/85064635)
2. [Settings添加1级菜单并实现跳转](https://blog.csdn.net/JiangStare/article/details/119323355)



