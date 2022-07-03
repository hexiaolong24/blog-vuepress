---
title: state
date: 2020-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## 同步还是异步

## 首先完全可以不依赖这个特性

- class 组件中可以在 componentDidmount 中执行
- function 组件可以在 useEffect 的回调函数中执行

## legacy 模式

- ReactDOM.render

- 批处理异步更新
- 上下文环境没有批处理标识（放在 setTimeout 中）,就会同步更新

## blocking 模式

## concurrent 模式

- ReactDOM.creatRoot
- 批处理异步更新
- 上下文环境没有批处理标识（放在 setTimeout 中）,依然会异 步更新

## legacy 模式下的 state

### 类组件中的 state

```js
setState(obj, callback);

/* 第一个参数为function类型 */
this.setState((state, props) => {
  return { number: 1 };
});
/* 第一个参数为object类型 */
this.setState({ number: 1 }, () => {
  console.log(this.state.number); //获取最新的number
});
```

- 参数

  - 第一个参数：当 obj 为一个对象，则为即将合并的 state ；如果 obj 是一个函数，那么当前组件的 state 和 props 将作为参数，返回值用于合并新的 state。

  - 第二个参数 callback ：callback 为一个函数，函数执行上下文中可以获取当前 setState 更新后的最新 state 的值，可以作为依赖 state 变化的副作用函数，可以用来做一些基于 DOM 的操作。

- 流程
  1.  首先，setState 会产生当前更新的优先级（老版本用 expirationTime ，新版本用 lane ）。
  2.  接下来 React 会从 fiber Root 根部 fiber 向下调和子节点，调和阶段将对比发生更新的地方，更新对比 expirationTime ，找到发生更新的组件，合并 state，然后触发 render 函数，得到新的 UI 视图层，完成 render 阶段。
  3.  接下来到 commit 阶段，commit 阶段，替换真实 DOM ，完成此次更新流程。
  4.  此时仍然在 commit 阶段，会执行 setState 中 callback 函数,如上的()=>{ console.log(this.state.number) }，到此为止完成了一次 setState 全过程。

render 阶段 render 函数执行 -> commit 阶段真实 DOM 替换 -> setState 回调函数执行 callback 。

- 类组件如何限制 state 更新视图

  - ① pureComponent 可以对 state 和 props 进行浅比较，如果没有发生变化，那么组件不更新。
  - ② shouldComponentUpdate 生命周期可以通过判断前后 state 变化来决定组件需不需要更新，需要更新返回 true，否则返回 false。

- 批处理
  在 React 事件执行之前通过 isBatchingEventUpdates=true 打开开关，开启事件批量更新，当该事件结束，再通过 isBatchingEventUpdates = false; 关闭开关，然后在 scheduleUpdateOnFiber 中根据这个开关来确定是否进行批量更新

  - 异步执行

  ```js
  export default class index extends React.Component {
    state = { number: 0 };
    handleClick = () => {
      this.setState({ number: this.state.number + 1 }, () => {
        console.log("callback1", this.state.number);
      });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 }, () => {
        console.log("callback2", this.state.number);
      });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 }, () => {
        console.log("callback3", this.state.number);
      });
      console.log(this.state.number);
    };
    render() {
      return (
        <div>
          {this.state.number}
          <button onClick={this.handleClick}>number++</button>
        </div>
      );
    }
  }

  // 0, 0, 0, callback1 1 ,callback2 1 ,callback3 1
  ```

  - 同步执行

  ```js
  setTimeout(() => {
    this.setState({ number: this.state.number + 1 }, () => {
      console.log("callback1", this.state.number);
    });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 }, () => {
      console.log("callback2", this.state.number);
    });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 }, () => {
      console.log("callback3", this.state.number);
    });
    console.log(this.state.number);
  });

  // callback1 1 , 1, callback2 2 , 2,callback3 3 , 3
  ```

  - 如何在如上异步环境下，继续开启批量更新模式呢？

    - React-Dom 中提供了批量更新方法 unstable_batchedUpdates，可以去手动批量更新，可以将上述 setTimeout 里面的内容做如下修改:

    ```js
    import ReactDOM from "react-dom";
    const { unstable_batchedUpdates } = ReactDOM;

    setTimeout(() => {
      unstable_batchedUpdates(() => {
        this.setState({ number: this.state.number + 1 });
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 });
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 });
        console.log(this.state.number);
      });
    });
    // 0 , 0 , 0 , callback1 1 , callback2 1 ,callback3 1
    ```

    - 那么如何提升更新优先级呢？
      - React-dom 提供了 flushSync ，flushSync 可以将回调函数中的更新任务，放在一个较高的优先级中。React 设定了很多不同优先级的更新任务。如果一次更新任务在 flushSync 回调函数内部，那么将获得一个较高优先级的更新。

    ```js
    handerClick=()=>{
    setTimeout(()=>{
        this.setState({ number: 1  })
        })
        this.setState({ number: 2  })
        ReactDOM.flushSync(()=>{
            this.setState({ number: 3  })
        })
        this.setState({ number: 4  })
    }
    render(){
      console.log(this.state.number)
      return ...
    }

    // 打印 3 4 1
    ```

    - 首先 flushSync this.setState({ number: 3 })设定了一个高优先级的更新，所以 2 和 3 被批量更新到 3 ，所以 3 先被打印。更新为 4。最后更新 setTimeout 中的 number = 1。
    - flushSync 补充说明：flushSync 在同步条件下，会合并之前的 setState | useState，可以理解成，如果发现了 flushSync ，就会先执行更新，如果之前有未更新的 setState ｜ useState ，就会一起合并了，所以就解释了如上，2 和 3 被批量更新到 3 ，所以 3 先被打印

  - 更新优先级
    - flushSync 中的 setState > 正常执行上下文中 setState > setTimeout ，Promise 中的 setState

