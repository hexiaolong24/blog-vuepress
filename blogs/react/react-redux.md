---
title: React-Redux
date: 2019-08-15
sidebar: 'auto'
categories:
 - React.js
tags:
 - React.js
---

##  作用

- 集中管理状态数据，用于给多个组件进行共享 

-	简化react的开发流程，并且降低组件之间的耦合度

##  编码理解

1.  先在`index.js`中引入`Provider`， 将`store`以标签属性的形式传给`Provider`组件，`provider`包裹了`App`就相当于整个组件都有了`store`对象

2.  拆分组件UI组件（`component`），UI组件中的组件首字母小写，容器组件（`container`）中的首字母大写，引入`connect`用于将UI组件包装成容器组件，相当于`connect`将普通UI组件与`Provider`相连接，让当前组件可以可以共享`store`对象，传递两个参数，第一个是函数，获取到`store`中的`state`对象，第二个是`action`方法，如果不涉及业务逻辑可以不写

3.  如果有容器组件，那么渲染时引入的必须是容器组件，如果还继续引入UI组件相当于拿不到`store`对象，相当于容器组件没有创建，不起任何作用

4.  之后在UI组件中以`this.props.xxx`的形式来使用，因为在`connect`包装成容器组件时已经注入，使用`state`时是`this.props.xxx`，使用`action`方法时也是`this.props.xxx`，`react-redux`底层帮我们调用了`this.props.store.disPatch`方法

5.  `store`的创建需要引入`createStore`,直接调用`createStore`（参数是`reducer`），作用是管理`state`对象，管理`reducer`

6.  `reducer`的本质是方法，初始化`store`中`state`的状态，帮助`store`对象修改`state`的状态值，`switch  case`的用法，里面设置具体的业务逻辑，需要注意的点是不能直接修改`state`对象，常用`[...state]`浅克隆一个新的`state`对象，第一个参数是`state`，利用形参默认值设置初始化的值，第二个参数是`action`对象。修改`state`的状态其实就是调用`reducer`方法，里面传的是一个`action`对象

7.  `action`本质是一个对象，定义的时候需要定义成方法，返回值是一个对象，这样可以传递数据进去，提供最新的数据，是`store`中`state`的唯一数据来源

##  原生redux

1.  `dispatch`的作用是分发`action`

- 传递`action`对象

- 间接导致`store`去`reducer`调用

2.	获取`state` 

```js
store.getState();
``` 

3.	监听`state`变化  

```js
store.subscribe(callback)
``` 

##  redux处理异步任务

1.  `Redux`本身不能处理异步任务

2.  需要使用中间键： `redux-thunk`

```js
npm install redux-thunk
```

3.  在创建`store`对象的时候声明使用中间键： 

```js
const store = createStore(counterReducer, applyMiddleware(thunk));
```

##  同步action和异步action定义方式

同步action： 

- 直接定义方法返回对应的`action`对象

异步action: 

- 核心思想： 异步`action`返回值还是一个函数，`redux`会自动将`dispatch`注入，什么时候分发`action`使用者说了算

```js
export const asyncIncrementAction = function (number) { 
  return dispatch => { // 处理异步行为： 发送ajax请求，开启定时器...
    setTimeout(() => { 
      dispatch(incrementAction(number)); 
    }, 2000) 
  } 
}
```

##  其他问题

1.  一个`reducer`通常只负责操作一个状态数据，如果有多组数据，需要创建多个`reducer`

2.  需要引入`import {combineReducers} from "redux"`

3.  暴露的时候这样暴露：`export default combineReducers({AReducer,BReducer})`，每一个`reducer`需要写成一个对象，取出的时候是`state.AReducer`和`state.BReducer`
