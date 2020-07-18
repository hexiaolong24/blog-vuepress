---
title: React
date: 2019-08-15
sidebar: 'auto'
categories:
 - React.js
tags:
 - React.js
 - 前端
 - 框架
---

##  react的理解

- react是用于动态构建用户界面的js库，由Facebook开源

- Declarative ，react是声明式的编码，相对的是命令式的

- Component-Based 组件化

- Learn Once, Write Anywhere(React Native/支持客户端与服务器渲染)

- 高效
  - 虚拟DOM，不总是直接操作DOM(批量更新，减少更新的次数)

  - DOM Diff算法，最小化页面重绘(减小页面更新的区域)

- 单向数据流

##  创建虚拟DOM

- 原生js语法 React.createElement('标签名',{"属性"："属性值"}，"内容")

- JSX
  - react定义的一种类似于XML的JS扩展语法：XML+JS
  - 作用：用来创建虚拟DOM对象
  - 规则：遇到<开头的代码以标签的语法解析，必须小写，大写就会以组件来解析，遇到{开头，以JS语法解析，标签中的js表达式必须用{}包含

##  函数组件

```js
function MyComponent() {
	//console.log(this) //此处的this是undefined，因为经过babel贬义后，开启了严格模式，严格模式中禁止this指向window
    return <h1>哈哈</h1>
}
```

函数组件不会被实例化，不会产生组件对象（创建没必要的实例对象是对性能的优化）

没有自身的生命周期钩子和状态(函数没有生命周期，在加载上也会块一点)


## 类的方式创建组件

组件不是静态的，组件又叫状态机，组件时刻有自己的状态

使用场景

- 组件有不同的状态
- 需要异步获取数据
- 需要在不同的加载阶段显示不同的内容

##  state

组件实例对象的state属性默认值是null

1. 添加方式

   - constructor: this.state = {}
   -  class类对象中直接定义: state = {}
   - 通过setState去间接的定义state属性

2. 修改state只能用this.setState

   - 修改state对象的状态值
   - 触发页面update()，重新render()
   - 通过this.state.data = '123'这种方式修改state，用react插件可以看到state确实是变了，但是不会触发页面update()，重新render()
   - 如果state中的属性的属性值是对象或者数组，修改的时候不能用解构赋值的方式取出来直接修改，需要let haha = [...this.state.haha],浅拷贝一下，如果你之后不setState,只是用于展示，那就不必要这样，可以直接解构赋值取出，原因是如果你使用的是PureComponent,如果不这样浅拷贝的话当前组件不会监听到state的变化，不会重新render，因为PureComponent的原理是对新旧state和props中的数据进行浅拷贝，引出Component,和PureComponent的区别

3. 关于setState()

   - 两种写法

   ```js
   this.setState((state,props) => {},callback)
   //callback在状态数据更新，且界面更新之后立即执行
   //如果需要在setState()后获取最新的state，在函数方式的第二个参数callback中读取
   this.setState({xxx:"yyy"})
   //对象方式是函数方式的简写方式，
   //如果新状态不依赖原状态，使用对象方式
   //如果新状态依赖于原状态，使用函数方式
   ```

   - setState()是同步的还是异步的

     - 在react控制的回调函数中：生命周期函数，react事件监听回调中是异步的
     - 在非react控制的异步回调函数中：定时器回调，原生事件监听回调，promise回调中是同步的
- 关于异步的setState()多次调用如何处理

     - setState({})：合并更新一次状态，只调用一次render()更新界面，状态更新和界面更新都合并了
     - setState(fn)：更新多次状态，但只调用一次render()更新界面，状态更新没有合并，但界面更新合并了 

## 关于this

- 在react中，用ES6这种形式定义组件，react底层将所有程序员自定义的方法中的this全部修改为undefined，react自带的方法中的this是组件的实例对象

## Props

- ```js
  import PropTypes from 'prop-types'
  //需要引入新的文件，申明接受的参数
  static propTypes = {
  	name:PropTypes.string.isRequired
  }
  //设置参数默认值
  static defaultProps = {
      age : 18
  }
  ```

  - 父传子通过标签属性的形式传参，如果是基本数据类型，只读不能修改

  ```js
  this.props.name = "wade"//错误，不能直接修改，会报错
  ```

  - 但是如果是引用数据类型，对象、函数，其实是可以修改的，因为引用数据类型传过来的是引用地址，这样修改完其实父组件中state也会变，因为指向同一块堆空间中的地址，但是不建议这样，因为父组件中的数据有可能是多个组件同时在使用，而且这种修改也不会受到监听，所以我们还是要按照数据在哪里，就在哪里更新的原则来操作

  ```js
  //props传参的形式
  name = "kobe"
  name = {person.name}
  {...person}//其实最外层应该再包一个大括号，因为遇到js代码就要包一个大括号，同时...作用于对象的时候，外层就应该包一个，不能直接写，这是react和babel帮我们做了
  ```

## refs属性

- 添加方式

  ```js
  //保存在refs属性中，属性值是一个对象，有多个key-value
  <input type="text" ref="input1" />
  let {input1} = this.refs
  
  //第二种写法
  <input type="text" ref={input => {this.input1=input}} />
  let {input1} = this
  
  //第三种写法
  myRef = React.createRef()
  <input type="text" ref={this.myRef} />
  let input1 = this.myRef.current
  ```

## 区别三大属性

- state：值为容器对象，保存的是组件内可变的数据，组件根据state中的数据显示，要更新界面只要更新state即可，
- props：值为容器对象，保存的是组件从外部接受过来的数据，当前组件只读，如果父组件修改了自动显示最新的数据
- refs：值为容器对象，保存的是n个有ref属性的dom元素对象，属性名是ref指定的标识名称，值是对应的dom元素，设置方式不同，获取的方式也不同

## 生命周期函数（钩子）

1. 初始化

   - 触发条件：ReactDOM.render()
   - constructor(){}创建组件对象的初始化方法，断点如果在这里不主动添加state，不会有state属性
   - **即将过时**componentWillMount(){} 组件即将被挂载，渲染到页面上，到这一步，添加了state，值为null
   - render(){}提供虚拟DOM，可能会调用多次（n+1）
   - componentDidMount(){}:进行异步操作，比如启动定时器，发送异步请求，只执行一次

2. 更新

   - 触发条件：this.setState({})
   - **即将过时**componentWillUpdate(){}
   - render(){}
   - componentDidUpdate(){}

3. 卸载

   - 触发条件：ReactDOM.unmountComponentAtNode()，销毁组件实例对象，释放内存，将之前放入页面的DOM对象从HTML页面中移除
   - componentWillUnmount(){}：清除定时器，只执行一次

4. 性能优化

   ```js
   shouldComponentUpdata(nextProps,nextState){
   //最新的props和最新的state
   	return false //返回false，不会更新界面
   	return true //默认返回true，更新界面
   }
   
   
   **即将过时**
   //父组件重新render，子组件props改变
   componentWillReceiveProps(nextProps){
       this.props //上一次的props
       nextProps //最新的props
   }
   ```

   - 关于component和PureComponent 
     - Component存在的问题
       - 当前组件自己setState({})，会重新执行render，即使state没有变化
       - 父组件重新render，子组件也会重新render，即使接收的参数没有任何变化
     - 解决Component存在的问题
       - 原因：组件的shouldComponentUpdate()默认返回true，即使数据没有任何变化，render也会重新执行
       - 办法1：重写shouldComponentUpdate(){}
       - 办法2：使用PureComponent来优化组件性能
       - 说明：一般都是用PureComponent来优化组件性能
     - PureComponent的原理
       - 重写shouldComponentUpdate(){}
       - 对组件的新旧state和props中的数据进行浅比较，如果都没有变化，返回false，否则返回true
       - 一旦shouldComponentUpdate返回false，不再执行render

5. 注意点

   - 尽量不要在componentWillMount中发送请求或者添加运算量特别大的代码片段，会导致首屏加载时间过长，用户体验差

   - componentWillMount: 在第一次render()前调用一次, 为第一次render()准备数据(同步)
   -  componentDidMount: 在第一次render()之后调用一次, 启动异步任务, 后面异步更新状态重新render

## React组件化编码的三个步骤和两个重要问题

- 拆分组件

- 实现静态页面

- 实现动态页面
  - 状态数据在哪个组件保存？哪个组件需要在哪个保存，如果多个都需要在父组件中
  - 状态在哪，更新状态的行为就定义在哪

## React中的组件间通信的4种方式

1. 通过props传递

   - 父传子：通过标签属性的方式传递，子组件通过this.props.xxx来接受
   - 子传父：在父组件中定义一个函数，通过标签属性的方式传递给子组件，子组件通过调用函数的方式，将父组件所需要的数据以实参的方式传递给父组件
   - 缺点：只能一层一层传递，如果是兄弟组件之间传递，必须先传给父组件，不能直接传递，适合父子之间的通信

2. 使用消息订阅与发布机制（pubsub-js）

   ```js
   //订阅消息,一般在componentDidMount中先订阅消息
   this.token=Pubsub.subscribe("msg",(msg,data) => {
   	
   })
   //发布消息,什么时候需要传递什么时候发布消息
   Pubsub.publish("msg",data)
   //解绑
   Pubsub.unsubscribe(this.token)
   Pubsub.unsubscribe("msg")
   Pubsub.clearAllsubscriptions()
   ```

   - 自定义Pubsub

   ```js
   //整体结构
   message = {
       msg1: {
           token1：fun1
           token2: fun2
       },
       msg2: {
           token1：fun1
           token2: fun2
       }
   }
   //自定义实现
   ((w)=>{
   
     var message = {} // 事件总线对象
     var MyPubSub = {}; // 向外暴露的操作对象
     var num = 1
   // 订阅方法
     function subscribe(msg, func) {
       // 1. 验证回调的有效性
       if(!typeof func === 'function'){
         return;
       }
       // 2. 判断之前是否定义过msg事件
       if(!message.hasOwnProperty(msg)){
         message[msg] = {};
       }
   
       // 3. 生成唯一标识字段
   
       num++
       var token = num+''
       // 4. 将自定事件对应的回调和自定义事件名
       message[msg][token] = func
       return token
     }
   
   // 发布消息的方法
     function publish(msg, data) {
       // 1. 找到事件名
       if(!message[msg]){
           return
       }else {
           let obj = message[msg]
       }
       let func;
       // 遍历取出自定义事件额回调
       for(var s in obj){
         func = obj[s]
         // 调用自定义事件的回调
         func(msg, data);
       }
   
     }
   
   // 将方法统一添加到暴露对象中： MyPubSub
     MyPubSub.subscribe = subscribe;
     MyPubSub.publish = publish;
     w.MyPubSub=MyPubSub
   })(window)
   
   // 向外暴露
   // export default MyPubSub;
   ```

​	3. redux

- 通过redux可以实现任意组件间的通信
- 集中式管理多个组件共享的状态

4.ref通信（子传父）

- 先在子组件中定义好方法，在父组件中给子组件设置ref属性，找到子组件，然后调用子组件提前定义好的方法，什么时候需要数据，什么时候调用子组件中的函数
- 区别ref子传父和props子传父
  - ref子传父是子组件提前定义好，父组件主动调用
  - props是子组件主动传递，父组件被动接受

## 谈谈react-router的理解

- 路由器

```js
//路由器：管理路由地址请求，分发路由
import {BrowserRouter,HashRouter} from 'react-router-dom'
//BrowserRouter操控的是浏览器对象
//HashRouter有#，操控的是哈希值URL
ReactDOM.render(
    <HashRouter>
        <App/>
    </HashRouter>
    ,document.getElementById('root'))
```

- 路由和路由链接

```js
import { Link,NavLink,Route,Redirect,Switch } from "react-router-dom"
//Link和NavLink的区别，NavLink可以自定义选中的样式，类名是activeClassName
<NavLink to="/about">About</NavLink>
//写在Switch中匹配好一个路由就会停止，如果不加会继续查找，效率高

<Switch>
    <Route path='/about' component={About}/>
    <Route path='/home' component={Home}/>
    <Redirect from="/fff" to='/home'/>
        //重定向，自动跳转到to后面的路由地址，如果有from，必须在from的地址基础上才能重定向，而且from必须在Switch中才起作用，重定向一般都放在最后使用
</Switch>
//默认是模糊查找只要"/",如果输入"/home",会显示两个，加上exact就是精准查找，就像数组中也有效率高的方法也有效率低的方法，比如find,findIndex等等这些方法找到一个满足条件的就会返回对应的结果，不会一直遍历下去，而forEach等方法就会一直遍历下去
//精准查找也有弊端，比如下面这个一级路由用到了精确查找，那么久不会跳转到二级路由，原因就是一级路由的精确查找无法满足，所以根本跳不到二级路由
<Route exact path='/about' component={About}/>
<Route path='/about/detail' component={Detail}/>//二级路由
```

- react-router-dom是react一个专门用来实现SPA应用的插件库

- SPA就是单页面应用(single page web application),整个应用只有一个完整的页面,点击页面中的链接不会刷新页面, 本身也不会向服务器发请求,当点击路由链接时, 只会做页面的局部更新,数据通过ajax请求获取，并在前端页面异步展现

- 对于路由的理解

  - 一个路由就是一个映射关系（key:value）
  - key为路由路径，value可能是function/component

- 路由的分类

  - 后台路由: node服务器端路由, value是function, 用来处理客户端提交的请求并返回一个响应数据
  - 前台路由: 浏览器端路由, value是component, 当请求的是路由path时, 浏览器端前没有发送http请求, 但界面会更新显示对应的组件

- history API

  a. History.createBrowserHistory(): 得到封装window.history的管理对象

  b. History.createHashHistory(): 得到封装window.location.hash的管理对象

  c. history.push(): 添加一个新的历史记录

  d. history.replace(): 用一个新的历史记录替换当前的记录

  e. history.goBack(): 回退到上一个历史记录

  f. history.goForword(): 前进到下一个历史记录

  g. history.listen(function(location){}): 监视历史记录的变化

## 路由传参

- params传参,是在请求路由的时候传入的，在当前页面也能给自己传参

  ```js
  //1 注册路由
  <Route path='路由路径/:key' component={路由组件}/>
  //2 请求路由
  <Link to="路由路径/value"/>
  //3 组件内部获取
  this.props.match.params.key = value
  
  ```
- query传参,是在请求路由的时候传入的，前提是必须由其他页面跳转过来，在当前页面不起作用

  ```js
  //1 注册路由
  <Route path='路由路径' component={路由组件}/>
  //2 请求路由
  this.props.history.push({ pathname : '路由路径' ,query : {参数对象} })
  <Link to={{pathname:'路由路径',query:{参数对象}}}/>
  //3 组件内部获取
  this.props.location.query
  
  
  ```
- state传参,在当前页面也能给自己传参，而且state传的参数是加密的，query传的参数是公开的，在地址栏

  ```js
  //1 注册路由
  <Route path='路由路径' component={路由组件}/>
  //2 请求路由
  this.props.history.push({ pathname : '路由路径' ,state : {参数对象} })
  <Link to={{pathname:'路由路径',state:{参数对象}}}/>
  //3 组件内部获取
  this.props.location.state
  
  
  ```

- props传参，是在注册路由的时候通过标签属性的形式来传递的

  ```js
  //1 注册路由
  <Route path='路由路径' render={() => <路由组件 key="">} />
  //2 请求路由
  <Link to="路由路径"/>
  //3 组件内部获取
  this.props.key = value
  ```

- 如果是BrowserRouter,可以通过这种方式，作为第二个参数，传给跳转到的组件,注意HashRouter不可以这样传递

  ```js
  this.props.history.push("/product/add",product)
  const product = this.props.location.state
  ```

  



## 编程式导航

```
this.props.history.push(path)
this.props.history.replace(path)
this.props.history.goBack()
```

## 高阶函数和高阶组件

- 高阶函数
  - 接受的参数是函数或者返回值是函数
  - 常见的：数组遍历的相关方法/定时器/bind/promise/From.create()(组件)
  - 作用：实现一个更加强大，动态的功能
- 高阶组件
  - 本质是一个函数，函数接受一个组件，返回一个新的组件
  - 常见的高阶组件：Form.create()(组件) 返回一个props中包含from属性的新的组件     connect()(ui组件) 返回容器组件

## 补充

- 开发环境命令 npm start
  - 在内存中打包，生成内存中的打包文件
  - 启动服务器，运行内存中的打包文件
- 生产环境打包并运行，命令npm  run  build    serve  build
  - 在内存中打包，生成内存中的打包文件
  - 将内存中的打包文件保存到本地
  - 加载本地打包文件到内存
  - 启动服务器运行，在浏览器中通过虚拟地址来访问得到的相应资源

```js
import { withRouter } from 'react-router-dom'
//所有路由组件的props中都有location、history、match这三个属性，普通UI组件使用withRouter包一下就会得到路由组件的三个属性，location、history、match

const path = this.props.location.pathname//当前浏览器的路由地址

```

## 区别UI组件和容器组件

- react-redux提出的
- UI组件：只负责界面的显示，不会使用redux相关语法
- 容器组件：包装UI组件，向UI组件提供状态数据和更新状态数据的行为，通过connect连接UI组件和redux

## 区别react中的事件和原生DOM事件

- 为了解决跨浏览器的兼容性问题，React将浏览器原生事件封装为合成事件
- React并没有直接将事件绑定到子元素上，而是将事件绑定在了组件的根元素上，使用（事件委托）

## 事件委托

1. 什么是事件委托
   1. 将子元素的事件委托(绑定)给父元素
2. 事件委托的好处
   1. 减少绑定的次数
   2. 提高性能
   3. 新添加的子元素也能享用之前绑定的事件
3. 事件委托的原理
   1. 冒泡
4. 触发事件的是谁
   1. 子元素
5. 如何找到触发事件的子元素
   1. event.targe

## 受控组件

- 组件中的表单项能在输入过程中自动收集输入数据到状态中，给表单项绑定onChange监听，在回调函数中通过setState实现

## 谈谈你对redux的理解

- 首先redux是一个独立专门用于做状态管理的JS库（并不是react插件库）

- 可以与任何前端库配合使用，但最合适的是react

- 作用，集中管理react应用中多个组件共享的状态，简化react的开发流程，并且降低组件之间的耦合度

- store

  - 管理state，唯一的数据源是action
  - 管理reducer

- reducer

  - reducer服务于store对象，为store对象提供初始化state的状态值

  - 根据老的state和action来产生返回一个新的state

  - reducer的本质是方法，初始化store中state的状态，帮助**store**对象修改**state**的状态值，**switch和case的用法，里面设置具体的业务逻辑，需要注意的点是不能直接修改**state对象，常用[...state]**浅克隆一个新的**state对象，第一个参数是state，利用形参默认值设置初始化的值，第二个参数是action对象。修改state的状态其实就是调用reducer方法，里面传的是一个action对象

  - 一个reducer通常只负责操作一个状态数据，如果有多组数据，需要创建多个reducer，

    ```JS
    import {combineReducers} from "redux"
    export default combineReducers({AReducer,AReducer})
    ```

- action

  - action本质是一个对象，定义的时候需要定义成方法，返回值是一个对象，这样可以传递数据进去，提供最新的数据，是store中state的唯一数据来源

    

  - 异步action

    - 异步action: 核心思想： 异步action返回值还是一个函数，redux会自动将dispatch注入，什么时候分发action使用者说了算

- action-type

  - 包含多个同步action的type名称常量

  

  ## redux编码

  ```js
  //创建store
  import {createStore, applyMiddleware} from 'redux'
  import thunk from 'redux-thunk'//异步action
  import {composeWithDevTools} from 'redux-devtools-extension'
  //redux开发者工具
  import counterReducer from './reducers'
  //创建store对象，申明使用redux开发者工具，redux本身不能处理异步任务，在创建store的时候申明使用中间件处理异步任务
  const store = createStore(counterReducer, composeWithDevTools(applyMiddleware(thunk)));
  
  //reducer
  import {
    combineReducers
  } from 'redux'
  import {
    HEADER_TITLE,
    USER_MSG,
    USER_ERROR,
    USER_REMOVE
  } from './action-types'
  //第一个
  const uiniState = '首页'
  function headerTitle(state = uiniState, action) {
    switch (action.type) {
      case HEADER_TITLE:
        return action.data
      default:
        return state
    }
  }
  //第二个
  function userMsg(state = user, action) {
    switch (action.type) {
      case USER_MSG:
        return action.data
      case USER_REMOVE:
        return {}
      default:
        return state
    }
  }
  export default combineReducers({
    headerTitle,
    userMsg
  })
  
  //action
  //异步action,返回一个函数，自动注入dispatch
  export const incrementAction = (number) => ({type: 'increment', data: number})
  //需要data就设置，不需要就不需要设置，比如要清空state中的某一个状态数据
  
  export const userMsgAction =  (user) => {
    return async dispath => {
      const result = await reqLogin(user)
      if (result.status === 0) {
        dispath(userLoginAction(result.data))
        message.success('登录成功')
        setUser(result.data)
      } else {
        message.error(result.msg)
      }
    }
  }
  ```

  - 原生redux编码

  ```js
  //原生redux引入store对象的编码
  // 渲染整个应用
  ReactDOM.render((
      <App store={store}/>
  ), document.getElementById('root'));
  
  // 监听store对象发生变化
  store.subscribe(() => {
    console.log('我监听到你变化了。。。');
    ReactDOM.render((
      <App store={store}/>
    ), document.getElementById('root'));
  })
  
  //获取store
  this.props.store.getState()
  //分发action
  //dispatch做了什么
  //1 传递action对象
  //2 间接导致store去reducer调用
  this.props.store.dispatch(action)
  ```

  - react-redux编码

  ```js
  //react-redux引入store对象
  import store from '../src/redux/store'
  import { Provider } from 'react-redux'
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>
  ,document.getElementById('root'))
  
  //包装UI组件成为容器组件
  import { connect } from 'react-redux'
  import { removeUserAction } from '../../redux/actions'
  export default connect(
    state => ({title:state.headerTitle,user:state.userMsg}),
    { removeUserAction }
  )(Header)
  
  //在UI组件中使用state和调用action
  this.props.user.username
  this.props.title
  this.props.removeUserAction()
  ```


## React中的虚拟DOM diff算法（different)

- 理解dom树
- React将真实的DOM树映射出一颗虚拟DOM树
- 每次setState时产生一颗新的虚拟DOM树
- 将新树和老树去对比，找出变化的部分，局部渲染变化的部分
- 实现的效果：最小化页面重绘
- 提高性能

## React中遍历生成多个个体（item）时，添加key属性的作用

- key是当前个体的唯一标识
- 当数据发生改变时，就是通过对应的key去比较
- 对比过程有以下几种情况
  - key没有变化
    - 对应的item数据也没有变化，直接使用原来的真实DOM
    - 对应的item数据变化，对原来的真实的DOM进行数据更新
  - key变了
    - 原key变化，销毁原来的真实的DOM，根据item数据创建新的虚拟DOM，随后渲染真实的DOM到页面（即使item数据没有变化）
    - 新key产生，根据item数据创建新的虚拟DOM，随后渲染真实DOM到页面
- key是index的问题
  - 添加删除排序---导致index变化---产生没有必要的真实DOM的更新，界面效果没有问题，但是效率低
  - 如果item界面还有输入框---产生错误的真实DOM更新，界面有问题，比如一个列表，每一项中都有一个input输入框，里面有相对应的内容，如果用index作为key，在最前面添加了新的item，这时index就会全部重新排一次，此时原来的第一项变成了第二项，但是input会成为新添加的item的，因为他会找到他原来对应的key,原来是0，现在也会去找0，所以页面展示会有问题
  - 但其实如果仅仅是作为页面的额展示，其实是没有问题的

## 自定义封装组件

- 直接在标签中间写文本（也可以添加标签内容），会自动添加到this.props.children中
- 显示的时候相当于将{ this.props.children }放在了自定义组件的中间

```js
//创建时
function MyNavLink(props){
	return <NavLink {...this.props}></NavLink>
}

//调用时
<MyNavLink to="/home">Home</MyNavLink>
```





