---
title: drop
date: 2019-01-28
sidebar: 'auto'
categories:
 - Happy
tags:
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