---
title: setState
date: 2020-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## 同步还是异步

## 首先完全可以不依赖这个特性

- class 组件中可以在 componentDidmount 中执行
- function 组件可以在 useEffect 的回调函数中执行

## legacy 模式

- ReactDOM.render

- 批处理异步更新
- 上下文环境没有批处理标识（放在 setTimeout 中）,就会同步更新

## blocking 模式

## concurrent 模式

- ReactDOM.creatRoot
- 批处理异步更新
- 上下文环境没有批处理标识（放在 setTimeout 中）,依然会异 步更新
