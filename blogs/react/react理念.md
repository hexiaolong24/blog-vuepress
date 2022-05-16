---
title: react理念
date: 2019-03-15
sidebar: 'auto'
categories:
 - React.js
tags:
 - React.js
---

##  官网
  > 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀

- 快速响应

##  CPU瓶颈
- 主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。
- 我们知道，JS可以操作DOM，GUI渲染线程与JS线程是互斥的。所以JS脚本执行和浏览器布局、绘制不能同时执行。
- 在每16.6ms时间内，需要完成如下工作：
  - JS脚本执行 -----  样式布局 ----- 样式绘制
- 当JS执行时间过长，超出了16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。
- 如果组件数量繁多，JS脚本执行时间过长，页面掉帧，造成卡顿。

##  如何解决
- 在浏览器每一帧的时间中，预留一些时间给JS线程，React利用这部分时间更新组件（可以看到，在源码 (opens new window)中，预留的初始时间是5ms）。
- 当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染UI，React则等待下一帧时间到来继续被中断的工作。
> 这种将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为时间切片（time slice）
```js
// 通过使用ReactDOM.unstable_createRoot开启Concurrent Mode
// ReactDOM.render(<App/>, rootEl);  
ReactDOM.unstable_createRoot(rootEl).render(<App/>);
```
- 此时我们的长任务被拆分到每一帧不同的task中，JS脚本执行时间大体在5ms左右，这样浏览器就有剩余时间执行样式布局和样式绘制，减少掉帧的可能性。
- 所以，解决CPU瓶颈的关键是实现时间切片，而时间切片的关键是：将同步的更新变为可中断的异步更新。

##  IO瓶颈
- 网络延迟是前端开发者无法解决的。如何在网络延迟客观存在的情况下，减少用户对网络延迟的感知？
- React给出的答案是将人机交互研究的结果整合到真实的 UI 中 (opens new window)
- 为此，React实现了Suspense (opens new window)功能及配套的hook——useDeferredValue (opens new window)
- 而在源码内部，为了支持这些特性，同样需要将同步的更新变为可中断的异步更新