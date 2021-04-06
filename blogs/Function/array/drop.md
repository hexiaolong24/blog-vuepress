---
title: drop
date: 2019-08-28
sidebar: 'auto'
categories:
 - Function
tags:
 - 自定义函数库
 - array
---

### 获取从前数(从后数)，size之外的元素
```js
/**
 * 
 * @param {Array} arr 
 * @param {Number} size 
 */
function drop(arr, size){
  return arr.filter((value, index) => index >= size);
}

function dropRight(arr, size){
  return arr.filter((value, index) => index < arr.length - size);
}
```