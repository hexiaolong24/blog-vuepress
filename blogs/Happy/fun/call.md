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
  if (typeof this !== 'function') {
    return undefined; // 用于防止 Function.prototype.myCall() 直接调用
  }
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
  if (typeof this !== 'function') {
    return undefined; // 用于防止 Function.prototype.myApply() 直接调用
  }
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
  if(typeof this !== 'function') {
    return undefined;
  }
  context = context ? Object(context) : window;
  let fn = this
  let args = Array.prototype.slice.call(arguments,1)
  return function () {
    return fn.myApply(obj,[...args,...arguments])
  }
}


Function.prototype.myBind = function(obj) {
  obj = obj ? Object(obj) : window;
  let _self = this
  let args = Array.prototype.slice.call(arguments,1)
  let Fn = function() {}
  let bindFn = function() {
    return _self.myApply(this instanceof bindFn ? this : obj,[...args,...arguments])
  }
  Fn.prototype = this.prototype
  bindFn.prototype = new Fn()
  return bindFn
}
```