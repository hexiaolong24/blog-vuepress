---
title: setTimeout实现setInterval
date: 2018-10-24
sidebar: 'auto'
categories:
 - Happy
---

```js
function mySetInterval() {
    if(typeof arguments[0] !== 'function') return
    mySetInterval.timer = setTimeout(() => {
        arguments[0]()
        mySetInterval(...arguments)
    }, arguments[1])
}
mySetInterval(() => {
    console.log('=========1=========')
}, 1000)
mySetInterval.clear = () => {
    clearTimeout(mySetInterval.timer)
}
```