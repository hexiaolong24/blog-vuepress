---
title: Object.create
date: 2021-10-08
sidebar: 'auto'
categories:
 - Happy
---


```js
Object.create = function (prototype, properties) {
  if (typeof prototype !== "object") { throw TypeError(); }
  function F() {}
  F.prototype = prototype;
  let o = new F();
  Object.defineProperties(o, properties);
  return o;
};
```