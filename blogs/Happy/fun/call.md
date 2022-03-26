---
title: call apply bind
date: 2018-08-28
sidebar: 'auto'
categories:
 - Happy
---

### call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
```js
Function.prototype.myCall = function(context) {
  context = context ? Object(context) : window;
  // 防止属性污染
  const fn = Symbol();
  // this是实例对象，即调用call方法的函数自身
  context[fn] = this;
  const args = [...arguments].slice(1);
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
```

### apply
```js
Function.prototype.myApply = function(context) {
  context = context ? Object(context) : window;
  // 防止属性污染
  const fn = Symbol();
  // this是实例对象，即调用call方法的函数自身
  context[fn] = this;
  const result = context[fn](...arguments[1]);
  delete context[fn];
  return result;
}
```

### bind
-   返回值：返回一个原函数的拷贝，并拥有指定的 this 值和初始参数
```js
Function.prototype.myBind = function(context) {
  context = context ? Object(context) : window;
  let fn = this
  let args = Array.prototype.slice.call(arguments,1)
  return function () {
    return fn.myApply(context,[...args,...arguments])
  }
}

Function.prototype.myBind = function(obj) {
  obj = obj ? Object(obj) : window;
  let _self = this
  let args = Array.prototype.slice.call(arguments,1)
  // 构建一个干净的函数，用于保存原函数的原型
  let Fn = function() {}
  let bindFn = function() {
    // this instanceof bindFn, 判断是否使用 new 来调用 bindFn
    // 如果是 new 来调用的话，this的指向就是其实例，
    // 如果不是 new 调用的话，就改变 this 指向到指定的对象
    return _self.myApply(this instanceof bindFn ? this : obj, [...args,...arguments])
  }
  Fn.prototype = this.prototype
  bindFn.prototype = new Fn()
  return bindFn
}
```