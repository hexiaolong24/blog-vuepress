---
title: Promise
date: 2018-10-12
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
- Promise
- 前端
---

##  promise是什么

- 抽象表达
Promise是JS中进行异步编程的新的解决方案

- 具体表达

1.  Promise 对象用于表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值
2.  一个 Promise 就是一个对象，它代表了一个异步操作的最终完成或者失败
3.  Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers），这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象

##  为什么用Promise

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  
  <script>
    /* 
    1). 指定回调函数的方式更加灵活: 
      旧的: 必须在启动异步任务前指定
      promise: 启动异步任务 => 返回promie对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定)

    2). 支持链式调用, 可以解决回调地狱问题
      什么是回调地狱? 回调函数嵌套调用, 外部回调函数异步执行的结果是嵌套的回调函数执行的条件
      回调地狱的缺点?  不便于阅读 / 不便于异常处理
      promise链式调用解决
      async/await终极解决方案
    */

    // 成功的回调函数
    function successCallback(result) {
      console.log("声音文件创建成功: " + result);
    }
    // 失败的回调函数
    function failureCallback(error) {
      console.log("声音文件创建失败: " + error);
    }

    /* 1.1 使用纯回调函数 */
    createAudioFileAsync(audioSettings, successCallback, failureCallback)

    /* 1.2. 使用Promise */
    const promise = createAudioFileAsync(audioSettings);
    promise.then(successCallback, failureCallback);

    /* 
    2.1. 回调地狱
     */
    doSomething(function(result) {
      doSomethingElse(result, function(newResult) {
        doThirdThing(newResult, function(finalResult) {
          console.log('Got the final result: ' + finalResult)
        }, failureCallback)
      }, failureCallback)
    }, failureCallback)

    /* 
    2.2. 使用promise的链式调用解决回调地狱
     */
    doSomething().then(function(result) {
      return doSomethingElse(result)
    })
    .then(function(newResult) {
      return doThirdThing(newResult)
    })
    .then(function(finalResult) {
      console.log('Got the final result: ' + finalResult)
    })
    .catch(failureCallback)

    /* 
    2.3. async/await: 回调地狱的终极解决方案
     */
    async function request() {
      try {
        const result = await doSomething()
        const newResult = await doSomethingElse(result)
        const finalResult = await doThirdThing(newResult)
        console.log('Got the final result: ' + finalResult)
      } catch (error) {
        failureCallback(error)
      }    
    }
  </script>
</body>
</html>
```

### 关于then方法的理解

```js
// then()返回的promise的结果由then()指定回调函数执行的结果决定
//     什么是一个失败的promise?
//         throw error  ===> reason是error
//         return 失败的promise  ==> reason是返回的promise的失败reason
//     其它情况都是成功的promise
//         return xxxx  ==> value是xxx
//         return 成功的promise  ==> value是返回的promise的成功value

//   then()返回的promise到底是进入下一个成功的回调还是失败的回调与你现在在成功的
//   回调还是在失败的回调没有关系
new Promise((resolve, reject) => { // 在Promise内部会同步执行executor函数
  resolve(1)//进入成功的回调
  // reject(2) 进入失败的回调
}).then(
  value => {
    console.log('onResolved()', value)
    // return undefined 进入成功的回调
    // return 3 进入成功的回调
    // throw 4 进入失败的回调
    return new Promise((resolve, reject) => {
      // resolve(5) 进入成功的回调
    //  reject(6) 进入失败的回调
    })
  },
  reason => {
    console.log('onRejected()', reason)
    // return undefined 进入成功的回调
    // return 3 进入成功的回调
    // throw 4 进入失败的回调
    return new Promise((resolve, reject) => {
      // resolve(5) 进入成功的回调
    //  reject(6) 进入失败的回调
    })
  },
).then(
  value => {
    console.log('onResolved()2', value)
  },
  reason => {
    console.log('onRejected()2', reason)
  }
)
```

### 关于all和race方法的理解

```js
const p1 = Promise.resolve(3)//进入成功的回调
const p2 = Promise.resolve(Promise.resolve(5))//进入成功的回调
const p3 = Promise.reject(6)//进入失败的回调
    
