---
title: Fiber
date: 2020-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## 是什么

> Fiber 并不是计算机术语中的新名词，他的中文翻译叫做纤程，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。在很多文章中将纤程理解为协程的一种实现。在 JS 中，协程的实现便是 Generator。所以，我们可以将纤程(Fiber)、协程(Generator)理解为代数效应思想在 JS 中的体现。
> React Fiber (虚拟 DOM)可以理解为：
> React 内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。
> 是一个最小工作单元

## Fiber 的含义

1.  作为架构来说，之前 React15 的 Reconciler 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 stack Reconciler。React16 的 Reconciler 基于 Fiber 节点实现，被称为 Fiber Reconciler

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

2.  作为静态的数据结构来说，每个 Fiber 节点对应一个 React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的 DOM 节点等信息

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
// ref相关
this.ref = null;
```

3.  作为动态的工作单元来说，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null; // 存储update的链表
this.memoizedState = null; // 类组件存储fiber的状态，函数组件存储hooks链表
this.dependencies = null;

this.mode = mode;

// flags原为effectTag，表示当前这个fiber节点变化的类型：增、删、改
this.flags = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

## 优先级调度相关

```js
// 该fiber中的优先级，它可以判断当前节点是否需要更新
this.lanes = NoLanes;
// 子树中的优先级，它可以判断当前节点的子树是否需要更新
this.childLanes = NoLanes;
```

## 双缓存 Fiber 树

- 在 React 中最多会同时存在两棵 Fiber 树。当前屏幕上显示内容对应的 Fiber 树称为 current Fiber 树，正在内存中构建的 Fiber 树称为 workInProgress Fiber 树

- current Fiber 树中的 Fiber 节点被称为 current fiber，workInProgress Fiber 树中的 Fiber 节点被称为 workInProgress fiber，他们通过 alternate 属性连接

```js
/*
 * 可以看成是workInProgress（或current）树中的和它一样的节点，
 * 可以通过这个字段是否为null判断当前这个fiber处在更新还是创建过程
 * */
this.alternate = null;

currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

## 两个阶段

- render 新 fiber 树的构建
  render 阶段实际上是在内存中构建一棵新的 fiber 树（称为 workInProgress 树），构建过程是依照现有 fiber 树（current 树）从 root 开始深度优先遍历再回溯到 root 的过程

  - beginWork

    - 组件的状态计算
    - diff
    - render 函数的执行

  - completeWork
    - 真实 DOM 节点的创建以及挂载（？）
    - DOM 属性的处理
    - effect 链表的收集 单向链表
    - 被跳过的优先级的收集
    - 错误处理

- commit 更新最终效果的应用

### beginWork

1.  首先判断节点及其子树是否有更新
2.  若有更新会在计算新状态和 diff 之后生成新的 Fiber
3.  然后在新的 fiber 上标记 flags（effectTag）
4.  最后 return 它的子节点以便继续针对子节点进行 beginWork。若它没有子节点，则返回 null，这样说明这个节点是末端节点，可以进行向上回溯，进入 completeWork 阶段。

- 复用节点
  如果无需处理，则调用 bailoutOnAlreadyFinishedWork 复用节点
  beginWork 它的返回值有两种情况：

返回当前节点的子节点，然后会以该子节点作为下一个工作单元继续 beginWork，不断往下生成 fiber 节点，构建 workInProgress 树。
返回 null，当前 fiber 子树的遍历就此终止，从当前 fiber 节点开始往回进行 completeWork。

bailoutOnAlreadyFinishedWork 函数的返回值也是如此。

## Reconciler (render 阶段) 异步可中断

- render 阶段开始于 performSyncWorkOnRoot 或 performConcurrentWorkOnRoot 方法的调用
  - performSyncWorkOnRoot 同步
  - performConcurrentWorkOnRoot 异步

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  // 会判断shouldYield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

- 唯一的区别是是否调用 shouldYield。如果当前浏览器帧没有剩余时间，shouldYield 会中止循环，直到浏览器有空闲时间后再继续遍历

## 递 阶段

- 首先从 rootFiber 开始向下深度优先遍历。为遍历到的每个 Fiber 节点调用 beginWork 方法
- 该方法会根据传入的 Fiber 节点创建子 Fiber 节点，并将这两个 Fiber 节点连接起来。当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段

## beginWork

- 作用
  > beginWork 的工作是传入当前 Fiber 节点，创建子 Fiber 节点

```js
function beginWork(
  current: Fiber | null, // 当前组件对应的Fiber节点在上一次更新时的Fiber节点，即workInProgress.alternate
  workInProgress: Fiber, // 当前组件对应的Fiber节点
  renderLanes: Lanes // 优先级相关
): Fiber | null {
  // ...省略函数体
}
```

