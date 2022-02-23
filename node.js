function fn() {
    return setTimeout(() => {
        return Promise.resolve(1)
    }, 1000)
}
console.log(fn())