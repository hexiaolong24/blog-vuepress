---
title: shuffle
date: 2019-12-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - array
---

### 打乱数组

```js
arr.sort(() => Math.random() - 0.5)
```

```js
// Fisher–Yates shuffle
Array.prototype.myShuffle = function() {
  let array = this;
  let m = array.length,
    t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
```