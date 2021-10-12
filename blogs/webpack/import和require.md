---
title: import和require
date: 2021-06-20
sidebar: 'auto'
categories:
 - webpack
tags:
 - webpack
---

##  基本使用
```js
exports.fs = '456'
module.exports = '123'
const fs = require('fs') // 123
// module.exports 和 exports.xx 不能混用
const { fs } = require('fs') // 456

// 必须用于分别暴露
import {a} from './__config';
// 必须用于默认暴露
import a from './__config';

import fs from 'fs'
import {default as fs} from 'fs'
import * as fs from 'fs'
import {readFile} from 'fs'
import {readFile as read} from 'fs'
import fs, {readFile} from 'fs'

export default fs
export const fs
export function readFile
export {readFile, read}
export * from 'fs'


```

##  require是运行时调用,import是编译时调用

-   require动态编译,从缓存中读取
```js
//example.js
module.exports = {
    say: 'hi'
}

//main.js
require('./example').say = 'hello'
const test = require('./example').say
console.log(test)       //hello
```

-   import静态编译,export和import只能在模块最外层作用域，不能在条件语句内，因为对import和export是在静态分析阶段做的分析处理，而条件语句要等到执行时才会解析到。
-   导入的模块是单例模式，因此同一模块多次导入，只执行一次
```js
// base.js
export var foo = 'bar';
setTimeout(() => foo = 'baz change', 500);

// main.js
import { foo } from './base';
console.log(foo); // bar
setTimeout(() => console.log(foo), 600);// baz changed
```

##  require不会改变导出的值,import默认暴露可以，并且如果导入的是对象，可以修改其属性，不建议
```js
export const name = "前端事务所";
export default "ESModule";

import * as ES from './__config'; // 这种方式可以修改
import ES from './__config'; // 这种方式不可以修改
// 如果name暴露时没有定义，其实是可以添加上的，如果有则报错
//Uncaught TypeError: Cannot set property name of #<Object> which has only a getter
ES.name = '123'; 
// 但是default可以修改
ES.default = '123'; 
console.log('es', ES);
```


##  import动态加载实现原理

### 入口文件
-   发现这个文件其实就是一个自执行函数，该函数把 转化后的 index.js 和 文件路径 组成一个 modules 传给主函数
-   主函数中，会执行 __webpack_require__(__webpack_require__.s = "./src/index.js"); 来初始化入口模块。
### import引用文件
-   发现import 被转化成了 __webpack_require__.e(/*! import() */ 0)
-   根据 installedChunks 检查是否加载过该 chunk
-   假如没加载过，则发起一个 JSONP 请求去加载 chunk
-   设置一些请求的错误处理，然后返回一个 Promise。
-   当 Promise 返回之后，就会继续执行我们之前的异步请求回调
### webpackJsonpCallback
-   执行 installedChunks 中的 resolve ， 让 import() 得以继续执行
-   将 chunk 中含有的 模块全部注册到 modules 变量中。


```js
_webpack_require_.e
```
-   开始加载异步chunk
-   将chunk有关的请求回调存入installedChunks
-   发起chunk的JSONP请求
```js
// 异步chunk
```
-   执行异步chunk
```js
webpack.jsonpCallback
```
-   将chunk中的模块都录入modules
-   执行chunk请求回调

```js
import().then()
```
-   加载module
-   执行对应代码逻辑

##  import动态加载

```js
(function(modules) { // webpackBootstrap
   //...
   // Load entry module and return exports
   return __webpack_require__(__webpack_require__.s = 36);
 })({
  "./src/index.js": 
  (function(module, __webpack_exports__, __webpack_require__) {/*模块内容*/}),
  "./src/es.js": 
  (function(module, __webpack_exports__, __webpack_require__) {/*模块内容*/}),
  "./src/common.js": 
  (function(module, exports) {/*模块内容*/})
});
```
1.  我们的模块被转换成了立即执行函数表达式(IIFE)，函数会自执行，进行模块的创建以及链接等
2.  所有模块组装成对象作为函数的参数传入。对象的构成：{ [文件的路径]：[被包装后的模块内容] }
3.  每个模块都被构造的函数包裹

-   下面我们对上面代码做拆解，分别对"模块如何被封装"以及"怎么被链接起来"，做详细分析。

