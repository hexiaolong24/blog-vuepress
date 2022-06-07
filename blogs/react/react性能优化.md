---
title: react性能优化
date: 2020-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## 为什么需要性能优化 api

- 一棵 Fiber 树，虽然只有一个子节点有更新，但是 react 会重新创建整课树，这必将是非常严重的性能浪费，所以我们需要用某些手段达到不需要更新的组件使直接跳过的效果
- 对比 vue,就能做到只更新当前组件，因为有响应式，依赖收集可以准确的知道需要更新哪里

## 法则

> 变的部分和不变的部分分离

## 变的部分

- Props
- state
- context

## 怎么做

- 当父组件满足性能优化条件，子组件有可能会命中性能优化（不 render）

```jsx
// 优化前
import { useState } from "react";

// 会重新执行
function ExpensiveCpn() {
  let now = performance.now();
  while (performance.now() - now < 100) {}
  console.log("耗时的组件 render");
  return <p>耗时的组件</p>;
}

export default function App() {
  const [num, updateNum] = useState(0);

  return (
    <div>
      <input value={num} onChange={(e) => updateNum(+e.target.value)} />
      <p>num is {num}</p>
      <ExpensiveCpn />
    </div>
  );
}
```

```jsx
// 优化后
import { useState } from "react";

// 不会重新执行
function ExpensiveCpn() {
  let now = performance.now();
  while (performance.now() - now < 100) {}
  console.log("耗时的组件 render");
  return <p>耗时的组件</p>;
}

function Input() {
  const [num, updateNum] = useState(0);
  return (
    <>
      <input value={num} onChange={(e) => updateNum(+e.target.value)} />
      <p>num is {num}</p>
    </>
  );
}

export default function App() {
  return (
    <div>
      <Input />
      <ExpensiveCpn />
    </div>
  );
}
```

## 该如何比较 props

- 全等比较（高效），但不易命中性能优化
  - props 即使没有也是一个空对象，新旧两个 props 对象不全等，不满足 props 不变，而且是有传染性的，只要有一个组件不能命中性能优化，那么他的子孙组件也不能命中
- 浅比较（不高效），但容易命中性能优化
  - React.memo
  - PureComponent

## useMemo 和 useCallback

> 生效的前提是接受组件是钱比较

- 缓存变量传给子组件

## 步骤

1.  寻找项目中性能损耗严重的子树
2.  在子树的根节点使用性能优化 api
3.  子树中运用变与不变分离的原则
