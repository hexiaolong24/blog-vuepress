---
title: React中的优先级
date: 2019-09-01
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## 根源

UI 产生交互的根本原因是各种事件，不同事件产生的更新，它们的优先级是有差异的，所以更新优先级的根源在于事件的优先级。 一个更新的产生可直接导致 React 生成一个更新任务，最终这个任务被 Scheduler 调度。

- 事件优先级：按照用户事件的交互紧急程度，划分的优先级
- 更新优先级：事件导致 React 产生的更新对象（update）的优先级（update.lane）
- 任务优先级：产生更新对象之后，React 去执行一个更新任务，这个任务所持有的优先级
- 调度优先级：Scheduler 依据 React 更新任务生成一个调度任务，这个调度任务所持有的优先级

## 事件的优先级

- 离散事件（DiscreteEvent）：click、keydown、focusin 等，这些事件的触发不是连续的，优先级为 0。
- 用户阻塞事件（UserBlockingEvent）：drag、scroll、mouseover 等，特点是连续触发，阻塞渲染，优先级为 1。
- 连续事件（ContinuousEvent）：canplay、error、audio 标签的 timeupdate 和 canplay，优先级最高，为 2。

1.  事件优先级是在注册阶段被确定的，在向 root 上注册事件时，会根据事件的类别，创建不同优先级的事件监听（listener），最终将它绑定到 root 上去。
2.  createEventListenerWrapperWithPriority 函数会首先根据事件的名称去找对应的事件优先级，然后依据优先级返回不同的事件监听函数
3.  最终绑定到 root 上的事件监听其实是 dispatchDiscreteEvent、dispatchUserBlockingUpdate、dispatchEvent 这三个中的一个。它们做的事情都是一样的，以各自的事件优先级去执行真正的事件处理函数。
    比如：dispatchDiscreteEvent 和 dispatchUserBlockingUpdate 最终都会以 UserBlockingEvent 的事件级别去执行事件处理函数
4.  以某种优先级去执行事件处理函数其实要借助 Scheduler 中提供的 runWithPriority 函数来实现，相当于告诉 Scheduler：你帮我记录一下当前事件派发的优先级，等 React 那边创建更新对象（即 update）计算更新优先级时直接从你这拿就好了

## 更新的优先级

1.  生成一个 update 对象，这时候会计算它的更新优先级，即 update.lane：
2.  requestUpdateLane，它首先找出 Scheduler 中记录的优先级：schedulerPriority，然后计算更新优先级：lane，具体的计算过程在 findUpdateLane 函数中， 计算过程是一个从高到低依次占用空闲位的操作
3.  update 对象创建完成后意味着需要对页面进行更新，会调用 scheduleUpdateOnFiber 进入调度，而真正开始调度之前会计算本次产生的更新任务的任务优先级，目的是 与已有任务的任务优先级去做比较，便于做出多任务的调度决策。

```js
// update对象
const update: Update<*> = {
  eventTime, // update的产生时间，若该update一直因为优先级不够而得不到执行，那么它会超时，会被立刻执行
  lane, // lane：update的优先级，即更新优先级
  suspenseConfig, // 任务挂起相关
  tag: UpdateState, // 表示更新是哪种类型（UpdateState，ReplaceState，ForceUpdate，CaptureUpdate）
  payload: null, // 更新所携带的状态。
  callback: null, // 可理解为setState的回调
  next: null, // 指向下一个update的指针
};

// updateQueue的结构
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState, // 前一次更新计算得出的状态，它是第一个被跳过的update之前的那些update计算得出的state。会以它为基础计算本次的state
  firstBaseUpdate: null, // 前一次更新时updateQueue中第一个被跳过的update对象
  lastBaseUpdate: null, // 前一次更新中，updateQueue中以第一个被跳过的update为起点一直到的最后一个update截取的队列中的最后一个update。
  shared: {
    pending: null, // 存储着本次更新的update队列，是实际的updateQueue。shared的意思是current节点与workInProgress节点共享一条更新队列。
  },
  effects: null,
};
```

问题

1. 问什么是环状
   这是因为方便定位到链表的第一个元素。updateQueue 指向它的最后一个 update，updateQueue.next 指向它的第一个 update。
2. 为什么会有多个
   多次更新状态

## 任务优先级

一个 update 会被一个 React 的更新任务执行掉，任务优先级被用来区分多个更新任务的紧急程度，它由更新优先级计算而来

## 调度优先级

一旦任务被调度，那么它就会进入 Scheduler，在 Scheduler 中，这个任务会被包装一下，生成一个属于 Scheduler 自己的 task，这个 task 持有的优先级就是调度优先级

- 在 Scheduler 中，分别用过期任务队列和未过期任务的队列去管理它内部的 task，过期任务的队列中的 task 根据过期时间去排序，最早过期的排在前面，便于被最先处理。
- 而过期时间是由调度优先级计算的出的，不同的调度优先级对应的过期时间不同。