### 函数组件中的 state

```js
[ ①state , ②dispatch ] = useState(③initData)

const [ number , setNumber ] = React.useState(0)

const [ number , setNumber ] = React.useState(()=>{
    /*  props 中 a = 1 state 为 0-1 随机数 ， a = 2 state 为 1 -10随机数 ， 否则，state 为 1 - 100 随机数   */
    if(props.a === 1) return Math.random()
    if(props.a === 2) return Math.ceil(Math.random() * 10 )
    return Math.ceil(Math.random() * 100 )
})
```

- ① state，目的提供给 UI ，作为渲染视图的数据源。
- ② dispatch 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。
- ③ initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

- 对于 dispatch 的参数,也有两种情况：

  - 第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;

  - 第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为 reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state

```js
const [number, setNumbsr] = React.useState(0);
/* 一个点击事件 */
const handleClick = () => {
  setNumber(1);
  setNumber(2);
  setNumber(3);
};

const [number, setNumbsr] = React.useState(0);
const handleClick = () => {
  setNumber((state) => state + 1); // state - > 0 + 1 = 1
  setNumber(8); // state - > 8
  setNumber((state) => state + 1); // state - > 8 + 1 = 9
};
```

### dispatch 更新特点

- 上述讲的批量更新和 flushSync ，在函数组件中，dispatch 更新效果和类组件是一样的，但是 useState 有一点值得注意，就是当调用改变 state 的函数 dispatch，在本次函数执行上下文中，是获取不到最新的 state 值的，把上述 demo 如下这么改：

```js
const [number, setNumber] = React.useState(0);
const handleClick = () => {
  ReactDOM.flushSync(() => {
    setNumber(2);
    console.log(number);
  });
  setNumber(1);
  console.log(number);
  setTimeout(() => {
    setNumber(3);
    console.log(number);
  });
};
// 0 0 0
```

- 原因

  - 函数组件更新就是函数的执行，在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新。所以在如上同一个函数执行上下文中，number 一直为 0，无论怎么打印，都拿不到最新的 state 。

- 但是 dispatch 传入一个函数的时候可以拿到最新的 state

```js
const [number, setNumber] = useState(0);

const handleClick = () => {
  ReactDOM.flushSync(() => {
    setNumber((state) => {
      console.log("flushSync", state); // 0
      return 2;
    });
  });
  setNumber((state) => {
    console.log("setNumber", state); // 2
    return 1;
  });
  setTimeout(() => {
    setNumber((state) => {
      console.log("setTimeout", state); // 1
      return 3;
    });
  });
};
```

### 类组件中的 setState 和函数组件中的 useState 有什么异同

- 相同点：首先从原理角度出发，setState 和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则

- 不同点
  - 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
