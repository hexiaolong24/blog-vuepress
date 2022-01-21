---
title: for in&for of
date: 2018-08-25
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
- 前端
---

##  for in&for of
1.  for of 只能遍历可迭代对象，获取的是迭代器返回的value值（...运算符同样只能作用在具有iterator接口的可迭代对象上）
- Array   
- arguments  
- string  
- set
- map

2.  for in 遍历数组返回的是索引下标，遍历对象返回的是属性key,不仅枚举自身属性，还会枚举其原型上的属性

3.  for in 不能遍历set，但可以遍历其他伪数组，返回索引下标，也可以遍历字符串，返回的是value

```js
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // logs 0, 1, 2, "foo"
  }
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

##  三点运算符

- 可以直接对数组进行遍历取值，不能直接作用在对象，是ES9中加入了，`{...obj}`相当于是浅拷贝，返回的是一个对象，在`react`中给标签属性传参的时候可以这样写，我们都知道`react`中写js代码需要用`{}`括起来，但是写这个语法的时候只写一个括号就可以，但实际上是外边还应该再有一个`{}`的，同样在小程序开发中作为标签属性传参的时候也是
`{{` ...item `}}`这样传参，但是小程序本身也是要用两个大括号括起来，看起来也相当于少了一个`{}`

- 第一个使用场景，函数调用传参的时候，相当于是拆包

- 第二个使用场景是函数接受参数的时候，当接收的参数不固定的时候，就可以用三点运算符，相当于是打包的过程