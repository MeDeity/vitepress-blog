---
title: "ChromeDriver的使用笔记"
hidden: true
desc: "ChromeDriver的使用笔记"
tags: "PlayTool"
updateTime: "2025-08-26"
---

### 自动下载匹配的ChromeDriver驱动
```python
from selenium.webdriver.chrome.service import Service

class ApkPureScraper:
    """
    ApkPure应用下载爬虫
    """
    def __init__(self, headless=True):
        self.options = webdriver.ChromeOptions()
        if headless:
            self.options.add_argument('--headless')
            self.options.add_argument('--disable-gpu')
        # 自动下载匹配的ChromeDriver驱动
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=self.options)
        # 隐藏自动化特征
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self.driver.execute_script("Object.defineProperty(navigator, 'userAgent', {get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'})")
        self.options.add_experimental_option('useAutomationExtension', False)
        self.options.add_experimental_option('excludeSwitches', ['enable-logging'])

    def scrape_app_info(self,app_url):
        pass
        
    def main():
        scraper = ApkPureScraper(headless=False)
        app_info = scraper.scrape_app_info(app_url="https://apkpure.com/")


if __name__ == "__main__":
    main()
```
其中
```python
service = Service(ChromeDriverManager().install())
self.driver = webdriver.Chrome(service=service, options=self.options)
```
在使用时，需要注意的是，ChromeDriver的版本必须与Chrome浏览器的版本匹配，否则会导致驱动无法正常工作。
可以通过以下方式查看Chrome浏览器的版本：
```python
from selenium import webdriver
driver = webdriver.Chrome()
print(driver.capabilities['browserVersion'])
```
以上代码会自动检测是否有安装ChromeDriver驱动，如果没有会自动下载匹配的驱动。

### 等待元素加载
在使用Selenium进行自动化测试时，经常会遇到需要等待页面元素加载完成的情况。Selenium提供了多种等待元素加载的方法，包括显式等待和隐式等待。

#### 显式等待
显式等待是指在代码中设置一个等待条件，直到该条件满足时才继续执行后续代码。Selenium提供了`WebDriverWait`类来实现显式等待。
```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# 等待元素加载
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "myElement"))
)
# 等待元素可见
element = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, "myElement"))
)
# 等待元素可点击
element = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "myElement"))
)
# 等待元素不存在
element = WebDriverWait(driver, 10).until(
    EC.invisibility_of_element_located((By.ID, "myElement"))
)
# 等待元素文本变化
element = WebDriverWait(driver, 10).until(
    EC.text_to_be_present_in_element((By.ID, "myElement"), "myText")
)
# 等待元素属性变化
element = WebDriverWait(driver, 10).until(
    EC.attribute_to_be((By.ID, "myElement"), "myAttribute", "myValue")
)
# 等待元素属性值包含
element = WebDriverWait(driver, 10).until(
    EC.attribute_contains((By.ID, "myElement"), "myAttribute", "myValue")
)
# 等待元素属性值不包含
element = WebDriverWait(driver, 10).until(
    EC.attribute_does_not_contain((By.ID, "myElement"), "myAttribute", "myValue")
)
# 等待元素属性值变化
element = WebDriverWait(driver, 10).until(
    EC.attribute_to_change((By.ID, "myElement"), "myAttribute")
)
```
以上代码中，`WebDriverWait`类的第一个参数是`driver`，表示要等待的元素所在的浏览器实例；第二个参数是等待的超时时间，单位是秒；第三个参数是等待的条件，这里使用了`expected_conditions`模块中的一些方法，如`presence_of_element_located`、`visibility_of_element_located`、`element_to_be_clickable`等。
在使用显式等待时，需要注意的是，等待的条件必须是一个可调用的函数，返回值为`True`时表示等待条件满足，否则继续等待。如果等待超时，会抛出`TimeoutException`异常。
#### 隐式等待
隐式等待是指在代码中设置一个全局的等待时间，Selenium会在查找元素时等待指定的时间，如果元素没有加载完成，会抛出`NoSuchElementException`异常。
```python
from selenium import webdriver
# 隐式等待10秒
driver.implicitly_wait(10)
```
在使用隐式等待时，需要注意的是，隐式等待是全局的，会影响所有的元素查找操作。如果某个元素需要等待的时间超过了全局的等待时间，会抛出`TimeoutException`异常。
### 元素操作
在使用Selenium进行元素操作时，常用的方法包括查找元素、点击元素、输入文本、获取元素属性等。
#### 查找元素
在Selenium中，查找元素的方法有很多种，常用的包括`find_element_by_id`、`find_element_by_name`、`find_element_by_xpath`、`find_element_by_css_selector`等。
```python
# 查找元素
element = driver.find_element_by_id("myElement")
```
以上代码中，`find_element_by_id`方法用于查找ID为`myElement`的元素。如果元素不存在，会抛出`NoSuchElementException`异常。
#### 点击元素
在Selenium中，点击元素的方法是`click`。
```python
# 点击元素
element.click()
```
以上代码中，`click`方法用于点击元素。如果元素不可点击，会抛出`ElementNotInteractableException`异常。
#### 输入文本
在Selenium中，输入文本的方法是`send_keys`。
```python
# 输入文本
element.send_keys("myText")
```
以上代码中，`send_keys`方法用于输入文本。如果元素不可输入，会抛出`ElementNotInteractableException`异常。
#### 获取元素属性
在Selenium中，获取元素属性的方法是`get_attribute`。
```python
# 获取元素属性
attribute_value = element.get_attribute("myAttribute")
```
以上代码中，`get_attribute`方法用于获取元素的属性值。如果元素不存在，会抛出`NoSuchElementException`异常。
#### 获取元素文本
在Selenium中，获取元素文本的方法是`text`。
```python
# 获取元素文本
element_text = element.text
```
以上代码中，`text`属性用于获取元素的文本内容。如果元素不存在，会抛出`NoSuchElementException`异常。

