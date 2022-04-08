---
title: let和const
date: 2021-08-09
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
---

##  let 

1.  不能重复申明

2.  只存在创建变量的提升

3.  放在暂时性死区中

-   只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。
```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```
-   总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）

-   “暂时性死区”也意味着typeof不再是一个百分之百安全的操作

```js
typeof x; // ReferenceError
let x;
```

-   所以，在没有let之前，typeof运算符是百分之百安全的，永远不会报错。现在这一点不成立了。这样的设计是为了让大家养成良好的编程习惯，变量一定要在声明之后使用，否则就报错。

-   有些“死区”比较隐蔽，不太容易发现。如下
```js
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错

// 不报错
var x = x;

// 报错
let x = x;
// ReferenceError: x is not defined
```

##  为什么需要块级作用域(块级作用域必须有大括号)

-   第一种场景，内层变量可能会覆盖外层变量。
```js
var tmp = new Date();

function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }
}

f(); // undefined
``` 
-   第二种场景，用来计数的循环变量泄露为全局变量。
```js
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```
上面代码中，变量i只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量。

1.  ES6 允许块级作用域的任意嵌套。
2.  块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了。

```js
// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}
```
>   for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
>   catch也存在块级作用域
````js
try {

} catch(error) {

}
// Error error is not defined
console.log(error) 
```

##  const

-   基本用法
1.  const声明一个只读的常量。一旦声明，常量的值就不能改变。
2.  const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。
```js
const foo;
// SyntaxError: Missing initializer in const declaration
```
3.  const的作用域与let命令相同：只在声明所在的块级作用域内有效。
4.  const命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。
5.  const声明的常量，也与let一样不可重复声明。

-   本质 
const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only

const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错
```

-   如果真的想将对象冻结，应该使用Object.freeze方法。

```js
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```
除了将对象本身冻结，对象的属性也应该冻结
```js
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

##  ES6 声明变量的六种方法
ES5 只有两种声明变量的方法：var命令和function命令。ES6 除了添加let和const命令，后面章节还会提到，另外两种声明变量的方法：import命令和class命令。所以，ES6 一共有 6 种声明变量的方法。

##  不再挂载到window上
var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。
```js
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

##  globalThis
ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

##  es5模拟let const

```js
// let
(() => {
  var a = 1
  console.log('a1', a)
})()
console.log('a2', a)

// const
function _const(key, value) {
  window[key] = value
  Object.defineProperty(window, key, {
    configurable: false,
    enumerable: false,
    get() {
      return value
    },
    set() {
      throw new Error('Assignment to constant variable')
    }
  })
}
_const('num', 1)
console.log(num)

var a = Object.freeze({
          name: 'aaa'
        }) 
let b = {
  key: 123
}
Object.freeze(b)
b.key = 3
console.log(b.key)

// 两种形式都可以，严格模式下报错，不是严格模式只是不生效
```




