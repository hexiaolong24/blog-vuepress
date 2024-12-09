---
title: async
date: 2020-10-08
sidebar: "auto"
categories:
  - Happy
---

1. async 函数
   函数的返回值为 promise 对象
   promise 对象的结果由 async 函数执行的返回值决定

2. await 表达式
   await 右侧的表达式一般为 promise 对象, 但也可以是其它的值
   如果表达式是 promise 对象, await 返回的是 promise 成功的值, 如果 promise 失败必须进行 try..catch 得到失败的结果
   如果表达式是其它值, 直接将此值作为 await 的返回值
   表达式抛出错误, 需要通过 try..catch 得到 error

3. 注意:
   await 必须写在 async 函数中, 但 async 函数中可以没有 await
   如果 await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 来捕获处理

```js
function fn1() {
  return 2;
}
async function fn2() {
  // return 2 返回一个成功的promise
  // throw 3 返回一个失败的promise
  // return Promise.resolve(4) 返回一个成功的promise
  return Promise.reject(4); //返回一个失败的promise
}

console.log(fn1());
console.log(fn2());

function fn4() {
  // return Promise.reject(5)
  throw 6;
}

async function fn3() {
  // const result = await 3  // await的右侧的表达式的结果可以不是promise, await的结果就是表达式本身的结果
  try {
    const result = await fn4(); // await的右侧的表达式的结果是promise, await的结果就是promise成功的结果
    console.log(result);
  } catch (error) {
    console.log("失败了", error);
  }
}
fn3();
```

- 实现

```js
function generatorToAsync(generatorFn) {
  return function () {
    const gen = generatorFn.apply(this, arguments); // gen有可能传参

    // 返回一个Promise
    return new Promise((resolve, reject) => {
      function go(key, arg) {
        let res;
        try {
          res = gen[key](arg); // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error); // 报错的话会走catch，直接reject
        }

        // 解构获得value和done
        const { value, done } = res;
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value);
        } else {
          // 如果done为false，说明没走完，还得继续走

          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(
            (val) => go("next", val),
            (err) => go("throw", err)
          );
        }
      }

      go("next"); // 第一次执行
    });
  };
}
```

- 测试用例

```js
async function asyncFn() {
  const num1 = await fn(1);
  console.log(num1); // 2
  const num2 = await fn(num1);
  console.log(num2); // 4
  const num3 = await fn(num2);
  console.log(num3); // 8
  return num3;
}
const asyncRes = asyncFn();
console.log(asyncRes); // Promise
asyncRes.then((res) => console.log(res)); // 8
```

```js
function* gen() {
  const num1 = yield fn(1);
  console.log(num1); // 2
  const num2 = yield fn(num1);
  console.log(num2); // 4
  const num3 = yield fn(num2);
  console.log(num3); // 8
  return num3;
}

const genToAsync = generatorToAsync(gen);
const asyncRes = genToAsync();
console.log(asyncRes); // Promise
asyncRes.then((res) => console.log(res)); // 8
```
