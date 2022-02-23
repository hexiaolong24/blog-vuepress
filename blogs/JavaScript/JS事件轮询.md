---
title: JS事件轮询
date: 2018-09-11
sidebar: 'auto'
categories:
 - JavaScript
tags:
 - JavaScript
---

## js单线程

- 首先我们都知道js是单线程的，script标签中的所有代码都会在js的主线程执行，js为什么不能设计成多线程的，这样可以提高效率啊？

- 这与它的用途有关，我们知道作为浏览器的脚本语言，js的主要用途就是与用户互动，以及操作DOM，这决定了它只能是单线程的，否则会带来很麻烦的同步问题，比如有多个线程，一个线程在某个DOM节点添加内容，另一个线程在相同节点删除内容，这时浏览器该以哪个线程为准？

- 所以为了避免复杂性，从一诞生就确定了JS是单线程的，并且之后也不会改变，为了利用多核CPU的计算能力，H5提出Web Worker标准，允许创建多个线程，但是子线程完全受主线程的控制，且不得操作DOM，所以本质上还是单线程的。

## 执行机制

- 按照先后顺序，当遇到异步任务的时候不会像同步任务那样立刻执行，而是会交给对应的浏览器提供的管理模块去管理，继续向下执行所有同步代码，对应的管理模块在异步任务满足相应的条件之后，比如DOM事件在用户操作之后，ajax回调在得到响应之后，定时器在时间满足之后，会将对应的回调函数放入回调队列中

- 我们知道回调队列分为宏队列和微队列，mutation回调是在微队列中的，MutationObserver()创建并返回一个新的 MutationObserver 它会在指定的DOM发生变化时被调用。

- js引擎在执行完全部的同步代码之后，会先去微队列中查看，将微队列中所有等待执行的回调函数钩到主线程全部执行完，这时才会去宏队列中查看，开始执行第一个宏队列中的回调函数，在执行微队列或者宏队列中回调函数的同时，又可能继续产生微任务，所以每次执行完一个宏队列中的回调函数都回去查看微队列中有没有等待执行的微任务，如果有，先将微任务执行完毕再去执行宏队列中的回调函数，js引擎会在主线程的代码全部执行完之后反复的去回调队列询问，(event loop),这就是事件轮循机制

## 微任务、宏任务

> ES6 规范中，microtask 称为 jobs，macrotask 称为 task；宏任务是由宿主发起的，而微任务由JavaScript自身发起。

- 在ES3以及以前的版本中，JavaScript本身没有发起异步请求的能力，也就没有微任务的存在。在ES5之后，JavaScript引入了Promise，这样，不需要浏览器，JavaScript引擎自身也能够发起异步任务了。

分类|宏任务（macrotask）| 微任务（microtask）
---|:--:|:--:
谁发起的|宿主（Node、浏览器）| JS引擎
具体事件|1. script (可以理解为外层同步代码) <br/>2. setTimeout/setInterval <br/>3. UI rendering/UI事件 <br/>4. postMessage，MessageChannel<br/> 5. setImmediate，I/O（Node.js）6.ajax<br/> 7.DOM事件回调<br/>| 1. Promise <br/> 2. MutaionObserver<br/> 3. Object.observe（已废弃；Proxy 对象替代）<br/> 4. process.nextTick（Node.js）
谁先运行|后运行|先运行

##  node运行机制

（1）V8引擎解析JavaScript脚本。

（2）解析后的代码，调用Node API。

（3）libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。

（4）V8引擎再将结果返回给用户。

- timers: 执行setTimeout和setInterval的回调
- pending callbacks: 执行延迟到下一个循环迭代的 I/O 回调
- idle, prepare: 仅系统内部使用
- poll: 检索新的 I/O 事件;执行与 I/O 相关的回调。事实上除了其他几个阶段处理的事情，其他几乎所有的异步都在这个阶段处理。
- check: setImmediate在这里执行
- close callbacks: 一些关闭的回调函数，如：socket.on('close', ...)


## process.nextTick

- process.nextTick方法可以在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。setImmediate方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像。请看下面的例子（via StackOverflow）。

```js
process.nextTick(function A() {
  console.log(1);
  process.nextTick(function B(){console.log(2);});
});

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0)
// 1
// 2
// TIMEOUT FIRED
```

- 上面代码中，由于process.nextTick方法指定的回调函数，总是在当前"执行栈"的尾部触发，所以不仅函数A比setTimeout指定的回调函数timeout先执行，而且函数B也比timeout先执行。这说明，如果有多个process.nextTick语句（不管它们是否嵌套），将全部在当前"执行栈"执行。

- process.nextTick总是比promise早执行

```js
// 同时微任务
Promise.resolve().then(() => console.log(4));
process.nextTick(() => console.log(3));

// 3 4
```