#### 元素滚动
在使用Selenium进行元素操作时，经常会遇到需要滚动元素到可见区域的情况。Selenium提供了`execute_script`方法来执行JavaScript代码，实现元素滚动。
```python
# 滚动元素到可见区域
driver.execute_script("arguments[0].scrollIntoView();", element)
```

### 一些案例操作

#### 获取网页源码
在使用Selenium进行网页操作时，经常会遇到需要获取网页源码的情况。Selenium提供了`page_source`属性来获取当前页面的HTML源码。
```python
# 获取网页源码
page_source = driver.page_source
# 使用BeautifulSoup解析网页源码
soup = BeautifulSoup(page_source, 'html.parser')
```
以上代码中，`page_source`属性用于获取当前页面的HTML源码。如果获取失败，会抛出`WebDriverException`异常。
> BeautifulSoup是一个Python库，用于从HTML或XML文档中提取数据。它提供了简单而灵活的方法来遍历文档树、搜索元素和提取信息。


#### 获取元素位置
在使用Selenium进行元素操作时，经常会遇到需要获取元素位置的情况。Selenium提供了`location`属性来获取元素的位置信息。
```python
# 获取元素位置
element_location = element.location
```
以上代码中，`location`属性用于获取元素的位置信息。如果获取失败，会抛出`NoSuchElementException`异常。

### 使用BeautifulSoup解析网页源码
在使用Selenium获取到网页源码后，我们可以使用BeautifulSoup库来解析网页源码，提取我们需要的信息。
```python
# 使用BeautifulSoup解析网页源码
soup = BeautifulSoup(page_source, 'html.parser')
app_info = {
    "name": self._get_element_text(soup, ".title_link"),
    "package_name": self._extract_package_name(app_url),
    "version": self._get_element_text(soup, ".version-name"),
    "size": self._get_element_text(soup, ".size"),
    "update_date": self._get_element_text(soup, ".update"),
    "description": self._get_element_text(soup, ".translate-content","应用描述"),

    "additional_info": self._get_element_text(soup, ".whats-new-text","更新描述"),

    "screenshots": self._get_screenshots(soup),
    "icon_url": self._get_icon_url(soup)
}

return app_info
```

#### 通用元素提取方法
在使用BeautifulSoup解析网页源码时，我们可以定义一个通用的元素提取方法，来提取我们需要的元素信息。
```python
def _get_element_text(self, soup, selector, default=""):
    element = soup.select_one(selector)
    if element:
        return element.get_text(strip=True)
    return default
```
以上代码中，`_get_element_text`方法用于提取元素的文本内容。如果元素不存在，会返回默认值。
> 以上代码中，`select_one`方法用于查找第一个匹配的元素，`get_text`方法用于获取元素的文本内容。如果元素不存在，会返回`None`。

#### 根据属性提取元素
在使用BeautifulSoup解析网页源码时，我们可以根据元素的属性来提取元素信息。
```python
def _get_screenshots(self, soup):
    screenshots = []
    gallery = soup.find("div", {"class": "screenbox"})
    if gallery:
        for img in gallery.find_all("img"):
            src = img.get("data-original") or img.get("src")
            if src:
                screenshots.append(src.replace("t.jpg", ".jpg"))
    else:
        print("未找到截图元素....")

    return screenshots
```
> soup.find("div", {"class": "screenbox"}) 中 "class" 是属性名，"screenbox" 是属性值。




























