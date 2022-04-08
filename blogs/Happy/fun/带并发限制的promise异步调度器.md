---
title: 带并发限制的promise异步调度器
date: 2021-10-08
sidebar: 'auto'
categories:
 - Happy
---

##  实现一个带并发限制的promise异步调度器
```js
class Scheduler {
    constructor() {
        this.list = []
        this.max = 2
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
        if (!this.list.length) {
            return
        }
        this.list.shift()().then(() => {
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
    let num = 0,
        allNum = urls.length
    for (let i = 0; i < max; i++) {
        request()
    }

    function request() {
        if (!urls.length) {
            return
        }
        fetch(urls.shift()).finally(() => {
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

##  写一个 Promise.runLimit([p1, p2, p3, p4], limit) 方法 模拟 Promise.all 同时并行执行limit个数的promise 注意返回结果的顺序
```js
Promise.myAll = function(promises, limit=2) {
  try{
    promises = [...promises]
  }catch(e) {
    throw new TypeError(e)
  }

  if(promises.length == 0) return Promise.resolve([]);

  let len = promises.length,
      res = new Array(len).fill(undefined),
      max = limit,
      count = 0;

  function handle(resolve, reject, i) {
    if(!promises.length) {
      return 
    }
    Promise.resolve(promises.shift()())
    .then(val => {
      res[i] = val
      handle(resolve, reject, count++)
      if(res.filter(Boolean).length === len) {
        resolve(res)
      }
    })
    .catch(err => {
      reject(err)
    })
    
  }

  return new Promise((resolve, reject) => {
    for(let i = 0; i<max; i++) {
      handle(resolve, reject, count++)
    }
  })
  
}
const promise1 = function() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 3000, '1');
  })
}
const promise2 = function() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, '2');
  })
}
const promise3 = function() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, '3');
  })
}
console.time()
Promise.myAll([promise1, promise2, promise3]).then((val) => {
  console.log('222', val)
  console.timeEnd()
})
```
