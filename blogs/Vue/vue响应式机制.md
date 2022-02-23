---
title: Vue响应式机制
date: 2019-04-11
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
 - 前端
 - 框架
---

##  _init

在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，也就是这里的 init 过程，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」

##  compile

compile编译可以分成 parse、optimize 与 generate 三个阶段，最终需要得到 render function。
-   parse: 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST。
-   optimize: 主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。
-   generate: 将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

在经历过 parse、optimize 与 generate 这三个阶段以后，组件中就会存在渲染 VNode 所需的 render function 了。

##  响应式
当 render function 被渲染的时候，因为会读取所需对象的值，所以会触发 getter 函数进行「依赖收集」，「依赖收集」的目的是将观察者 Watcher 对象存放到当前闭包中的订阅者 Dep 的 subs 中。
在修改对象的值的时候，会触发对应的 setter， setter 通知之前「依赖收集」得到的 Dep 中的每一个 Watcher，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 Watcher 就会开始调用 update 来更新视图，当然这中间还有一个 patch 的过程以及使用队列来异步更新的策略，


##  Virtual DOM
render function 会被转化成 VNode 节点。Virtual DOM 其实就是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等

##  更新视图 
patch过程

##  响应式系统
-   定义一个更新视图的函数
```js
function cb (val) {
    /* 渲染视图 */
    console.log("视图更新啦～");
}
```
-   然后我们定义一个 defineReactive ，这个方法通过 Object.defineProperty 来实现对对象的「响应式」化，入参是一个 obj（需要绑定的对象）、key（obj的某一个属性），val（具体的值）。经过 defineReactive 处理以后，我们的 obj 的 key 属性在「读」的时候会触发 reactiveGetter 方法，而在该属性被「写」的时候则会触发 reactiveSetter 方法。
```js
function defineRective(obj, prop, val) {
    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get() {
            return val
        },
        set(newVal) {
            if(val === newVal) return
            cb(newVal)
        }
    }) 
}
function Observer(obj) {
    if(!obj || typeOf obj !== 'object') {
        return 
    }
    obj.keys.forEach(item => {
        if(typeOf obj[item] === 'object' ){
            Observer(obj[item])
        }else {
            defineRective(obj, item, obj[item])
        }
    });
}
Class Vue {
    constructor(options) {
        this._data = options.data
        Observer(this._data)
    }
}
```

##  依赖收集
-   为什么依赖收集？ 
1.  模板中没用的响应式数据变更，不用调用更新视图函数
2.  用到的响应式数据变更，通知所有依赖者更新视图

-   订阅者Dep
1.  用 addSub 方法可以在目前的 Dep 对象中增加一个 Watcher 的订阅操作；
2.  用 notify 方法通知目前 Dep 对象的 subs 中的所有 Watcher 对象触发更新操作。
```js
class Dep {
    constructor () {
        /* 用来存放Watcher对象的数组 */
        this.subs = [];
    }

    /* 在subs中添加一个Watcher对象 */
    addSub (sub) {
        this.subs.push(sub);
    }

    /* 通知所有Watcher对象更新视图 */
    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
```

##  观察者Watcher
```js
class Watcher {
    constructor () {
        /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
        Dep.target = this;
    }

    /* 更新视图的方法 */
    update () {
        console.log("视图更新啦～");
    }
}

Dep.target = null;
```

##  依赖收集
-   接下来我们修改一下 defineReactive 以及 Vue 的构造函数，来完成依赖收集。我们在闭包中增加了一个 Dep 类的对象，用来收集 Watcher 对象。在对象被「读」的时候，会触发 reactiveGetter 函数把当前的 Watcher 对象（存放在 Dep.target 中）收集到 Dep 类中去。之后如果当该对象被「写」的时候，则会触发 reactiveSetter 方法，通知 Dep 类调用 notify 来触发所有 Watcher 对象的 update 方法更新对应视图。

```js
function defineReactive (obj, key, val) {
    /* 一个Dep类对象 */
    const dep = new Dep();
    
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
            dep.addSub(Dep.target);
            return val;         
        },
        set: function reactiveSetter (newVal) {
            if (newVal === val) return;
            /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
            dep.notify();
        }
    });
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        /* 在这里模拟render的过程，为了触发test属性的get函数 */
        console.log('render~', this._data.test);
    }
}
```
首先在 observer 的过程中会注册 get 方法，该方法用来进行「依赖收集」。在它的闭包中会有一个 Dep 对象，这个对象用来存放 Watcher 对象的实例。其实「依赖收集」的过程就是把 Watcher 实例存放到对应的 Dep 对象中去。get 方法可以让当前的 Watcher 对象（Dep.target）存放到它的 subs 中（addSub）方法，在数据变化时，set 会调用 Dep 对象的 notify 方法通知它内部所有的 Watcher 对象进行视图更新。
这是 Object.defineProperty 的 set/get 方法处理的事情，那么「依赖收集」的前提条件还有两个：
1.  触发 get 方法；
2.  新建一个 Watcher 对象。
这个我们在 Vue 的构造类中处理。新建一个 Watcher 对象只需要 new 出来，这时候 Dep.target 已经指向了这个 new 出来的 Watcher 对象来。而触发 get 方法也很简单，实际上只要把 render function 进行渲染，那么其中的依赖的对象都会被「读取」，这里我们通过打印来模拟这个过程，读取 test 来触发 get 进行「依赖收集」。


