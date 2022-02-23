---
title: ES6 7 8 9 10 11 12新特性
date: 2018-08-22
sidebar: auto
categories:
- JavaScript
tags:
- JavaScript
---

## ES6（2015）
1. 类（class）
```js
class Man {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log('eat');
  }
}
const man = new Man('kobe');
man.eat(); // 小豪
```

2. 模块化(ES Module)
```js
// 模块 A 导出一个方法
export const sub = (a, b) => a + b;
// 模块 B 导入使用
import { sub } from './A';
console.log(sub(1, 2)); // 3
```

3. 箭头（Arrow）函数
```js
const func = (a, b) => a + b;
func(1, 2); // 3
```

4. 函数参数默认值
```js
function foo(age = 25,){}
```

5. 模板字符串
```js
const name = 'kobe';
const str = `Your name is ${name}`;
```

6. 解构赋值
```js
let a = 1, b= 2;
[a, b] = [b, a]; // a 2  b 1
```

7. 延展操作符
```js
let a = [...'hello world']; // ["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
```

8. 对象属性简写
 ```js
const name = 'kobe',
const obj = { name };
```

9. Promise
```js
Promise.resolve().then(() => { console.log(2); });
console.log(1);
// 先打印 1 ，再打印 2
```

10. let和const
```js
let name = 'kobe'；
const arr = [];
```

##  ES7（2016）

1. Array.prototype.includes()

2. 指数操作符
```js
2**10; // 1024
```

##  ES8（2017）

1. async/await
异步终极解决方案

2. Object.values()
```js
Object.values({a: 1, b: 2, c: 3}); // [1, 2, 3]
```

3. Object.entries()
```js
Object.entries({a: 1, b: 2, c: 3}); // [["a", 1], ["b", 2], ["c", 3]]
```

4. String padding
```js
// padStart 第一个参数为位数，第二个参数为要补充的内容
'hello'.padStart(10); // "     hello"
'hello'.padStart(6, 0); // "0hello"
// padEnd
'hello'.padEnd(10) "hello     "
```

5. 函数参数列表结尾允许逗号

6. Object.getOwnPropertyDescriptors()

获取一个对象的所有自身属性的描述符,如果没有任何自身属性，则返回空对象。
```js
let obj = {
  name: 'wade',
  age: 13
}
Object.getOwnPropertyDescriptors(obj)
/**
 * {
 *  age: {
 *    configurable: true,
 *    enumerable: true,
 *    value: 13,
 *    writable: true
 *  },
 *  name: {
 *    
 *  }
 * }
*/
```

7. SharedArrayBuffer对象

> SharedArrayBuffer 对象用来表示一个通用的，固定长度的原始二进制数据缓冲区，
```js

/**
 * 
 * @param {*} length 所创建的数组缓冲区的大小，以字节(byte)为单位。
 * @returns {SharedArrayBuffer} 一个大小指定的新 SharedArrayBuffer 对象。其内容被初始化为 0。
 */
new SharedArrayBuffer(10)
```

8. Atomics对象

> Atomics 对象提供了一组静态方法用来对 SharedArrayBuffer 对象进行原子操作。

##  ES9（2018）

1. 异步迭代

await可以和for...of循环一起使用，以串行的方式运行异步操作

```js
async function process(array) {
  for await (let i of array) {
    // doSomething(i);
  }
}
```

2. Promise.finally()

- finally() 方法返回一个Promise。
- 在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。
- 这为在Promise是否成功完成后都需要执行的代码提供了一种方式。避免了同样的语句需要在then()和catch()中各写一次的情况。

##  ES10（2019）

1. Array.flat()

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

2.  Array.flatMap()

