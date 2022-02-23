---
title: unique
date: 2019-05-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - array
---

### 数组去重
```js
// 原生方法
function unique1(arr) {
  let result = [];
  arr.forEach(item => {
    if(!result.includes(item)) result.push(item)
  });
  return result;
}

// es6
let unique2 = arr => [...new Set(arr)]

// 借助空对象设置标识
function unique3(arr) {
  let result = [];
  let obj = {};
  arr.forEach(item => {
    if(obj[item] === undefined){
      obj[item] = true
      result.push(item)
    }
  });
  return result;
}

// object特性，重复的属性直接覆盖
function unique4(arr) {
    let obj = {};
    arr.forEach((item) => {
        obj[item] = '';
    })
    return Object.keys(obj);
}

// reduce 
// 先排序 [1, 2, 2, 3, 3, 4]
let unique5 = arr => arr.sort().reduce((acc, cur) => {
  if(acc.length === 0 || acc[acc.length -1] !== cur) acc.push(cur)
  return acc
},[])

let unique6 = arr => arr.reduce((acc, cur) => {
  !acc.includes(cur) && acc.push(cur)  
  return acc
},[])
```