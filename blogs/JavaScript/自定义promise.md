---
title: 自定义Promise
date: 2018-08-22
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
- Promise
- 前端
---

### 思路

1.  首先我们知道在new Promise的时候需要传入一个执行器函数(excutor)，这个执行器函数内部接受两个参数，resolve和reject，这两个参数也是两个函数，这个执行器函数是立即同步执行的，而resolve和reject这个两个函数是需要我们自己根据逻辑调用的，并且自己传入需要的数据

2.  其实在Promise的内部有两个属性我们可以通过Chrome开发者工具看到，[[PromiseStatus]]存储promise对象当前的状态值，[[PromiseValue]]存储promise对象成功后的value或者失败后的reason，但其实还有一个属性需要存储通过.then方法传入的成功的回调和失败的回调，这里我们称作Onresolved和Onrejected

3.  所以在Promise 的内部我们需要定义三个属性，简化为status，data，callbacks，进入resolve方法和reject方法的前提是status是padding，这是因为promise的状态只能改变一次，是不可逆的，同时可以确保.then传进来的回调函数只执行一次，避免重复执行，这就和promise的一个优点联系起来了 promise: 启动异步任务 => 返回promie对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定)，稍后阐述then方法的时候会详细说明，在resolve中将status改为resolved，保存我们调用resolve传入的value到data中，遍历callbacks属性，取出所有待调用的成功的回调，异步调用它们，在reject中将status改为rejected，保存错误的reason到data中，遍历callbacks属性，取出待调用的失败的回调（只有一个），异步调用，如果在执行执行器函数的过程中失败了，直接调用reject()

4.  Promise.prototype.then方法需要指定成功的回调和失败的回调，首先我们知道promise之所以可以实现链式调用是因为，then方法也会返回一个promise对象，所以最外层一定是一个return new Promise()我们需要依据Onresolved和Onrejected的返回值来确定这个下一个promise的状态，

5.  首先判断当前promise的status状态，如果是padding，说明是先指定了成功或者失败的回调函数，后产生的结果，所以需要将成功或者失败的回调保存到callbacks中，保存的形式是以对象的形式来保存，成功的回调是Onresolved，失败的回调是Onrejected，这样保存在callbacks中，什么时候status的状态改变了，就会去调用，所以在上面提到进入resolve方法和reject方法的前提是status必须是padding，确保你一开始就没有调用过，在最外层包了new Promise()所以在调用的时候一定要指定了这个promise的结果，一共有三种情况，
- 第一种如果传入的Onresolved的或者Onrejected的返回值是一个promise，分为成功，失败，padding，成功的话那么下一个.then进入成功的回调，失败的话进入失败的回调，padding中断promise链，
- 第二种如果不是promise，那么进入成功的回调，
- 第三种除非是有错误或者抛出异常才会进去失败的回调，
如果当前的promise状态是resolved或者是rejected，那么就是先有了状态结果再有的回调函数，所以直接调用我们传入的成功的回调函数，或者失败的回调函数，同样结果也是以上三种情况，这就是then方法的实现

### 部分实现