```js
let arr1 = ["it's Sunny in", "", "California"];

arr1.map(x => x.split(" "));
// [["it's","Sunny","in"],[""],["California"]]

arr1.flatMap(x => x.split(" "));
// ["it's","Sunny","in", "", "California"]

[1, 2, 3, 4].flatMap(a => a**2); // [1, 4, 9, 16]
[1, 2, 3, 4].map(a => a**2); // [1, 4, 9, 16]

[1, 2, 3, 4].flatMap(a => [a**2]); // [1, 4, 9, 16]
[1, 2, 3, 4].map(a => [a**2]); // [[1], [4], [9], [16]]
```

3. String.trimStart()和String.trimEnd()

> 去除字符串首尾空白字符

4. Object.fromEntries()
- map 转化为 Object
```js
const map = new Map([ ['foo', 'bar'], ['baz', 42] ]);
const obj = Object.fromEntries(map);
console.log(obj); // { foo: "bar", baz: 42 }
```

- array 转化为 Object
```js
const arr = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ];
const obj = Object.fromEntries(arr);
console.log(obj); // { 0: "a", 1: "b", 2: "c" }
```

##  ES11（2020）

1. Nullish coalescing Operator(空值处理)

表达式在 ?? 的左侧 运算符求值为undefined或null，返回其右侧。

```js
let user = {
    u1: 0,
    u2: false,
    u3: null,
    u4: undefined
    u5: '',
}
let u1 = user.u1 ?? '用户1'  // 0
let u2 = user.u2 ?? '用户2'  // false
let u3 = user.u3 ?? '用户3'  // 用户3
let u4 = user.u4 ?? '用户4'  // 用户4
let u5 = user.u5 ?? '用户5'  // ''

// 与 || 的区别
'' || 1 // 1
' ' || 1 // " "
'' ?? 1 // ""
' ' ?? 1 // " "
```

2. Optional chaining（可选链）

?.用户检测不确定的中间节点

```js
let user = {}
let u1 = user.childer.name // TypeError: Cannot read property 'name' of undefined
let u1 = user.childer?.name // undefined
```

3. Promise.allSettled
```js
// 当所有promise有结果后，返回一个数组,如果有promise无结果，则一直不返回

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => reject('我是失败的Promise_1'));
const promise4 = new Promise((resolve, reject) => reject('我是失败的Promise_2'));
const promiseList = [promise1,promise2,promise3, promise4]
Promise.allSettled(promiseList)
.then(values=>{
  console.log(values) // [{status: 'fulfilld', value: 3}, ...]
});
```

4. import()

按需引入

5. 新基本数据类型BigInt

6. globalThis

6. globalThis

- 浏览器：window
- worker：self
- node：global

##  ES12（2021）

1. replaceAll
返回一个全新的字符串，所有符合匹配规则的字符都将被替换掉

```js
const str = 'hello world';
str.replaceAll('l', ''); // "heo word"
```

2. Promise.any

如果有成功的就返回第一个成功的promise，如果都失败，就返回所有失败的结果，保存在一个数组中
```js
const promise4 = new Promise((resolve, reject) => 
    reject('我是失败的Promise_2')
);
const promise1 = Promise.reject(3);

const promise3 = new Promise((resolve, reject) => 
  setTimeout(() => {
    reject('我是失败的Promise_1')
  },1000)
);
const promise2 = 42;

const promiseList = [promise1,promise3, promise4]
Promise.any(promiseList)
.then(values=>{
  console.log('values', values)
})
.catch(err => {
  console.log('err', err.errors) // [3, "我是失败的Promise_1", "我是失败的Promise_2"]
})
```

3. 数字分隔符

数字分隔符，可以在数字之间创建可视化分隔符，通过_下划线来分割数字，使数字更具可读性

```js
const money = 1_000_000_000;
//等价于
const money = 1000000000;

1_000_000_000 === 1000000000; // true
```

4. 逻辑运算符和赋值表达式

```js
a ||= b
//等价于
a = a || (a = b)

a &&= b
//等价于
a = a && (a = b)

a ??= b
//等价于
a = a ?? (a = b)
```


