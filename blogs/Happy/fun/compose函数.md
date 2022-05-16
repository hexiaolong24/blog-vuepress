---
title: compose函数
date: 2021-03-08
sidebar: 'auto'
categories:
 - Happy
---

```js
let greeting = (firstName, lastName) => 'hello, ' + firstName + ' ' + lastName
let toUpper = str => str.toUpperCase()
let fn = compose(toUpper, greeting)
console.log(fn('jack', 'smith'))
  // ‘HELLO，JACK SMITH’

function compose(...args) {
  let length = args.length
  let index = length
  while(index--) {
    if(typeof args[index] !== 'function') {
      throw new TypeError(`Expected a function`)
    }
  }
  return function(...args1) {
    let index = length - 1
    let res = args[index].apply(this, args1)
    while(index--) {
      res = args[index].call(this, res)
    }
    return res
  }
}
```