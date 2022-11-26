---
title: forEach
date: 2018-04-24
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
---

##  用法
-   如果省略了 thisArg 参数，或者其值为 null 或 undefined，this 则指向全局对象
```js
// thisArg可指定callback的this
array.forEach((cur, index, arr) => {}, thisArg)
```
-   forEach() 遍历的范围在第一次调用 callback 前就会确定。调用 forEach 后添加到数组中的项不会被 callback 访问到。如果已经存在的值被改变，则传递给 callback 的值是 forEach() 遍历到他们那一刻的值。

-   forEach() 为每个数组元素执行一次 callback 函数；与 map() 或者 reduce() 不同的是，它总是返回 undefined 值，并且不可链式调用

-    除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具。

-   若你需要提前终止循环，你可以使用：

    -   一个简单的 for 循环
    -   for...of / for...in 循环
    -   Array.prototype.every()
    -   Array.prototype.some()
    -   Array.prototype.find()
    -   Array.prototype.findIndex()

##  for
```js
for(let i = 0; i< arr.length; i++) {
  console.log(arr[i])
}

// 优化版
// 使用临时变量，将长度缓存起来，避免重复获取数组长度，尤其是当数组长度较大时优化效果才会更加明显。
var arr = [1,2,3,4,5]
for(var i=0,len=arr.length;i<len;i++){
  console.log(arr[i])
}
```
- for-len > for > for-of > forEach > map > for-in