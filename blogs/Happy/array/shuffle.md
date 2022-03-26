---
title: shuffle
date: 2019-12-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - array
---

## 打乱数组

- 次方法不是完全随机，大量数据验证数组前面的数字总是较小，后面的数字较大
```js
arr.sort(() => Math.random() - 0.5)
```

```js
// 时间复杂度O(n)
function shuffle(items) {
  items = [...items];
  for(let i = items.length; i > 0; i--) {
    const idx = Math.floor(Math.random() * i);
    [items[idx], items[i - 1]] = [items[i - 1], items[idx]];
  }
  return items;
}
```

##  抽奖 （生成器）

```js
function *shuffle(items) {
  items = [...items];
  for(let i = items.length; i > 0; i--) {
    const idx = Math.floor(Math.random() * i);
    [items[idx], items[i - 1]] = [items[i - 1], items[idx]];
    yield items[i - 1];
  }
}

let items = [...new Array(100).keys()];

let n = 0;
// 100个号随机抽取5个
for(let item of shuffle(items)) {
  console.log(item);
  if(n++ >= 5) break;
}
```