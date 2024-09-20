---
title: chunk
date: 2019-05-28
sidebar: 'auto'
categories:
  - Happy
tags:
  - array
---

## 函数分块

```js
let arr = [1, 2, 3];
console.log(chunk(arr, 2)); // [[1,2], [3]]
```

## 实现

```js
function chunk(arr, size = 1) {
	if (arr instanceof Array) {
		// 判断是否是数组
		if (arr.length === 0) {
			return [];
		}
		let result = [];
		let tmp = [];
		arr.forEach((item) => {
			// 每一次临时数组为空是放入最外层数组
			if (tmp.length === 0) {
				result.push(tmp);
			}
			// 将item依次放入内层数组中
			tmp.push(item);
			// 当内层数组length为size时，创建下一个空数组
			if (tmp.length === size) {
				tmp = [];
			}
		});
		return result;
	} else {
		return [];
	}
}
```
