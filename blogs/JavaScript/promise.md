---
title: Promise
date: 2019-09-12
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