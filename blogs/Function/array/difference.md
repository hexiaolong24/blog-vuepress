---
title: difference
date: 2019-08-28
sidebar: 'auto'
categories:
 - Function
tags:
 - 自定义函数库
 - array
---

### 输出两个数组的不同
```js
/**
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 */

function difference(arr1, arr2=[]){
  //判断参数
  if(arr1.length === 0){
    return [];
  }
  if(arr2.length === 0){
    return arr1.slice();
  }
  const result = arr1.filter(item => !arr2.includes(item));
  return result;
}
```