---
title: throttle&&debounce
date: 2018-10-24
sidebar: 'auto'
categories:
 - Happy
---

##  函数节流
```js
let flag = true;
function throttle(func) {
    if(typeof func !== 'function') return 
    if(flag) {
        flag = false;
        func()
        setTimeout(() => {
            flag = true;
        }, 5000)
    }
}
throttle(() => {console.log('111')});

// 高阶函数
let throttle = function (fn, interval = 500, firstTime = true) {
    let _self = fn,
        timer,
    return function () {
        let _me = this;
        if(firstTime) {
            _self.apply(_me, arguments);
            return firstTime = false;
        }
        if(timer) {
            return false;
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            _self.apply(_me, arguments);
        }, interval);
    }
}
```

##  函数防抖
```js
let timer;
function debounce(func) {
    if(typeof func !== 'function') return 
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        func();
    }, 1000)
}
```