---
title: JS事件轮询
date: 2018-09-11
sidebar: 'auto'
categories:
 - JavaScript
tags:
 - JavaScript
---

##  event loop
- event loop翻译出来就是事件循环，可以理解为实现异步的一种方式
- 为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用本节所述的event loop
- window event loop
- worker event loop

##  task
- 一个event loop有一个或者多个task队列
- 当用户代理安排一个任务，必须将该任务增加到相应的event loop的一个tsak队列中
- 每一个task都来源于指定的任务源，比如可以为鼠标、键盘事件提供一个task队列，其他事件又是一个单独的队列。可以为鼠标、键盘事件分配更多的时间，保证交互的流畅
- task任务源非常宽泛，比如ajax的onload，click事件，基本上我们经常绑定的各种事件都是task任务源，还有数据库操作（IndexedDB ）
- 一个 task queue 在数据结构上是一个集合，而不是队列，因为事件循环处理模型会从选定的 task queue 中获取第一个可运行任务（runnable task），而不是使第一个 task 出队。上述内容来自 HTML规范[3]

##  microtask
- 每一个event loop都有一个microtask队列，一个microtask会被排进microtask队列而不是task队列

##  进一步了解event loop
- 每个线程都有自己的event loop
- 浏览器可以有多个event loop，browsing contexts和web workers就是相互独立的
- 所有同源的browsing contexts可以共用event loop，这样它们之间就可以相互通信

##  处理过程
1.  在所选 task queue (taskQueue)中约定必须包含一个可运行任务。如果没有此类 task queue，则跳转至下面 microtasks 步骤。
2.  让 taskQueue 中最老的 task (oldestTask) 变成第一个可执行任务，然后从 taskQueue 中删掉它。
3.  将上面 oldestTask 设置为 event loop 中正在运行的 task。
4.  执行 oldestTask。
5.  将 event loop 中正在运行的 task 设置为 null。
6.  执行 microtasks 检查点（也就是执行 microtasks 队列中的任务）。
7.  设置 hasARenderingOpportunity 为 false。
8.  更新渲染。
9.  如果当前是 window event loop 且 task queues 里没有 task 且 microtask queue 是空的，同时渲染时机变量 hasARenderingOpportunity 为 false ，去执行 idle period（requestIdleCallback）。
10. 返回到第一步。

##  event loop中的Update the rendering
这是event loop中很重要部分，在第7步会进行Update the rendering（更新渲染），规范允许浏览器自己选择是否更新视图。也就是说可能不是每轮事件循环都去更新视图，只在有必要的时候才更新视图。
- 在一轮event loop中多次修改同一dom，只有最后一次会进行绘制。渲染更新（Update the rendering）会在event loop中的tasks和microtasks完成后进行，但并不是每轮event loop都会更新渲染，这取决于是否修改了dom和浏览器觉得是否有必要在此时立即将新状态呈现给用户。如果在一帧的时间内（时间并不确定，因为浏览器每秒的帧数总在波动，16.7ms只是估算并不准确）修改了多处dom，浏览器可能将变动积攒起来，只进行一次绘制，这是合理的。

- 如果希望在每轮event loop都即时呈现变动，可以使用requestAnimationFrame。
raf是在微任务之后，但是不是每次eventloop都执行。因为ui渲染不是每次循环都能执行到

##  更新渲染
1.  遍历当前浏览上下文中所有的 document ，必须按在列表中找到的顺序处理每个 document 。
2.  渲染时机（Rendering opportunities）：如果当前浏览上下文中没有到渲染时机则将所有 docs 删除，取消渲染（此处是否存在渲染时机由浏览器自行判断，根据硬件刷新率限制、页面性能或页面是否在后台等因素）。
3.  如果当前文档不为空，设置 hasARenderingOpportunity 为 true 。
4.  不必要的渲染（Unnecessary rendering）：如果浏览器认为更新文档的浏览上下文的呈现不会产生可见效果且文档的 animation frame callbacks 是空的，则取消渲染。（终于看见 requestAnimationFrame 的身影了
5.  从 docs 中删除浏览器认为出于其他原因最好跳过更新渲染的文档。
6.  如果文档的浏览上下文是顶级浏览上下文，则刷新该文档的自动对焦候选对象。
7.  处理 resize 事件，传入一个 performance.now() 时间戳。
8.  处理 scroll 事件，传入一个 performance.now() 时间戳。
9.  处理媒体查询，传入一个 performance.now() 时间戳。
10. 运行 CSS 动画，传入一个 performance.now() 时间戳。
11. 处理全屏事件，传入一个 performance.now() 时间戳。
12. 执行 requestAnimationFrame 回调，传入一个 performance.now() 时间戳。
13. 执行 intersectionObserver 回调，传入一个 performance.now() 时间戳。
14. 对每个 document 进行绘制。
15. 更新 ui 并呈现。