//all方法要传入一个数组，里边是promise，也可以是普通的值，也会作为成功的回调传到最终的结果中，
//只要有一个失败的就会直接进入失败的回调，
// Promise.all([p1, 'abc', p3, p2]).then(
Promise.all([p1, 'abc', p2]).then(
  values => {
    console.log('onResolved()', values)//成功的回调中的结果是和传入时的顺序相关的，并不是和执行的顺序相关
  },
  reason => {
    console.log('onRejected()', reason)
  }
)

// race竞赛的意思，第一个是成功直接进入成功的，第一个是失败的直接进入失败的
Promise.race([p1, 'abc', p2]).then(
  value => {
    console.log('onResolved2()', value)
  },
  reason => {
    console.log('onRejected2()', reason)
  }
)
```

# 1. 相关API/概念
## 1). Promise: 许诺  
    用来创建promise对象的构造函数: function Promise (excutor) {}
    简洁描述: 一个promise对象用来表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值
    详细描述: Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时是未知的。
        它允许你为异步操作的成功和失败分别绑定相应的处理回调函数
        这让异步方法可以像同步方法那样返回，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象
    promise对象的3种状态值
        pending(未决定的): 初始状态，既不是成功，也不是失败状态。
        resolved/fulfilled(完成的): 意味着操作成功完成。  
        rejected(拒绝的): 意味着操作失败。
    promise对象的状态变化(2种)
        pending ==> resolved: 调用resolve()
        pending ==> rejected: 调用reject()
        注意: promise的状态确定后就不可再转换为其它状态
    promise对象内部隐藏的属性
        [[PromiseStatus]]: 内部变量, 存储promise对象当前的状态值
        [[PromiseValue]]: 内部变量, 存储成功后的value或失败后的reason

## 2). excutor: 执行器
    executor是带有 resolve 和 reject 两个参数的函数: (resolve, reject) => {}
    由我们定义, 在new Promise()内部会立即同步调用 executor 函数(不是我们调用的)
    异步操作的代码应该在此函数中执行, 一般成功后调用resolve(), 失败后调用reject()

## 3). resolve: 解决
    由Promise函数内部定义, 但由我们调用的函数
    当异步任务成功时, 我们应该调用resolve函数, 并传入需要的value
    resolve函数内部: 
        同步修改promise对象的状态为resolved和保存成功value, 
        异步执行已经存储的所有onResolved回调函数
    
## 4). reject: 拒绝
    由Promise函数内部定义, 但由我们调用的函数
    当异步任务失败/抛出error时, 我们应该调用reject函数, 并传入需要的reason
    reject函数内部: 
        同步修改promise对象的状态为rejected和保存失败reason
        异步调用经存储的所已有onRejected回调函数
    
## 5). then: 接着
    promise对象的方法: then(onRsolved函数, onRejected函数), 返回值为一个新的promise对象
    作用: 用来指定promise的状态为resolved或rejected时的回调函数
    注意: 
        then()方法的返回值为新的promise对象, 这样可以进行.then()的链式调用
        返回的promise的结果状态和值由回调函数的执行结果决定
            返回promise: 将返回promise的结果值作为then()返回promise的结果
            返回其它: 成功, 值为返回的结果
            抛出异常:  失败, 值为抛出的数据

## 6). onResolved: 当已解决时
    由then()的第一个参数指定的回调函数: (value) => {}
    当promise的状态为resolved时自动异步调用
    onResolved函数的返回值:
        新的promise对象
        其它或不返回
        
## 7). onRejected: 当已拒绝时
    由then()的第二个参数或catch()指定的回调函数: (reason) => {}
    当promise的状态为rejected时自动异步调用
    onRejected函数的返回值:
        新的promise对象
        其它或不返回
        
## 8). catch: 捕获
    promise对象的方法: catch(onRejected函数)
    是then()的语法糖方法, 相当于: then(null, onRejected函数)
    
## 9). Promise.resolve(value)
    手动创建一个已经resolve的promise的快捷方法: Promise.resolve(value/promise)
    如果参数为promise: 读取此promise结果值作为返回promise的结果值
    例如：
    Promise.resolve(value)成功的回调
    Promise.resolve(Promise.resolve(value))成功的回调
    Promise.resolve(Promise.reject(value))失败的回调
    
    
## 10). Promise.reject(reason)
    手动创建一个已经reject的promise的快捷方法: Promise.reject(reason)
    只能是失败的回调

## 11). Promise.all([p1, p2, p3])
    用来实现批量执行多个promise的异步操作, 返回一个新的promise: Promise.all([promise1, promise2, ...])
    只有当所有异步操作都resolved后, 返回的promise才会变为resolved状态, 只要有一个变为rejected, 返回的promise直接变为rejected
    面试题: 实现一次发多个请求, 只有都成功后才去做处理?
## 12）.Promise.race()
    竞赛的意思，看第一个返回的promise是成功的还是失败的
## 13) .错误透传/中断promise链
    错误透传就是一直.then的时候一直传入的是成功的回调，直到最后才指定了一个失败的回调，这样也能在最后接收到这个错误的信息，这是因为内部，会设置成功的回调和失败的回调的默认值
    onResolved : value => value
    onRejected : reason => {throw reason}
    中断Promise链就是返回一个padding状态的promise
# 2. 自定义Promise
## 1). 整体结构
    function Promise (excutor) {}
    Promise.prototype.then = function (onResolved, onRejected) {}
    Promise.prototype.catch = function (onRejected) {}
    Promise.resolve = function (value) {}
    Promise.reject = function (reason) {}
    Promise.all = function (promises) {}
    Promise.race = function (promises) {}
    
## 2). Promise构造函数的实现
    初始化对象的属性:
        status: 'pending' 对象的状态(resolved/rejected)
        data: undefined  成功/失败的数据
        callbacks: []  用来保存待执行的成功和失败的回调函数  {onResolved(value){}, onRejected(reason){}}
    定义2个函数
        function resolve (value) {}
        function reject (reason) {}
    立即同步执行excutor(resolve, reject)
        使用try...catch捕获异常, 执行: reject(error)
    resolve函数实现
        立即同步指定成功的状态: status: 'resolved'
        立即同步指定成功的数据: data: value
        立即异步执行callbacks中包含所有待执行onResolved函数
    reject函数的实现
        立即同步指定成功的状态: status: 'rejected'
        立即同步指定成功的数据: data: reason
        立即异步执行callbacks中包含所有待执行onRejected函数
        
## 3). promise.then(onResolved, onRejected)的实现
    1). 返回一个新的promise对象
    2). 处理onResolved/onRejected 2个回调函数, 并根据它们执行的结果来指定返回的promise的结果
        1). resolved
            a. 立即异步调用onResolved(p.data)
            b. 根据它们执行的结果来指定返回的promise的结果
                1). 抛出了异常, 返回的promise就失败了, reason是error  reject(error)
                2). 结果是非promise值, 返回的promise就成功了, value是结果值   resolve(result)
                3). 结果是promise, 将这个promise的结果直接传递给返回的promise    result.then(resolve, reject)
        2). rejected
            a. 立即异步调用onRejected(p.data)
            b. 根据它们执行的结果来指定返回的promise的结果
        3). pending
            a. 将onResolved和onRejected保存到p的callbacks中
            b. 当回调函数调用时, 根据它们执行的结果来指定返回的promise的结果

## 4). catch()的实现
    调用then()只指定失败的回调函数: then(null, onRejected)

## 5). Promise.resolve(value/promise)的实现
    1). 创建一个新的promise对象返回
    2). 在执行器内
        如果参数是promise, 将promise的结果传递给返回的promise对象
        如果参数不是promise, 直接resolve(value)

## 6). Promise.rejected(reason)的实现
    1). 创建一个新的promise对象返回
    2). 在执行器内通过执行reject(reason)

## 7). Promise.resolveDelay()与Promise.rejectdelay()的实现
    在对应的实现上指定延迟指定时间后才去确定返回promise的结果

## 8). Promise.all(promises)的实现
    需求: 一次发多个异步ajax请求, 只有当所有请求都成功, 来进行界面的正常处理, 只要有一个失败, 就直接进行错误
    1). 创建一个新的promise对象并返回
    2). 在执行器内遍历所有promises, 并得到每个promise的结果
    3). 如果有一个结果为失败, 直接reject(reason)
    4). 如果当前promise成功了, 保存value到数组values中对应的位置
    5). 只有当所有promise都成功了, resolve(values)

## 9). Promise.race(promises)的实现
    需求: 一次发多个异步ajax请求, 只有有一个请求返回了(成功或失败), 后续处理就可以进行了, 其它请求忽略
    1). 创建一个新的promise对象并返回
    2). 在执行器内遍历所有promises, 并指定每个promise的onResolved与onRejected
    3). 如果有一个结果为失败, 直接reject(reason)
    3). 如果有一个结果为成功, 直接resolve(value)