##  首先看"ESM规范"的代码会被如何处理
```js
"./src/es.js": 
  /*! exports provided: age, name, default */
  /*! exports used: default, name */
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    /* unused harmony export age */
    /* harmony export (binding) */ 
    __webpack_require__.d(__webpack_exports__, "b", function() { return name; });
    var age = 18;
    var name = "前端事务所";
    /* harmony default export */ 
    __webpack_exports__["a"] = ("ESModule");
})
```
1.  注释
```js
//记录了当前模块被导出的接口有哪些
exports provided
//导出接口中被使用的有哪些
exports used

// 未被使用的导出
unused harmony export age
// 被使用的导出，（type：使用类型)
harmony export (binding)
```
正是基于这些接口信息的记录，使得webapck可以实现treeShaking

2.  函数的参数分别为：module, __webpack_exports__, __webpack_require__

>   Tips：有一点需要强调下，CommonJs中导出的是模块对象，ESM规范中模块是不存在模块对象的，因此可以使用this===undefined判断当前环境是否为模块内。但是webpack支持ESM语法是通过将其转换成类似CommonJs的加载形式，只不过模块的读取不是通过文件流从硬盘读取，而是从内存读取

-   这里module就是模块对象，而__webpack_exports__ === module.exports，这点和CommonJs一致，既然这样，只传一个module不就行了？CommonJs是支持module.exports和exports两种写法的，相同实现。

-   Webpack使用__webpack_require__对import关键词的做了替换处理。

3.  __webpack_require__.d
```js
// define getter function for harmony exports
__webpack_require__.d = function(exports, name, getter) {
  //判断该变量是否已经挂载到exports上
  if(!__webpack_require__.o(exports, name)) {
    //给exports添加导出变量（接口），可枚举，通过getter读取自定义的值
    Object.defineProperty(exports, name, { enumerable: true, get: getter });
  }
};
```
-   原来是将导出的变量绑定到exports上。由于age被标记为未使用，因此并不会被注册到exports上。而通过使用__webpack_require__.d将name绑定到exports，这里需要注意三点：

1.  通过闭包传引用的方式（getter的实现）是为了实现ESM的规范：导出不是值的复制，而是共享的引用。使用时exports.name，会触发getter返回其当前值；
2.  显式的为对象属性添加属性描述器{enumerable: true, get: getter}，由于set：undefined，严格模式（"use strict"）下，不能更改其值。
3.  细心的童鞋会发现，__webpack_require__.d是被放到模块顶层首先被执行的，为什么呢？为了实现ESM的export的提升（变量|函数的区别），注意和后面介绍的模块初始化时放入缓存一起理解。

-   另外__webpack_exports__["a"] = ("ESModule");，这个a其实就是default，也是被挂载到module.exports上。和name接口导出定义的区别，在于default可以重新赋值

##  Webpack是如何处理CommonJs的导出
```js
"./src/common.js":
/*! no static exports found */
/*! all exports used */
(function(module, exports) {
  exports.sayHello = function (name, desc) {
    console.log("\u6B22\u8FCE\u5173\u6CE8[\u524D\u7AEF\u4E8B\u52A1\u6240]~");
  };
})
```
-   可以看到模块代码基本没有变化，同样是被封装到了函数内，传入module对象，模拟了CommonJs的实现。

##  import()动态加载的实现
```js
// 示例代码
//index.js 入口文件
import(/* webpackChunkName: "es" */ './es.js')
  .then((val => console.log(val)))

//es.js
export const name = "前端事务所";
export default "ESModule";
```
打包后发现，除了生成main.js还多出来一个es.js，es.js即待使用import()懒加载的模块，其代码如下

