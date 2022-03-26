---
title: throttle&&debounce
date: 2018-10-24
sidebar: 'auto'
categories:
 - Happy
---

##  函数节流
```js
function throttle(fn, ms = 100) {
  let throttleTimer = null;
  return function (...args) {
    if(!throttleTimer) {
      const ret = fn.apply(this, args);
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, ms);
      return ret;
    }
  };
}
```

##  函数防抖
```js
function debounce(fn, ms = 100) {
  let debounceTimer = null
  return function(...args) {
    debounceTimer && clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}
```