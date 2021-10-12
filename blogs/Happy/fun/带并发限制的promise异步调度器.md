---
title: 带并发限制的promise异步调度器
date: 2021-10-08
sidebar: 'auto'
categories:
 - Happy
tags:
 - 自定义函数实现
---

##  实现一个带并发限制的promise异步调度器
```js
class Scheduler {
    constructor(name) {
        this.list = []
        this.max = 2
        this.current = 0
    }
    add(func) {
        this.list.push(func)
    }
    taskStart() {
        for (let i = 0; i < this.max; i++) {
            this.handler()
        }
    }
    handler() {
        if (!this.list.length || this.current > this.max) {
            return
        }
        this.current++
        this.list.shift()().then(() => {
            this.current--
            this.handler()
        })
    }
}
let scheduler = new Scheduler()
const timeout = (time) => new Promise(resolve => setTimeout(resolve, time))
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
scheduler.taskStart()

// 输出 2 3 1 4
```

##  并发最多 max 次，全部执行完成后执行 callback，使用 fetch
```js
function sendRequest(urls, max, callback) {
    let current = 0
    let num = 0,
        allNum = urls.length
    for (let i = 0; i < max; i++) {
        request()
    }

    function request() {
        // debugger
        if (current > max) {
            return
        }
        current++
        fetch(urls.shift()).finally(() => {
            current--
            num++
            if (num === allNum) {
                callback()
            }
            if (urls.length > 0) {
                request()
            }
        })

    }
}
let urls = [
    'https://www.baidu.com/1',
    'https://www.baidu.com/2',
    'https://www.baidu.com/3',
    'https://www.baidu.com/4',
    'https://www.baidu.com/5',
]
sendRequest(urls, 3, () => console.log('finally'))
```