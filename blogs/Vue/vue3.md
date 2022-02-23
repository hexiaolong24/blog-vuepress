---
title: vue3
date: 2020-08-04
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
---

##  数组更新检测
-   push
-   pop
-   shift
-   unshift
-   splice
-   sort
-   reverse

##  Object.defineProperty其实也可以监视到数组原有索引的变化

Object.defineProperty 在数组中的表现和在对象中的表现是一致的，数组的索引就可以看做是对象中的 key。
通过索引访问或设置对应元素的值时，可以触发 getter 和 setter 方法。
通过 push 或 unshift 会增加索引，对于新增加的属性，需要再手动初始化才能被 observe。
通过 pop 或 shift 删除元素，会删除并更新索引，也会触发 setter 和 getter 方法。
所以，Object.defineProperty是有监控数组下标变化的能力的，只是 Vue2.x 放弃了这个特性。

-   Vue 的 Observer 对数组做了单独的处理

```js
let arr = [1, 2, 3,4]
function observe(data) {
    Object.keys(data).forEach(key => {
        def(data, key, data[key])
    })
}
function def(data, key, val) {
    Object.defineProperty(data, key, {
        get() {
            console.log(`get===${key}`, val)
            return val
        },
        set(newValue) {
            console.log(`set===${key}`, newValue)
            val = newValue
        }
    })
}
observe(arr)
console.log(arr)
```

##  Object.defineProperty()

直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。是定义key为Symbol的属性的方法之一

-   configurable
configurable 特性表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。

-   Enumerable
enumerable 定义了对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举。

-   Writable
当 writable 属性设置为 false 时，该属性被称为“不可写的”。它不能被重新赋值。

##  初始化顺序

```js
/*初始化生命周期*/
initLifecycle(vm)
/*初始化事件*/
initEvents(vm)Object.defineProperty 
/*初始化render*/
initRender(vm)
/*调用beforeCreate钩子函数并且触发beforeCreate钩子事件*/
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
/*初始化props、methods、data、computed与watch*/
initState(vm)
initProvide(vm) // resolve provide after data/props
/*调用created钩子函数并且触发created钩子事件*/
callHook(vm, 'created')
```

-   initState
```js
/*初始化props、methods、data、computed与watch*/
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  /*初始化props*/
  if (opts.props) initProps(vm, opts.props)
  /*初始化方法*/
  if (opts.methods) initMethods(vm, opts.methods)
  /*初始化data*/
  if (opts.data) {
    initData(vm)
  } else {
    /*该组件没有data的时候绑定一个空对象*/
    observe(vm._data = {}, true /* asRootData */)
  }
  /*初始化computed*/
  if (opts.computed) initComputed(vm, opts.computed)
  /*初始化watchers*/
  if (opts.watch) initWatch(vm, opts.watch)
}
...

/*初始化data*/
function initData (vm: Component) {

  /*得到data数据*/
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}defi
  ...
  //遍历data中的数据
  while (i--) {

    /*保证data中的key不与props中的key重复，props优先，如果有冲突会产生warning*/
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${keys[i]}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(keys[i])) {
      /*判断是否是保留字段*/

      /*这里是我们前面讲过的代理，将data上面的属性代理到了vm实例上*/
      proxy(vm, `_data`, keys[i])
    }
  }
  // observe data
  /*这里通过observe实例化Observe对象，开始对数据进行绑定，asRootData用来根数据，用来计算实例化根数据的个数，下面会进行递归observe进行对深层对象的绑定。则asRootData为非true*/
  observe(data, true /* asRootData */)
}
```
##  Object.defineProperty和Proxy的区别
1.  Object.defineProperty 只能劫持对象的属性，而 Proxy 是直接代理对象

由于 Object.defineProperty 只能对属性进行劫持，需要遍历对象的每个属性，如果属性值也是对象，则需要深度遍历。而 Proxy 直接代理对象，不需要遍历操作

2.  Object.defineProperty 对新增属性需要手动进行 Observer
3.  Object.defineProperty 操作目标对象或者代理对象都可以触发getter setter,但是Proxy是只有操作代理对象才会触发getter setter
```js
let obj = {
        name: 'xiao'
    }
function de(obj, prop, val) {
    return Object.defineProperty(obj, 'name', {
        get() {
            console.log('---getter')
            return val
        },
        set(newVal) {
            console.log('---setter')
            val = newVal
        }
    })
}
let newObj = de(obj, 'name', obj.name)
obj.name = '1' // 会触发setter
newObj.name = '1' // 会触发setter
console.log('---obj', obj) // 改变
console.log('---newObj', newObj) // 改变
```

```js
let obj = {
        name: 'xiao'
    }
let newObj = new Proxy(obj, {
    get(obj, prop) {
        console.log('---getter')
        return obj[prop]
    },
    set(obj, prop, val) {
        console.log('---setter')
        obj[prop] = val
    }
})
obj.name = '1' // 不会触发setter,但是代理对象也会改变
newObj.name = '1' // 会触发setter
console.log('---obj', obj) // 改变
console.log('---newObj', newObj) // 改变
```


