---
title: "🚀 SpringBoot接口的多实现"
outline: deep
desc: "SpringBoot接口的多实现"
tags: "SpringBoot"
updateTime: "2024-11-04 10:00"
---
### 接口的多实现需求
在准备实现一个AI服务时,需要对接不同TTS实现,比如微软的TTS、百度TTS、讯飞TTS等,这时候就涉及到了接口的多实现

我们先定义一个接口,然后定义不同的实现类
```java
public interface TtsService {
    /** 语音合成并返回语音文件的url地址 */
    String speak(String text);
}

@Service
public interface MsTtsServiceImpl implements TtsService {
    /** 语音合成并返回语音文件的url地址 */
    String speak(String text){
        return "https://www.microsoft.com";
    }
}

@Service
public interface BdTtsServiceImpl implements TtsService {
    /** 语音合成并返回语音文件的url地址 */
    String speak(String text){
        return "https://www.baidu.com";
    }
}
```
当我们在Controller中调用的时候,我们就可以根据不同的需求选择不同的实现类
```java
public class TtsController{
    
    private TtsService ttsService;

    @Autowired
    public TtsController(TtsService ttsService) {
        this.ttsService = ttsService;
    }
    @RequestMapping("/test")
    public String test(){
        return ttsService.speak("你好");
    }
}
```
以上的代码实际上SpringBoot无法知道应该注入哪个实现类,需要我们进行干预,比较简单的一种方式是指定默认的实现类
```java
@Service
@Primary
public interface MsTtsServiceImpl implements TtsService {
    /** 语音合成并返回语音文件的url地址 */
    String speak(String text){
        return "https://www.microsoft.com";
    }
}
```
通过添加`@Primary`注解,SpringBoot就会默认注入这个实现类,这样就可以正常调用,但这种方式是硬编码,如果需要切换实现类,就需要修改代码
除了使用`@Primary`注解指定默认的实现类外,使用`@Resource`注解可以使用`name`属性指定要注入的类名,Spring框架在使用`@Component`、`@Service`等注解时,会默认将类名首字母小写作为bean的名称
```java
//方式1
@Resource(name = "msTtsServiceImpl")
private TtsService ttsService;  
//方式2(但更推荐上面方式1)
@Resource
private TtsService msTtsServiceImpl;
```
还可以使用`@Qualifier`注解指定要注入的bean名称
```java
@Autowired
@Qualifier("msTtsServiceImpl")
private TtsService ttsService;
```
以上三种方式都可以实现接口的多实现,可以根据自己的喜好进行选择,但是都是硬编码,如果需要切换实现类,就需要修改代码,结合yml配置文件进行切换,可以参考下面的方式
```yml
# yml配置文件
tts:
    type: ms
```
```java

@Service
@ConditionalOnProperty(value="tts.type",havingValue = "ms")
public interface MsTtsServiceImpl implements TtsService {
    /** 语音合成并返回语音文件的url地址 */
    String speak(String text){
        return "https://www.microsoft.com";
    }
}
```
以上,我们添加了`@ConditionalOnProperty(value="tts.type",havingValue = "ms")`当`tts.type=ms`时,才会注入这个实现类,这样就可以实现通过修改yml配置动态切换实现类了

### 参考链接
1. [spring接口多实现类，选择性注入的4种解决方案](https://juejin.cn/post/7134940044179013668)