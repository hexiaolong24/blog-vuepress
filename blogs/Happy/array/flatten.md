---
title: flatten
date: 2019-11-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - array
---

### 数组扁平化

```js
arr = [1, [2, [3, 4]]]
flatten1(arr) // [1, 2, 3, 4]
```
### 实现

```js
function flatten1(arr) {
  let result = [];
  arr = [].concat(...arr)
  arr.forEach(item => {
    if(Array.isArray(item)) {
      result = result.concat(flatten1(item))
    }else {
      result = result.concat(item)
    }
  });
  return result;
}

function flatten2(arr) {
  let result = [].concat(...arr);
  while (result.some(item => Array.isArray(item))) {
    result = [].concat(...result)
  }
  return result;
}

Array.prototype.flatten3 = function() {
  return this.reduce((pre,cur) => {
    return pre.concat(Array.isArray(cur) ? cur.flatten3() : cur)
  },[])
}
```