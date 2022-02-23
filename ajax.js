class RequestDecorator {
    constructor(max) {
        this.maxCount = max
        this.currentCount = 0
        this.waitQueue = []
    }
    async request(caller) {
        if (this.currentCount >= this.maxCount) {
            // return new Promise((resolve, reject) => {}),结果取决于何时执行resolve
            await this.wait()
        }
        try {
            this.currentCount++
            let res = caller()
            return new Promise.resolve(res)
        } catch (error) {
            return new Promise.reject(error)
        } finally {
            this.currentCount--
            this.next()
        }
    }
    next() {
        let _resolve = this.waitQueue.shift()
        _resolve()
    }
    wait() {
        let temResolve = null
        let p = new Promise((resolve, reject) => temResolve = resolve)
        this.waitQueue.push(temResolve)
        return p
    }
}
let urls = [
    'https://www.baidu.com/1',
    'https://www.baidu.com/2',
    'https://www.baidu.com/3',
    'https://www.baidu.com/4',
    'https://www.baidu.com/5',
    'https://www.baidu.com/6',
    'https://www.baidu.com/7',
    'https://www.baidu.com/8',
    'https://www.baidu.com/9',
    'https://www.baidu.com/10',
]
let promiseAll = []

let requestDecorator = new RequestDecorator(3)
requestDecorator.request()

for (let i = 0; i < urls.length; i++) {
    promiseAll.push(requestDecorator.request(
        fetch(urls[i]).then((res) => {
            console.log('res====', res)
        }).catch((err) => {
            console.log('err====', err)
        })
    ))
}
Promise.all(promiseAll).then((res) => {
    console.log('promiseAllres====', res)
}).catch((err) => {
    console.log('promiseAllerr====', err)
})