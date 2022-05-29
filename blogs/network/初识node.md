---
title: 初识Node.js
date: 2019-09-24
sidebar: "auto"
categories:
  - network
tags:
  - Node.js
---

## Module Wrapper Function

Node 中任何一个模块（js 文件）都被一个外层函数所包裹

```js
function (exports, require, module, __filename, __dirname) {}
        //  exports：用于暴露模块
        //  require：用于引入模块
        //  module：用于暴露模块
        //  __filename：当前文件所在的路径（绝对）
        //  __dirname：当前文件所在文件夹的路径（绝对）

```

为什么要有这个外层函数（这个外层函数有什么作用？）

- 隐藏内部实现

- 支持 CommonJs 的模块化

## 对于浏览器端而言，js 由哪几部分组成？

1.  BOM 浏览器对象模型 -------- 很多的 API（location，history）

2.  DOM 文档对象模型 ---------- 很多的 API（对 DOM 的增删改查）

3.  ES 规范 -------------------- ES5、ES6.....

## Node 端 js 由几部分组成？

1.  没有了 BOM ----- 因为服务器不需要（服务端没有浏览器对象）

2.  没有了 DOM ----- 因为没有浏览器窗口

3.  几乎包含了所有的 ES 规范

4.  没有了 window，但是取而代之的是一个叫做 global 的全局变量。

## 场景

- 适用于异步非阻塞任务
- 不适用于 CPU 密集型，如（图像处理）
