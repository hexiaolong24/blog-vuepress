---
title: concat
date: 2019-05-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - 自定义函数库
 - array
---

##  函数合并
```js
  arr = [1]
  console.log(concat(arr,[2,3],4)) // [1,2,3,4]
```

##  实现
```js
function concat(arr, ...args) {
    // 声明一个空数组
    const result = [...arr];
    // 遍历数组
    args.forEach(item => {
        // 判断 item 是否为数组
        if(Array.isArray(item)){
            result.push(...item);
        }else{
            result.push(item);
        }
    });
    // 返回 result
    return result;
}
```