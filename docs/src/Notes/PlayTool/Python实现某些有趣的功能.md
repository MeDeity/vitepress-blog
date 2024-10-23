---
title: "Python实现某些有趣的功能"
outline: deep
desc: "Python实现某些有趣的功能"
tags: "PlayTool"
updateTime: "2023-01-01 10:00"
---
### 获取Chrome与ChromeDriver的版本对应信息
[chromedriver官网](https://developer.chrome.com/docs/chromedriver/downloads?hl=zh-cn)显示`ChromeDriver` 提供了[JSON端点](https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json)可用于下载特定 ChromeDriver 版本


### 获取Python安装环境
使用内置的sys模块来获取当前的Python安装环境。以下是一些常用的属性和方法
```python
import sys

# 获取Python解释器的版本信息
python_version = sys.version
# 获取当前Python解释器的可执行文件路径
python_executable = sys.executable
# 获取Python安装路径的前缀
python_prefix = sys.prefix
# 获取Python的模块搜索路径列表
python_paths = sys.path

print(f"Python Version: {python_version}")
print(f"Python Executable: {python_executable}")
print(f"Python Prefix: {python_prefix}")
print(f"Python Paths: {python_paths}")

```
输出结果：
```bash
Python Version: 3.8.18 | packaged by conda-forge | (default, Dec 23 2023, 17:17:17) [MSC v.1929 64 bit (AMD64)]
Python Executable: D:\ProgramData\miniconda3\python.exe
Python Prefix: D:\ProgramData\miniconda3
Python Paths: ['C:\\Users\\Administrator\\Desktop', 'D:\\ProgramData\\miniconda3\\python38.zip', 'D:\\ProgramData\\miniconda3\\DLLs', 'D:\\ProgramData\\miniconda3\\lib', 'D:\\ProgramData\\miniconda3', 'D:\\ProgramData\\miniconda3\\lib\\site-packages', 'D:\\ProgramData\\miniconda3\\lib\\site-packages\\win32', 'D:\\ProgramData\\miniconda3\\lib\\site-packages\\win32\\lib', 'D:\\ProgramData\\miniconda3\\lib\\site-packages\\Pythonwin']  
```

### 下载功能
```python
import requests
from tqdm import tqdm
import sys
import os

def download_file(url, filename):
    # Stream下载模式
    with requests.get(url, stream=True) as r:
        # 获取文件总大小
        total_size_in_bytes = int(r.headers.get('content-length', 0))
        # 使用tqdm显示进度条
        progress_bar = tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True)
        
        # 获取Python安装路径
        python_install_path = sys.prefix
        # 确定保存文件的完整路径
        file_path = os.path.join(python_install_path, filename)
        
        # 打开文件进行写入
        with open(file_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024): 
                # 更新进度条
                progress_bar.update(len(chunk))
                # 写入文件
                f.write(chunk)
        
        # 关闭进度条
        progress_bar.close()
        
        if total_size_in_bytes != 0 and progress_bar.n != total_size_in_bytes:
            print("ERROR, something went wrong")

# 使用示例
file_url = 'http://example.com/somefile.zip'  # 这里替换成你需要下载的文件地址
output_file = 'downloaded_file.zip'  # 下载后保存的文件名
download_file(file_url, output_file)
```

### 获取Chrome版本信息
```python
import winreg
import re

version_re = re.compile(r'^[1-9]\d*\.\d*\.\d*')

def getChromeVersion():
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Google\Chrome\BLBeacon')
        v, type = winreg.QueryValueEx(key, 'version')
        print('Current Chrome Version: {}'.format(v))
        return version_re.findall(v)[0]
    except WindowsError as e:
        print('check Chrome failed: {}'.format(e))

getChromeVersion()
```

### ChromeDriver管理
发现不用那么麻烦,已经有现成的package可以做到`ChromeDriver`的管理

```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_chrome_version():
    # 使用 webdriver_manager 自动下载或更新 ChromeDriver
    service = Service(ChromeDriverManager().install())
    # 初始化 Chrome 浏览器
    browser = webdriver.Chrome(service=service)

    # 获取Chrome浏览器的版本信息
    chrome_version = browser.capabilities['browserVersion']
    print(f"Chrome Version: {chrome_version}")

get_chrome_version()    
```


### 调用AI实现自动翻译
```python
from zhipuai import ZhipuAI

API_KEY = "xxxx" # 请填写您自己的APIKey

def loadZhipuAi(promp="给我讲个有趣的故事吧"):
    client = ZhipuAI(api_key=API_KEY) # 请填写您自己的APIKey
    response = client.chat.completions.create(
        model="glm-4",  # 填写需要调用的模型名称
        messages=[
            {"role": "user", "content": promp},
        ],
        stream=False)
    rep = response.choices[0].message.content
    print(rep)


if __name__ == "__main__":
    loadZhipuAi()
```