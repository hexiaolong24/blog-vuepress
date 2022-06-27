---
title: yarn全局安装不生效
date: 2022-06-27
sidebar: "auto"
categories:
  - others
tags:
  - 前端
---

## yarn 全局安装不生效

- yarn global add xxx
- 仍提示 xxx not found

1.  查找 yarn global 安装目录

```sh
yarn global dir
```

- 得到

```sh
/Users/username/.config/yarn/global/node_modules/.bin
```

2.  修改配置文件

- ~/.bash_profile（bash） 或 ~/.zshrc（zsh）

```sh
vim ~/.bash_profile
# 添加一行
export PATH="$PATH:/Users/usernameXXX/.config/yarn/global/node_modules/.bin"
```

3.  保存之后执行

```sh
source ~/.bash_profile
```

4.  重启终端查看是否生效

## 每次 git 操作需要输入密码