```js

/*
自定义Promise
 */

(function (window) {

  /*
  Promise构造函数
  excutor: 内部同步执行的函数  (resolve, reject) => {}
   */
  function Promise(excutor) {

    const self = this
    self.status = 'pending' // 状态值, 初始状态为pending, 成功了变为resolved, 失败了变为rejected
    self.data = undefined // 用来保存成功value或失败reason的属性
    self.callbacks = [] // 用来保存所有待调用的包含onResolved和onRejected回调函数的对象的数组

    /*
    异步处理成功后应该调用的函数
    value: 将交给onResolve()的成功数据
     */
    function resolve(value) {

      if(self.status!=='pending') { // 如果当前不是pending, 直接结束
        return
      }

      // 立即更新状态, 保存数据
      self.status = 'resolved'
      self.data = value

      // 异步调用所有待处理的onResolved成功回调函数
      setTimeout(() => {
        self.callbacks.forEach(obj => {
          obj.onResolved(value)
        })
      })
    }

    /*
    异步处理失败后应该调用的函数
    reason: 将交给onRejected()的失败数据
     */
    function reject(reason) {

      if(self.status!=='pending') { // 如果当前不是pending, 直接结束
        return
      }
      
      // 立即更新状态, 保存数据
      self.status = 'rejected'
      self.data = reason

      // 异步调用所有待处理的onRejected回调函数
      setTimeout(() => {
        self.callbacks.forEach(obj => {
          obj.onRejected(reason)
        })
      })
    }

    try {
      // 立即同步调用excutor()处理
      excutor(resolve, reject)
    } catch (error) { // 如果出了异常, 直接失败
      reject(error)
    }
  }

  /*
  为promise指定成功/失败的回调函数
  函数的返回值是一个新的promise对象
   */
  Promise.prototype.then = function (onResolved, onRejected) {

    // 保存promise对象
    const self = this

    // 如果成功/失败的回调函数不是function, 指定一个默认实现的函数
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}

    // 返回一个新的promsie对象
    return new Promise((resolve, reject) => {
      if (self.status === 'resolved') {
        // 异步执行onResolved
        setTimeout(() => {
          try {
            // 用x变量存储onResolved()的返回值,
            const x = onResolved(self.data)
            if (x instanceof Promise) {// x可能是新的promise对象
              // 先执行x这个promise, 并将它的data传递能返回的promise
              x.then(resolve, reject)
            } else {// x也可能是其它
              // 将onResolve()的返回值作为返回的promise的成功value
              resolve(x)
            }
          } catch (error) {// 如果过程中出了error, 交其作为返回的promise的失败reason
            reject(error)
          }
        })
      } else if (self.status === 'rejected') {
        // 异步执行onRejected
        setTimeout(() => {
          try {
            // 用x变量存储onRejected()的返回值,
            const x = onRejected(self.data)
            if (x instanceof Promise) {// x可能是新的promise对象
              // 先执行x这个promise, 并将它的data传递能返回的promise
              x.then(resolve, reject)
            } else {// x也可能是其它
              // 将onRejected()的返回值作为返回的promise的成功value
              resolve(x)
            }
          } catch (error) {// 如果过程中出了error, 交其作为返回的promise的失败reason
            reject(error)
          }
        })
      } else {
        // 保存待处理的回调函数
        self.callbacks.push({
          onResolved(value) {
            try {
              // 用x变量存储onResolved()的返回值,
              const x = onResolved(self.data)
              if (x instanceof Promise) {// x可能是新的promise对象
                // 先执行x这个promise, 并将它的data传递能返回的promise
                x.then(resolve, reject)
              } else {// x也可能是其它
                // 将onResolve()的返回值作为返回的promise的成功value
                resolve(x)
              }
            } catch (error) {// 如果过程中出了error, 交其作为返回的promise的失败reason
              reject(error)
            }
          },

          onRejected(value) {
            try {
              // 用x变量存储onRejected()的返回值,
              const x = onRejected(self.data)
              if (x instanceof Promise) {// x可能是新的promise对象
                // 先执行x这个promise, 并将它的data传递能返回的promise
                x.then(resolve, reject)
              } else {// x也可能是其它
                // 将onRejected()的返回值作为返回的promise的成功value
                resolve(x)
              }
            } catch (error) {// 如果过程中出了error, 交其作为返回的promise的失败reason
              reject(error)
            }
          }
        })
      }
    })
  }

  /*
  为promise指定失败的回调函数
  是then(null, onRejected)的语法糖
   */
  Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
  }

  /*
  返回一个指定了成功value的promise对象
  value: 一般数据或promise
   */
  Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) { // 如果传入的是promise对象, 将此promise的结果值作为返回promise的结果值
        value.then(resolve, reject)
      } else { // 将value作为返回promise的成功结果值
        resolve(value)
      }
    })
  }

  /*
  返回一个指定了失败reason的promise对象
  reason: 一般数据/error
   */
  Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
      // 将传入的参数作为返回promise的失败结果值
      reject(reason)
    })
  }

  /*
  返回一个新的promise对象, 只有promises中所有promise都产生成功value时, 才最终成功, 只要有一个失败就直接失败
   */
  Promise.all = function (promises) {
    // 返回一个新的promise
    return new Promise((resolve, reject) => {
      // 已成功的数量
      let resolvedCount = 0
      // 待处理的promises数组的长度
      const promisesLength = promises.length
      // 准备一个保存成功值的数组
      const values = new Array(promisesLength)
      // 遍历每个待处理的promise
      for (let i = 0; i < promisesLength; i++) {
        // promises中元素可能不是一个数组, 需要用resolve包装一下
        Promise.resolve(promises[i]).then(
          value => {
            // 成功当前promise成功的值到对应的下标
            values[i] = value
            // 成功的数量加1
            resolvedCount++
            // 一旦全部成功
            if(resolvedCount===promisesLength) {
              // 将所有成功值的数组作为返回promise对象的成功结果值
              resolve(values)
            }
          },
          reason => {
            // 一旦有一个promise产生了失败结果值, 将其作为返回promise对象的失败结果值
            reject(reason)
          }
        )
      }
    })
  }

  /*
  返回一个 promise，一旦某个promise解决或拒绝， 返回的 promise就会解决或拒绝。
  */
  Promise.race = function (promises) {
    // 返回新的promise对象
    return new Promise((resolve, reject) => {
      // 遍历所有promise
      for (var i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (value) => { // 只要有一个成功了, 返回的promise就成功了
            resolve(value)
          },
          (reason) => { // 只要有一个失败了, 返回的结果就失败了
            reject(reason)
          }
        )
      }
    })
  }

  /*
    返回一个延迟指定时间才确定结果的promise对象
  */
  Promise.resolveDelay = function (value, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Promise) { // 如果value是一个promise, 取这个promise的结果值作为返回的promise的结果值
          value.then(resolve, reject) // 如果value成功, 调用resolve(val), 如果value失败了, 调用reject(reason)
        } else {
          resolve(value)
        }
      }, time);
    })
  }

  /*
  返回一个延迟指定时间才失败的Promise对象。
  */
  Promise.rejectDelay = function (reason, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(reason)
      }, time)
    })
  }

  // 暴露构造函数
  window.Promise = Promise
})(window)
```