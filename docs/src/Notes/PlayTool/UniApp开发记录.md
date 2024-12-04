---
title: "UniApp开发记录"
outline: deep
desc: "UniApp开发记录"
tags: "PlayTool"
updateTime: "2024-12-02 10:00"
---

### 添加TabBar
添加TabBar需要在`pages.json`文件中操作,样例如下(请自行确保资源存在)
```json
"tabBar": {
    "color": "#8a8a8a",
    "selectedColor": "#282D49",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
        {
            "pagePath": "pages/spring/index",
            "iconPath": "static/tabbar/countdown.png",
            "selectedIconPath": "static/tabbar/countdown.png",
            "text": "倒计时"
        },
        {
            "pagePath": "pages/spring/blessing",
            "iconPath": "static/tabbar/bless.png",
            "selectedIconPath": "static/tabbar/bless_select.png",
            "text": "祝福语"
        },
        {
            "pagePath": "pages/spring/origin",
            "iconPath": "static/tabbar/origin.png",
            "selectedIconPath": "static/tabbar/origin_select.png",
            "text": "由来"
        }
    ]
}
```
当然,`TabBar`所指向的`pagePath`需要在`pages`中进行定义才可使用

### 微信小程序分享到微信
```vue
<template>
    <view>
        <button class="shareBtn" open-type="share">分享</button>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        onLoad(){
            //设置Menus菜单，使 发送给朋友/分享到朋友圈 两个按钮可以使用
            wx.showShareMenu({
                withShareTicket:true,
                menus:["shareAppMessage","shareTimeline"]
            })
        },
        //发送给微信好友
        onShareAppMessage(res) {
            console.log("分享：from:"+res.from);
            return {
               title: '中学古诗词背诵', //分享的名称
               path: '/pages/index/index',   //页面的路径
            }
        },
       //分享到朋友圈
       onShareTimeline(res) {
            return {
               title: '今天背诵了唐代诗人李白的《夜宿山寺》',
               type: 0,
               path: '/pages/index/index',
               imageUrl: "https://img.lhdtest.com/ware/slider/1908.jpg",
            }
        },

        methods: {

        }
    }
</script>

<style>
    .banner {
        width:100%;
        height:100%;
    }
</style>
```