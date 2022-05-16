---
title: Object.is
date: 2018-10-24
sidebar: 'auto'
categories:
 - Happy
---

##  Object.is
```js
console.log(Object.is(-0, +0))
// false
console.log(-0 === +0)
// true
console.log(Object.is(NaN, NaN))
// true
console.log(NaN === NaN)
// false

if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
```