---
title: instanceof
date: 2019-08-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - 自定义函数库
---

```js
function _new(fn, ...args) {
  // 实例对象的隐式对象为函数的原型对象
  let obj = Object.create(fn.prototype)
  // 将函数的this指向实例调用对象 并调用对象
  let res = fn.call(obj,...args)
  return res instanceof Object ? res : obj
  // 如果函数本身不返回object，则返回实例对象
}
```