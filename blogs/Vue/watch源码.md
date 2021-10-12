---
title: watch
date: 2020-08-08
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
 - 框架
---

##  watch
### initWatch
```js
function Vue(){
    // ... 其他处理
    initState(this)
    // ...解析模板，生成DOM 插入页面
}

function initState(vm) {
    // ...处理 data，props，computed 等数据
    if (opts.watch) {
        initWatch(this, vm.$options.watch);
    }
}
```
### createWatcher
1.  获取到监听回调
2.  调用 vm.$watch
```js
function initWatch(vm, watch) {    

    for (var key in watch) {    
        var watchOpt = watch[key];
        createWatcher(vm, key, handler);
    }
}

function createWatcher(
    // expOrFn 是 key，handler 可能是对象
    vm, expOrFn, handler,opts

) {    
    // 监听属性的值是一个对象，包含handler，deep，immediate
    if (typeof handler ==="object") {
        opts= handler
        handler = handler.handler
    }    
    // 回调函数是一个字符串，从 vm 获取
    if (typeof handler === 'string') {
        handler = vm[handler]
    }    
    // expOrFn 是 key，options 是watch 的全部选项
    vm.$watch(expOrFn, handler, opts)
}
```
-   四种方式
```js
watch: {
    // 如果是对象取handler字段
    name: {
        handler() {}
    },
    // 如果是函数直接作为回调
    name() {},
    // 如果是字符串，从实例上获取函数
    name: 'getname',
    // 如果是数组，依次作为回调
    name: [
        'getname',
        function name() {},
        {
            handler: function name() {}
        }
    ]
}
```
### $watch
1.  判断是否立即执行immediate
2.  为每个watch配发watcher
```js
Vue.prototype.$watch = function(
    // expOrFn 是 监听的 key，cb 是监听回调，opts 是所有选项
    expOrFn, cb, opts
){    
    // expOrFn 是 监听的 key，cb 是监听的回调，opts 是 监听的所有选项
    var watcher = new Watcher(this, expOrFn, cb, opts);    
    // 设定了立即执行，所以马上执行回调
    if (opts.immediate) {
        cb.call(this, watcher.value);
    }
};
```

### 配发watcher
1.  传入监听的key
2.  传入监听的回调
3.  传入配置对象
```js
var Watcher = function (vm, key, cb, opt) {  
    this.vm = vm;    
    this.deep = opt.deep;    
    this.cb = cb;  
    // 这里省略处理 xx.xx.xx 这种较复杂的key
    this.getter = function(obj) {        
        return obj[key]
    };    
    // this.get 作用就是执行 this.getter函数
    this.value = this.get();
};


Watcher.prototype.get = function() {    
    var value = this.getter(this.vm);    
    return value
};
```
-   Watch 在结尾会立即执行一次 watcher.get，其中便会执行 getter，便会根据你监听的key，去实例上读取并返回，存放在 watcher.value 上
-   此时data中的数据已经是响应式，当 watch.getter 执行，而读取了 vm.name 的时候，name的依赖收集器就会收集到 watch-watcher,于是 name 变化的时候，会可以通知到 watch，监听就成功了


### 如何深度监视
```js
Watcher.prototype.get = function() {
    Dep.target= this
    var value = this.getter(this.vm)    
    if (this.deep)  traverse(value)
    Dep.target= null
    return value
};

function traverse(val) {    
    var i, keys;    
    // 数组逐个遍历
    if (Array.isArray(val)) {
        i = val.length;        
        // val[i] 就是读取值了，然后值的对象就能收集到 watch-watcher
        while (i--) {
           traverse(val[i])
        }
    }    
    else {
        keys = Object.keys(val);
        i = keys.length;        
        // val[keys[i]] 就是读取值了，然后值的对象就能收集到 watch-watcher
        while (i--) {
           traverse(val[keys[i]])
        }
    }
}
```

### 触发监听
```js
Watcher.prototype.update= function() {    
    var value = this.get();    
    if (this.deep) {        
        var oldValue = this.value;        
        this.value = value;        
        // cb 是监听回调
        this.cb.call(this.vm, value, oldValue);
    }
};
```

##  computed
### initComputed
```js
function initComputed(vm, computed) {    
    var watchers = vm._computedWatchers = Object.create(null);    
    for (var key in computed) {        
        var userDef = computed[key];        
        var getter = 
            typeof userDef === 'function' ? 
                userDef: userDef.get;      
        // 每个 computed 都创建一个 watcher
        // watcher 用来存储计算值，判断是否需要重新计算
        watchers[key] = 
        new Watcher(vm, getter, { 
             lazy: true 
        });        
        // 判断是否有重名的属性
        if (! (key in vm)) {
            defineComputed(vm, key, userDef);
        }
    }
}
```
1.  每个 computed 配发 watcher
```js
function Watcher(vm, expOrFn, options) {    

    this.dirty = this.lazy = options.lazy;    
    
    this.getter = expOrFn;    

    this.value = this.lazy ? undefined: this.get();

};
```
-   保存设置的 getter,把用户设置的 computed-getter，存放到 watcher.getter 中，用于后面的计算
-   watcher.value 存放计算结果，但是这里有个条件，因为 lazy 的原因，不会新建实例并马上读取值
-   computed 新建 watcher 的时候，传入 lazy
    -   lazy 表示一种固定描述，不可改变，表示这个 watcher 需要缓存,而 dirty 表示缓存是否可用，如果为 true，表示缓存脏了，需要重新计算，否则不用,dirty 默认是 false 的，而 lazy 赋值给 dirty，就是给一个初始值，表示你控制缓存的

2.  defineComputed 处理
```js
function defineComputed(
    target, key, userDef

) {    
    // 设置 set 为默认值，避免 computed 并没有设置 set
    var set = function(){}      
    //  如果用户设置了set，就使用用户的set
    if (userDef.set) set = userDef.set   
    Object.defineProperty(target, key, {        
        // 包装get 函数，主要用于判断计算缓存结果是否有效
        get:createComputedGetter(key),        
        set:set
    });
}
```
-   使用 Object.defineProperty 在 实例上computed 属性，所以可以直接访问
-   set 函数默认是空函数，如果用户设置，则使用用户设置
-   createComputedGetter 包装返回 get 函数

```js
function createComputedGetter(key) {    
    return function() {        
        // 获取到相应 key 的 computed-watcher
        var watcher = this._computedWatchers[key];        
        // 如果 computed 依赖的数据变化，dirty 会变成true，从而重新计算，然后更新缓存值 watcher.value
        if (watcher.dirty) {
            watcher.evaluate();
        }        
        // 这里是 月老computed 牵线的重点，让双方建立关系
        if (Dep.target) {
            watcher.depend();
        }        
        return watcher.value
    }
}
```
-   watcher.evaluate 用来重新计算，更新缓存值，并重置 dirty 为false，表示缓存已更新
-   只有 dirty 为 true 的时候，才会执行 evaluate

3.  收集所有 computed 的 watcher