```js
//webpackJsonp：[['模块名(Id)'，{'模块路径'：模块执行函数}]]
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["es"],{
  "./src/es.js":
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, "name", function() { return name; });
    var name = "前端事务所";
    __webpack_exports__["default"] = ("ESModule");
  })
}]);
```
1.  import()会被转换成__webpack_require__.e(/*! import() | es */ "es")，先看下__webpack_require__.e的代码：
```js
// JSONP chunk loading for javascript
__webpack_require__.e = functionrequireEnsure(chunkId) {
 var promises = [];
 var installedChunkData = installedChunks[chunkId];
 //先判断当前模块是否已经加载完成（加载完成后会将其标识为0）
 if(installedChunkData !== 0) { 
   // 如果不为undefined，意味这该模块的请求已发出，loging状态
   if(installedChunkData) {
     //如果该模块处于loading中，则将模块缓存中记录的promise存入promises
     promises.push(installedChunkData[2]);
   } else {
     // 创建一个新的Promise，用installedChunks记录下该模块返回Promise的resolve和reject
     //便于处理好后正确执行.then （Promise相关可参考【前端事务所】ES6系列一)
     var promise = new Promise(function(resolve, reject) {
       installedChunkData = installedChunks[chunkId] = [resolve, reject];
     });
     //installedChunkData[chunkId]: [resolve, reject, promise]
     promises.push(installedChunkData[2] = promise);

     // 创建script标签，发起请求
     var script = document.createElement('script');
     var onScriptComplete;

     script.charset = 'utf-8';
     script.timeout = 120;
     if (__webpack_require__.nc) {
       script.setAttribute("nonce", __webpack_require__.nc);
     }
     script.src = jsonpScriptSrc(chunkId);

     onScriptComplete = function (event) {
       // avoid mem leaks in IE.
       script.onerror = script.onload = null;
       clearTimeout(timeout);
       var chunk = installedChunks[chunkId];
       if(chunk !== 0) {
         if(chunk) {
           //...
         }
         installedChunks[chunkId] = undefined;
       }
     };
     //异步模块加载超时处理
     var timeout = setTimeout(function(){
       onScriptComplete({ type: 'timeout', target: script });
     }, 120000);
     //模块加载完成（失败|成功）做的处理：清除定时器等
     script.onerror = script.onload = onScriptComplete;
     document.head.appendChild(script);
   }
 }
 //import（）执行返回Promise实例，promises记录了模块请求时被缓存的promise
 // 当模块加载完成后，promise的状态变更，会通知到所有请求了该模块的import()回调 执行
 // 等价于为模块缓存额promise注册了多个回调函数：按顺序执行：
 // p.then(A动态加载请求回调) | p.then(B动态加载请求回调)
 return Promise.all(promises);
};
```
-   创建一个Promise对象，使用installedChunks记录下其resolve和reject，便于后面获取资源后切换上下文，控制.then()的执行时机；
-   installedChunks用于记录已加载和加载中的chunk；
```js
// installedChunks[模块名]的值：
undefined = chunk还没加载；
null = prefecth/preload；
Promise = chunk 加载中；
0 = chunk加载完成。
```
-   然后创建Script标签，发起异步请求（requireJs也是类似方式做的异步加载）
前面已经知道异步加载模块的代码形式，模块加载完成后，异步模块如果早于runtimeChunk执行，则被塞到window["webpackJsonp"]中等待webapck回调函数执行；如果迟于runtimeChunk执行，此时window["webpackJsonp"].push即为webpackJsonpCallback回调函数，立即执行

2.  我们直接看下webpackJsonpCallback异步回调函数对模块做了什么事
```js
function webpackJsonpCallback(data) {
 var chunkIds = data[0];   //模块名称（id）
 var moreModules = data[1];  //模块
 var moduleId, chunkId, i = 0, resolves = [];
 for(;i < chunkIds.length; i++) {
   chunkId = chunkIds[i];
   if(installedChunks[chunkId]) {
     //收集异步模块的installedChunks中记录的resolve
     //创建script请求时，installChunks记录了该模块对应的值：
     //[resolve, reject, promise]
     resolves.push(installedChunks[chunkId][0]);
   }
   // 标记当前模块已经加载完成
   installedChunks[chunkId] = 0;
 }
 //注册到全局modules:[]上（全部模块都会被集中收集在modules中）
 for(moduleId in moreModules) {
   if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
     modules[moduleId] = moreModules[moduleId];
   }
 }
 //webpackJsonp数组的原型链上的push方法
 if(parentJsonpFunction) parentJsonpFunction(data);

 while(resolves.length) {
   //最后触发触发promise注册的回调函数
   // import().then() 等价于 Promise.all(promises).then()    
   resolves.shift()();
 }

};
```
-   将异步加载的模块标记为加载完成：installedChunks[chunkId] = 0;(不要忘记创建script异步获取模块时，设置了setTimeout和onScriptComplete做超时和异常捕获)
-   将异步加载的模块先缓存在全局维护的modules中（下载后并不立即执行模块内容），真正执行由调用__webpack_require__时负责；
-   由于installedChunks中记录了模块对应的[resolve, reject, promise]，加载完成后调用resolve，触发回调函数。
-   现在，异步模块信息已经被记录，并且通过installedChunks触发resolve执行__webpack_require__.e的回调函数：
```js
__webpack_require__.e(/*! import() | es */ "es")
  .then(__webpack_require__.bind(null, /*! ./es.js */ "./src/es.js"))
  .then(function (val) {
    return console.log(val);
  });
```
-   异步模块下载后会被存于modules中。可以看到__webpack_require__.e返回的promise的回调函数即__webpack_require__，它通过modules找到模块然后执行并返回modules.exports。
-   现在我们知道了，异步模块在下载后先将模块缓存到modules中，同时触发promise 回调的执行，真正创建和获取模块对象是在回调函数中通过__webpack_require__完成的；而不是获取后立即创建模块对象，然后通过调用resolve(module.exports)给promise的回调函数传递模块对象。
