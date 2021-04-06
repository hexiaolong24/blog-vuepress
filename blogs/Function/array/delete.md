---
title: delete
date: 2019-08-28
sidebar: 'auto'
categories:
 - Function
tags:
 - 自定义函数库
 - array
---


### 删除指定项

```js
arr = [1, 2, 3, 4, 5]
delete(arr, 4, 5) // [1, 2, 3]
```

### 实现
```js
function del(arr, ...args) {
  for(let i = 0; i < args.length; i++) {
    if(arr.includes(args[i])) {
      arr.splice(arr.indexOf(args[i]), 1)
      i--
    }
  }
  return arr
}

// 传入一个数组
function delAll(arr, delArr) {
  return del(arr, ...delArr);
}
```

