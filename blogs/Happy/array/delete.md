---
title: delete
date: 2019-07-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - array
---


### 删除指定项

```js
arr = [1, 2, 3, 4, 5]
del(arr, 4, 5) // [1, 2, 3]
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
```

