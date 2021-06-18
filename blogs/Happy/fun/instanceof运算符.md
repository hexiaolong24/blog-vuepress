---
title: instanceof
date: 2018-08-11
sidebar: 'auto'
categories:
 - Happy
tags:
 - 自定义函数库
---

```js
function ins(l,r) {
  let R = r.prototype;
  let L = l.__proto__;
  while(true) {
    if(L === null){
      return false
    }
    if(R === L) {
      return true
    }
    L = L.__proto__
  }
}
```