---
title: js中的this
date: 2018-09-05
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
- 前端
---

##  本质

- this本质是一个内置的引用变量，也是js中的一个关键字

##  使用场景

1. 正常情况：执行函数的方式决定了函数的this

- 直接调用：fn()-----window
- 方法调用：obj.fn()-----obj对象
- new 调用：new fn()-----新创建的对象
- call/apply/bind调用：fn.call(obj)-----第一个参数指定的对象

2. 特殊情况

- 箭头函数：使用的是定义时外部函数的this，没有自己的this，如果没有外部函数返回window
- 回调函数：
  - 定时器回调/ajax回调/数组遍历相关方法的回调：window
  - dom事件监听回调：dom元素
  - 组件生命周期回调：组件对象

3. 日常我们经常用箭头函数和bind的方法来改变this的指向
