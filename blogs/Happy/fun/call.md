---
title: call apply bind
date: 2019-08-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - 自定义函数库
---

### call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
```js
Function.prototype.myCall = function(obj) {
  obj = obj ? Object(obj) : window;
  // this是实例对象，即调用call方法的函数自身
  obj.fn = this;
  let result
  if(arguments[1]){
    let args = [...arguments].slice(1);
    result = obj.fn(...args);
  }else {
    result = obj.fn();
  }
  delete obj.fn;
  return result;
}
```

### apply
```js
Function.prototype.myApply = function(obj) {
  obj = obj ? Object(obj) : window;
  obj.fn = this;
  let result
  if(arguments[1]){
    result = obj.fn(...arguments[1])
  }else {
    result = obj.fn()
  }
  delete obj.fn;
  return result;
}
```

### bind
```js
Function.prototype.myBind = function(obj) {
  obj = obj ? Object(obj) : window;
  let fn = this
  let args = Array.prototype.slice.call(arguments,1)
  return function () {
    return fn.myApply(obj,[...args,...arguments])
  }
}
```