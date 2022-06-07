---
title: Diff
date: 2020-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## 一个 DOM 节点在某一时刻最多会有 4 个节点和他相关

- Diff 算法的本质是对比 1 和 4，生成 2。

1.  current Fiber。如果该 DOM 节点已在页面中，current Fiber 代表该 DOM 节点对应的 Fiber 节点。

2.  workInProgress Fiber。如果该 DOM 节点将在本次更新中渲染到页面中，workInProgress Fiber 代表该 DOM 节点对应的 Fiber 节点。

3.  DOM 节点本身。

4.  JSX 对象。即 ClassComponent 的 render 方法的返回结果，或 FunctionComponent 的调用结果。JSX 对象中包含描述 DOM 节点的信息。

## React 的 diff 会预设三个限制

1.  只对同级元素进行 Diff。如果一个 DOM 节点在前后两次更新中跨越了层级，那么 React 不会尝试复用他。

2.  两个不同类型的元素会产生出不同的树。如果元素由 div 变为 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点。

3.  开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定

## 多节点 Diff

- 同级多个节点的 Diff，一定属于以上三种情况中的一种或多种。

1.  节点更新（节点属性或者节点类型）
2.  节点新增、减少
3.  节点位置变化

## 优先级

- React 团队发现，在日常开发中，相较于新增和删除，更新组件发生的频率更高。所以 Diff 会优先判断当前节点是否属于更新

## 两轮遍历

### 第一轮遍历：处理更新的节点

1.  let i = 0，遍历 newChildren，将 newChildren[i]与 oldFiber 比较，判断 DOM 节点是否可复用。

2.  如果可复用，i++，继续比较 newChildren[i]与 oldFiber.sibling，可以复用则继续遍历。

3.  如果不可复用，分两种情况：

- key 不同导致不可复用，立即跳出整个遍历，第一轮遍历结束。

- key 相同 type 不同导致不可复用，会将 oldFiber 标记为 DELETION，并继续遍历

4.  如果 newChildren 遍历完（即 i === newChildren.length - 1）或者 oldFiber 遍历完（即 oldFiber.sibling === null），跳出遍历，第一轮遍历结束。

### 第二轮遍历：处理剩下的不属于更新的节点

- newChildren 与 oldFiber 同时遍历完
  那就是最理想的情况：只需在第一轮遍历进行组件更新 (opens new window)。此时 Diff 结束。

- newChildren 没遍历完，oldFiber 遍历完
  已有的 DOM 节点都复用了，这时还有新加入的节点，意味着本次更新有新节点插入，我们只需要遍历剩下的 newChildren 为生成的 workInProgress fiber 依次标记 Placement。

- newChildren 遍历完，oldFiber 没遍历完
  意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的 oldFiber，依次标记 Deletion。

- newChildren 与 oldFiber 都没遍历完

  > 我们以为从 abcd 变为 dabc，只需要将 d 移动到前面。

  > 但实际上 React 保持 d 不变，将 abc 分别移动到了 d 的后面。

  > 从这点可以看出，考虑性能，我们要尽量减少将节点从后面移动到前面的操作