- 除 rootFiber 以外， 组件 mount 时，由于是首次渲染，是不存在当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 mount 时 current === null,组件 update 时，由于之前已经 mount 过，所以 current !== null。所以我们可以通过 current === null ?来区分组件是处于 mount 还是 update

- update 时：如果 current 存在，在满足一定条件时可以复用 current 节点，这样就能克隆 current.child 作为 workInProgress.child，而不需要新建 workInProgress.child。

- mount 时：除 fiberRootNode 以外，current === null。会根据 fiber.tag 不同，创建不同类型的子 Fiber 节点

## 最终会进入 reconcileChildren

- 对于 mount 的组件，他会创建新的子 Fiber 节点

- 对于 update 的组件，他会将当前组件与该组件在上次更新时对应的 Fiber 节点比较（也就是俗称的 Diff 算法），将比较的结果生成新 Fiber 节点

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
```

## effectTag

我们知道，render 阶段的工作是在内存中进行，当工作结束后会通知 Renderer 需要执行的 DOM 操作。要执行 DOM 操作的具体类型就保存在 fiber.effectTag 中。

```js
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

## 归 阶段

- 在“归”阶段会调用 completeWork (opens new window)处理 Fiber 节点

- 当某个 Fiber 节点执行完 completeWork，如果其存在兄弟 Fiber 节点（即 fiber.sibling !== null），会进入其兄弟 Fiber 的“递”阶段。如果不存在兄弟 Fiber，会进入父级 Fiber 的“归”阶段。“递”和“归”阶段会交错执行直到“归”到 rootFiber。至此，render 阶段的工作就结束了

## effectList

- 每个执行完 completeWork 且存在 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中

## Renderer(commit 阶段) 同步执行

### before mutation 阶段（执行 DOM 操作前）

1.  处理 DOM 节点渲染/删除后的 autoFocus、blur 逻辑。

2.  调用 getSnapshotBeforeUpdate(UNSAFE_componentWillReceiveProps) 生命周期钩子。

- 从 Reactv16 开始，componentWillXXX 钩子前增加了 UNSAFE\_前缀。究其原因，是因为 Stack Reconciler 重构为 Fiber Reconciler 后，render 阶段的任务可能中断/重新开始，对应的组件在 render 阶段的生命周期钩子（即 componentWillXXX）可能触发多次。
- getSnapshotBeforeUpdate 是在 commit 阶段，是同步执行的

3.  异步调度 useEffect。

- 为什么异步
  > useEffect 异步执行的原因主要是防止同步执行时阻塞浏览器渲染

### mutation 阶段（执行 DOM 操作）

- mutation 阶段会遍历 effectList，依次执行 commitMutationEffects。该方法的主要工作为“根据 effectTag 调用不同的处理函数处理 Fiber
- 执行 useLayoutEffect hook 的销毁函数
- 执行 componentWillUnmount

### layout 阶段（执行 DOM 操作后）

- 该阶段的代码都是在 DOM 渲染完成（mutation 阶段完成）后执行的。该阶段触发的生命周期钩子和 hook 可以直接访问到已经改变后的 DOM

1.  commitLayoutEffectOnFiber（调用生命周期钩子和 hook 相关操作）

- componentDidMount
- componentDidUpdate

2.  commitAttachRef（赋值 ref）

## useEffect 和 useLayoutEffect

- useLayoutEffect 在 layout 阶段 dom 准备之后，已更新但是并未渲染完成，会阻塞浏览器渲染
- 而 useEffect 则需要先调度，在 Layout 阶段完成后再异步执行

## Scheduler 的作用

- Scheduler 用来调度执行上面提到的 React 任务。
- 何为调度？依据任务优先级来决定哪个任务先被执行。调度的目标是保证高优先级任务最先被执行。
- 何为执行？Scheduler 执行任务具备一个特点：即根据时间片去终止任务，并判断任务是否完成，若未完成则继续调用任务函数。它只是去做任务的中断和恢复，而任务是否已经完成则要依赖 React 告诉它。Scheduler 和 React 相互配合的模式可以让 React 的任务执行具备异步可中断的特点。

## 双缓冲机制

当 React 开始更新工作之后，会有两个 fiber 树，一个 current 树，是当前显示在页面上内容对应的 fiber 树。另一个是 workInProgress 树，它是依据 current 树深度优先遍历构建出来的新的 fiber 树，所有的更新最终都会体现在 workInProgress 树上。当更新未完成的时候，页面上始终展示 current 树对应的内容，当更新结束时（commit 阶段的最后），页面内容对应的 fiber 树会由 current 树切换到 workInProgress 树，此时 workInProgress 树即成为新的 current 树。

## 题目

1.  如何区分更新与初始化过程
    判断 current === null

- true 初始化
- false 更新
