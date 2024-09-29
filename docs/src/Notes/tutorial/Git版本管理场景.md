---
title: "🚀 Git版本管理场景"
outline: deep
desc: "Git版本使用指南"
tags: "Git"
updateTime: "2024-09-25 20:48"
---

### Git项目远程地址发生变更了
常见的操作是项目的所有权发生了转移,导致本地仓库的远程地址发生了变更,这个时候需要修改远程地址
```bash
# 查看当前的远程地址
git remote -v
# 修改远程地址
git remote set-url origin <EMAIL>:xxx/xx.git
```
