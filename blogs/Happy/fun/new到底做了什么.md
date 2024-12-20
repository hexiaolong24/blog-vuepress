---
title: new
date: 2018-10-24
sidebar: "auto"
categories:
  - Happy
---

- 注意点：new 和 bind 一起用 bind 会失效，不能改变函数内部的 this，this 还是新生成的实例对象，但是可以传参 1 相当于第一个参数
- new 和 call apply 一起用会报错 Person.apply is not a constructor

```js
let p = new (Person.bind({ a: 1 }, 1, 2, 3))("james");
```

- bind 返回的函数没有 prototype，箭头函数没有，对象属性是一个函数也没有

```js
const obj = {
  foo() {
    return "bar";
  },
};
console.log(obj.foo.prototype === undefined); // true
```

-

```js
function _new(fn, ...args) {
  // 实例对象的隐式对象为函数的原型对象
  let obj = Object.create(fn.prototype);
  // 将函数的this指向实例对象 并调用对象
  let res = fn.call(obj, ...args);
  // 如果函数本身不返回object，则返回实例对象
  return res.constructor === Object ? res : obj;
}
```
