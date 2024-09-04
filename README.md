

### 主题说明
[easy-vitepress-blog](https://github.com/ZbWeR/easy-vitepress-blog)

### 搭建本模版遇到的一些问题

1. "vitepress" resolved to an ESM file. ESM file cannot be loaded by `require`

在`.vitepress/config.js`中引入`import { defineConfig } from "vitepress";`报错
"vitepress" resolved to an ESM file. ESM file cannot be loaded by `require`. See https://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.

根据链接.修改`vitepress/config.js`中的`config.js`为`config.mjs`

### 下载依赖慢的问题

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```


