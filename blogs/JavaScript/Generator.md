---
title: Generator
date: 2019-05-24
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
- 前端
---

##  概念
-   ES6提供的解决异步编程的方案之一
-   Generator函数是一个状态机，内部封装了不同状态的数据
-   用来生成遍历器对象
-   可暂停函数(惰性求值), yield可暂停，next方法可启动。每次返回的是yield后的表达式结果

##  特点
-   function 与函数名之间有一个星号*
-   内部用yield表达式来定义不同的状态
```js
function* generatorExample(){
    let result = yield 'hello';  // 状态值为hello
    yield 'generator'; // 状态值为generator
}
```
-   调用generator函数返回的是指针对象，而不会执行该函数内部逻辑
-   调用next方法函数内部逻辑开始执行，遇到yield表达式停止，返回{value: yield后的表达式结果/undefined, done: false/true}
-   再次调用next方法会从上一次停止时的yield处开始，直到最后
-   yield语句返回结果通常为undefined， 当调用next方法时传参内容会作为启动时yield语句(上一条yield)的返回值。

```js
function* GeneratorUtil() {
    console.log('函数开始执行');
    let a = yield console.log('xxx'); // 当遍历器对象调用next方法开始执行函数，遇到yield就暂停
    console.log('aaa', a);
    console.log('函数继续执行');
    let b = yield 2;
    console.log('bbb', b);
    console.log('函数执行完毕');
}

let generatorObj = GeneratorUtil(); // 不是调用函数体，生成一个遍历器对象


console.log(generatorObj.next('aaa')); // 不打印
console.log(generatorObj.next('bbb')); // 'aaa', 'bbb'
console.log(generatorObj.next());
```