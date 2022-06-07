---
title: Hooks
date: 2020-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## dispatcher

组件 mount 时的 hook 与 update 时的 hook 来源于不同的对象，这类对象在源码中被称为 dispatcher

```js
// mount时的Dispatcher
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
};

// update时的Dispatcher
const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
};
```

## Hook 的数据结构

```js
const hook: Hook = {
  memoizedState: null,

  baseState: null,
  baseQueue: null,
  queue: null,

  next: null,
};
```

## memoizedState

> hook 与 FunctionComponent fiber 都存在 memoizedState 属性

> fiber.memoizedState：FunctionComponent 对应 fiber 保存的 Hooks 链表。

> hook.memoizedState：Hooks 链表中保存的单一 hook 对应的数据

- 不同类型 hook 的 memoizedState 保存不同类型数据，具体如下：

  - useState：对于 const [state, updateState] = useState(initialState)，memoizedState 保存 state 的值

  - useReducer：对于 const [state, dispatch] = useReducer(reducer, {});，memoizedState 保存 state 的值

  - useEffect：memoizedState 保存包含 useEffect 回调函数、依赖项等的链表数据结构 effect，你可以在这里 (opens new window)看到 effect 的创建过程。effect 链表同时会保存在 fiber.updateQueue 中

  - useRef：对于 useRef(1)，memoizedState 保存{current: 1}

  - useMemo：对于 useMemo(callback, [depA])，memoizedState 保存[callback(), depA]

  - useCallback：对于 useCallback(callback, [depA])，memoizedState 保存[callback, depA]。与 useMemo 的区别是，useCallback 保存的是 callback 函数本身，而 useMemo 保存的是 callback 函数的执行结果

- 有些 hook 是没有 memoizedState 的，比如：

  - useContext

## useEffect

- 没有第二个参数时，会在 mount 和 update 创建 passive effect
- 包含一个空数组，会在 mount 时创建 passive effect
- 包含依赖项，会在 mount 时和依赖项变化时创建 passive effect

> commit 阶段后异步调用，componentDidmount 在 commit 阶段后同步执行，和 useLayoutEffect 执行时机相同