- 其实 rAF 执行属于 render UI 阶段，严格上来讲不属于微任务或者宏任务,它会在 style/layout/paint 之前调用
- raf是在微任务之后，但是不是每次eventloop都执行,因为ui渲染不是每次循环都能执行到

```js
function fn() {
    console.log('requestAn')
}
requestAnimationFrame(fn)
setTimeout(() => {
    console.log('setTimeout')
},0)
Promise.resolve().then(() => {
    console.log('Promise')
})
// Promise 一定再setTimeout 之前
// requestAn 一定在Promise 之后
// 但是requestAn 和 setTimeout 不一定 ，取决于当次eventloop 是否更新渲染
```


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

##  会什么会区分宏任务和微任务

- 事件循环由宏任务和在执行宏任务期间产生的所有微任务组成。完成当下的宏任务后，会立刻执行所有在此期间入队的微任务。
- 这种设计是为了给紧急任务一个插队的机会，否则新入队的任务永远被放在队尾。区分了微任务和宏任务后，本轮循环中的微任务实际上就是在插队，这样微任务中所做的状态修改，在下一轮事件循环中也能得到同步。

##  node运行机制

（1）V8引擎解析JavaScript脚本。

（2）解析后的代码，调用Node API。

（3）libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。

（4）V8引擎再将结果返回给用户。

六个宏任务按顺序依次执行，六个等级的宏任务全部执行完成，才是一轮循环，其中需要关注的是：Timers、Poll、Check阶段，因为我们所写的代码大多属于这三个阶段

- timers: 执行setTimeout和setInterval的回调
- pending callbacks: 执行延迟到下一个循环迭代的 I/O 回调
- idle, prepare: 仅系统内部使用
- poll: 检索新的 I/O 事件;执行与 I/O 相关的回调。事实上除了其他几个阶段处理的事情，其他几乎所有的异步都在这个阶段处理。
- check: setImmediate在这里执行
- close callbacks: 一些关闭的回调函数，如：socket.on('close', ...)


## process.nextTick

- process.nextTick方法可以在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。setImmediate方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，在setTimeout(fn, 0)之后执行。

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

##  node版本差异 11.x.x
- node11.x 之前，先取出完一整个宏任务队列中全部任务，然后执行一个微任务队列。
- 但在11.x 之后，node端的事件循环变得和浏览器类似：先执行一个宏任务，然后是一个微任务队列。但依然保留了宏任务队列和微任务队列的优先级。

```js
console.log('Script开始')
setTimeout(() => {
  console.log('宏任务1（setTimeout)')
  Promise.resolve().then(() => {
    console.log('微任务promise2')
  })
}, 0)
setImmediate(() => {
  console.log('宏任务2')
})
setTimeout(() => {
  console.log('宏任务3（setTimeout)')
}, 0)
console.log('Script结束')
Promise.resolve().then(() => {
  console.log('微任务promise1')
})
process.nextTick(() => {
  console.log('微任务nextTick')
})
// v 11.0.0 以上
// Script开始
// Script结束
// 微任务nextTick
// 微任务promise1
// 宏任务1（setTimeout)

// 执行完宏任务后如果出现了微任务则会优先执行微任务，与浏览器保持一致

// 微任务promise2
// 宏任务3（setTimeout)
// 宏任务2

// v 10.0.0
// Script开始
// Script结束
// 微任务nextTick
// 微任务promise1

// 两个微任务结束之后依次执行了属于同一个宏任务的setTimeout 

// 宏任务1（setTimeout)
// 宏任务3（setTimeout)
// 微任务promise2
// 宏任务2
```

##  requestAnimationFrame setInterval
- 同样都是执行90次（900px）
- 但是 setInterval 会比 requestAnimationFrame 先到达，并且有明显卡顿
- 分析：
  - requestAnimationFrame执行90次说明是真的render了90次
  - 但是setInterval90次不是每次render都执行，如果是那肯定和requestAnimationFrame是同时的
  - 如第10次的render setInterval已经执行到第12次，此时width就会更大，所以会出现超前的现象，说明90次render中setInterval执行次数小于90，所以会出现卡顿（跳帧）
```js
setInterval(() => {
  let ele = document.querySelector('.box')
  if(ele.getBoundingClientRect().width < 1000) {
  console.count('a====')
    ele.style.width =  `${ele.getBoundingClientRect().width + 10}px`
  }
}, 16.7)

let fn = () => {
  let ele = document.querySelector('.box2')
  if(ele.getBoundingClientRect().width < 1000) {
  console.count('b====')
    ele.style.width =  `${ele.getBoundingClientRect().width + 10}px`
    requestAnimationFrame(fn)
  }
}
requestAnimationFrame(fn)
```
