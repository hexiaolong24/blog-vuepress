---
title: js内存
date: 2018-08-20
sidebar: "auto"
categories:
  - JavaScript
tags:
  - JavaScript
---

## 堆 & 栈

## 栈

> 栈又称堆栈，它是一种运算受限的线性表。限定仅在表尾进行插入和删除操作的线性表。

### 误区

- js 内存其实只有一个堆内存，平时我们经常说是栈内存和堆内存，其实栈内存准确的说应该是栈数据结构内存，它只是堆内存的一块分区，他们保存的数据是不一样的

- js 引擎不允许我们直接操作堆内存，访问堆内存要先找到栈内存中对应的变量

### 相同点

- 他们的相同点是都是内存，临时存储

### 不同

- 栈内存空间小，保存变量和基本数据类型的值，栈内存程序执行完就会释放，全局代码（关闭浏览器释放），函数代码（函数执行完就释放

- 堆内存空间相对较大，保存引用数据类型的值，而堆内存是通过垃圾回收机制定期去回收，所以栈内存的空间利用率高，因为释放内存的效率高

### 内存管理三部曲

- 分配内存
- 使用内存
- 释放内存

### 小插曲

- 说一个比较有意思的点，比如我们 var a =1 ,那么这个 a 其实是保存在堆内存中的，一般都会很自然的认为他是存在于栈内存中，原因如下：其实是 window.a = 1，在全局的申明的变量其实都添加到 window 中，window 这个全局变量是保存在栈内存中，而他所指的对象是保存在堆内存中的，那这样说是不是就栈内存中就只有 window 了，其实不是的，预知后事如何，请看执行上下文、作用域相关内容
