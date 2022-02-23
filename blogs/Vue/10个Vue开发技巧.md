---
title: 10个Vue开发技巧
date: 2020-04-22
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
---

##  优雅更新props

更新 `prop` 在业务中是很常见的需求，但在子组件中不允许直接修改 `prop`，因为这种做法不符合单向数据流的原则，在开发模式下还会报出警告。因此大多数人会通过 `$emit` 触发自定义事件，在父组件中接收该事件的传值来更新 `prop`。

child.vue:

```JavaScript
export defalut {
  props: {
    title: String  
  },
  methods: {
    changeTitle(){
        this.$emit('change-title', 'hello')
    }
  }
}
```

parent.vue:

```JavaScript
<child :title="title" @change-title="changeTitle"></child>

export default {
  data(){
    return {
      title: 'title'
    }  
  },
  methods: {
    changeTitle(title){
      this.title = title
    }
  }
}
```

这种做法没有问题，我也常用这种手段来更新`prop`。但如果你只是想单纯的更新 `prop`，没有其他的操作。那么 `sync` 修饰符能够让这一切都变得特别简单。

parent.vue:

```JavaScript
<child :title.sync="title"></child>
```

child.vue:

```JavaScript
export defalut {
  props: {
    title: String  
  },
  methods: {
    changeTitle(){
      this.$emit('update:title', 'hello')
    }
  }
}
```

只需要在绑定属性上添加 `.sync`，在子组件内部就可以触发 `update:属性名` 来更新 `prop`。可以看到这种手段确实简洁且优雅，这让父组件的代码中减少一个“没必要的函数”。

##  provide/inject

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。

简单来说，一个组件将自己的属性通过 `provide` 暴露出去，其下面的子孙组件 `inject` 即可接收到暴露的属性。

App.vue:

```JavaScript
export default {
  provide() {
    return {
        app: this
    }
  } 
}
```

child.vue:

```JavaScript
export default {
  inject: ['app'],
    created() {
      console.log(this.app) // App.vue实例
  }
}
```

在 2.5.0+ 版本可以通过设置默认值使其变成可选项:

```JavaScript
export default {
  inject: {
    app: {
        default: () => ({})
    }
  },
  created() {
    console.log(this.app) 
  }
}
```

如果你想为 `inject` 的属性变更名称，可以使用 `from` 来表示其来源：

```JavaScript
export default {
  inject: {
    myApp: {
      // from的值和provide的属性名保持一致
      from: 'app',
      default: () => ({})
    }
  },
  created() {
    console.log(this.myApp) 
  }
}
```

需要注意的是 `provide` 和 `inject` 主要在开发高阶插件/组件库时使用。并不推荐用于普通应用程序代码中。但是某些时候，或许它能帮助到我们。

##  小型状态管理器

大型项目中的数据状态会比较复杂，一般都会使用 `vuex` 来管理。但在一些小型项目或状态简单的项目中，为了管理几个状态而引入一个库，显得有些笨重。

在 2.6.0+ 版本中，新增的 `Vue.observable` 可以帮助我们解决这个尴尬的问题，它能让一个对象变成响应式数据：

```JavaScript
// store.js
import Vue from 'vue'

export const state = Vue.observable({ 
  count: 0 
})
```

使用：

```JavaScript
<div @click="setCount">{{ count }}</div>

import {state} from '../store.js'

export default {
  computed: {
    count() {
      return state.count
    }
  },
  methods: {
    setCount() {
      state.count++
    }
  }
}
```

当然你也可以自定义 `mutation` 来复用更改状态的方法：

```js
import Vue from 'vue'

export const state = Vue.observable({ 
  count: 0 
})

export const mutations = {
  SET_COUNT(payload) {
    if (payload > 0) {
      state.count = payload
    } 
  }
}
```
使用：

```js
import {state, mutations} from '../store.js'

export default {
  computed: {
    count() {
      return state.count
    }
  },
  methods: {
    setCount() {
      mutations.SET_COUNT(100)
    }
  }
}
```

##  卸载watch观察

通常定义数据观察，会使用选项的方式在 `watch` 中配置：
```js
export default {
  data() {
    return {
      count: 1      
    }
  },
  watch: {
    count(newVal) {
      console.log('count 新值：'+newVal)
    }
  }
}
```

除此之外，数据观察还有另一种函数式定义的方式：

```js
export default {
  data() {
    return {
      count: 1      
    }
  },
  created() {
    this.$watch('count', function(){
      console.log('count 新值：'+newVal)
    })
  }
}
```
它和前者的作用一样，但这种方式使定义数据观察更灵活，而且 $watch 会返回一个取消观察函数，用来停止触发回调：

```js
let unwatchFn = this.$watch('count', function(){
  console.log('count 新值：'+newVal)
})
this.count = 2 // log: count 新值：2
unwatchFn()
this.count = 3 // 什么都没有发生...
```
$watch 第三个参数接收一个配置选项：

```js
this.$watch('count', function(){
  console.log('count 新值：'+newVal)
}, {
  immediate: true // 立即执行watch
})
```

##  巧用template

相信 v-if 在开发中是用得最多的指令，那么你一定遇到过这样的场景，多个元素需要切换，而且切换条件都一样，一般都会使用一个元素包裹起来，在这个元素上做切换。

```html
<div v-if="status==='ok'">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</div>
```

如果像上面的 `div` 只是为了切换条件而存在，还导致元素层级嵌套多一层，那么它没有“存在的意义”。
我们都知道在声明页面模板时，所有元素需要放在 `<template>` 元素内。除此之外，它还能在模板内使用，`<template>` 元素作为不可见的包裹元素，只是在运行时做处理，最终的渲染结果并不包含它。

```html
<template>
  <div>
    <template v-if="status==='ok'">
      <h1>Title</h1>
      <p>Paragraph 1</p>
      <p>Paragraph 2</p>
    </template>
  </div>
</template>
```

同样的，我们也可以在 `<template>` 上使用 `v-for` 指令，这种方式还能解决 `v-for` 和 `v-if` 同时使用报出的警告问题。

```html
<template v-for="item in 10">
    <div v-if="item % 2 == 0" :key="item">{{item}}</div>
</template>
```

template使用`v-if`，
template使用`v-for`

##  过滤器复用

过滤器被用于一些常见的文本格式化，被添加在表达式的尾部，由“管道”符号指示。

```html
<div>{{ text | capitalize }}</div>
```
```js
export default {
  data() {
    return {
      text: 'hello'
    }  
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
```

试想一个场景，不仅模板内用到这个函数，在 `method` 里也需要同样功能的函数。但过滤器无法通过 `this` 直接引用，难道要在 `methods` 再定义一个同样的函数吗？

要知道，选项配置都会被存储在实例的 `$options` 中，所以只需要获取 `this.$options.filters` 就可以拿到实例中的过滤器。

```js
export default {
  methods: {
    getDetail() {
      this.$api.getDetail({
        id: this.id
      }).then(res => {
        let capitalize = this.$options.filters.capitalize
        this.title = capitalize(res.data.title)
      })
    }
  }
}
```

除了能获取到实例的过滤器外，还能获取到全局的过滤器，因为 `this.$options.filters` 会顺着 `__proto__` 向上查找，全局过滤器就存在原型中。

##  自定义指令获取实例

有的情况下，当需要对普通 `DOM` 元素进行底层操作，这时候就会用到自定义指令。像是项目中常用的权限指令，它能精确到某个模块节点。大概思路为获取权限列表，如果当前绑定权限不在列表中，则删除该节点元素。

```js
Vue.directive('role', {
  inserted: function (el, binding, vnode) {
    let role = binding.value
    if(role){
      const applist = sessionStorage.getItem("applist")
      const hasPermission = role.some(item => applist.includes(item)) 
      // 是否拥有权限
      if(!hasPermission){
        el.remove() //没有权限则删除模块节点
      }
    }
  }
})
```

自定义指令钩子函数共接收3个参数，包括 `el` (绑定指令的真实dom)、`binding` (指令相关信息)、`vnode` (节点的虚拟dom)。

假设现在业务发生变化，`applist` 存储在 `vuex` 里， 但指令内想要使用实例上的属性，或者是原型上的 `$store`。我们是没有办法获取到的，因为钩子函数内并没有直接提供实例访问。`vnode` 作为当前的虚拟`dom`，它里面可是绑定到实例上下文的，这时候访问 `vnode.context` 就可以轻松解决问题。

```js
Vue.directive('role', {
  inserted: function (el, binding, vnode) {
    let role = binding.value
    if(role){
      // vnode.context 为当前实例
      const applist = vnode.context.$store.state.applist
      const hasPermission = role.some(item => applist.includes(item)) 
      if(!hasPermission){
        el.remove()
      }
    }
  }
})
```

##  优雅注册插件

插件通常用来为 `Vue` 添加全局功能。像常用的 `vue-router`、`vuex` 在使用时都是通过 `Vue.use` 来注册的。`Vue.use` 内部会自动寻找 `install` 方法进行调用，接受的第一个参数是 `Vue` 构造函数。

一般在使用组件库时，为了减小包体积，都是采用按需加载的方式。如果在入口文件内逐个引入组件会让 `main.js` 越来越庞大，基于模块化开发的思想，最好是单独封装到一个配置文件中。配合上 `Vue.use`，在入口文件使用能让人一目了然。

```js
// vant.config.js：
import {
  Toast,
  Button
} from 'vant'

const components = {
  Toast,
  Button
}

const componentsHandler = {
  install(Vue){
    Object.keys(components).forEach(key => Vue.use(components[key]))
  }
}

export default componentsHandler
```

```js
// main.js:
import Vue from 'vue'
import vantCompoents from '@/config/vant.config'

Vue.config.productionTip = false

Vue.use(vantCompoents)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

##  自动化引入模块

在开发中大型项目时，会将一个大功能拆分成一个个小功能，除了能便于模块的复用，也让模块条理清晰，后期项目更好维护。

像 `api` 文件一般按功能划分模块，在组合时可以使用 `require.context` 一次引入文件夹所有的模块文件，而不需要逐个模块文件去引入。每当新增模块文件时，就只需要关注逻辑的编写和模块暴露，`require.context` 会帮助我们自动引入。

需要注意 `require.context` 并不是天生的，而是由 `webpack` 提供。在构建时，`webpack` 在代码中解析它。

```js
let importAll = require.context('./modules', false, /\.js$/)

class Api extends Request{
  constructor(){
    super()
    //importAll.keys()为模块路径数组
    importAll.keys().map(path =>{
      //兼容处理：.default获取ES6规范暴露的内容; 后者获取commonJS规范暴露的内容
      let api = importAll(path).default || importAll(path)
      Object.keys(api).forEach(key => this[key] = api[key])
    })
  }
}

export default new Api()
```

`require.context` 参数：

1.  文件夹路径
2.  是否递归查找子文件夹下的模块
3.  模块匹配规则，一般匹配文件后缀名

只要是需要批量引入的场景，都可以使用这种方法。包括一些公用的全局组件，只需往文件夹内新增组件即可使用，不需要再去注册。如果还没用上的小伙伴，一定要了解下，简单实用又能提高效率。

##  路由懒加载(动态chunkName)

路由懒加载作为性能优化的一种手段，它能让路由组件延迟加载。通常我们还会为延迟加载的路由添加“魔法注释”`(webpackChunkName)`来自定义包名，在打包时，该路由组件会被单独打包出来。

```js
let router = new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component: import(/* webpackChunkName: "login" */ `@/views/login.vue`)
    },
    {
      path:'/index',
      name:'index',
      component: import(/* webpackChunkName: "index" */ `@/views/index.vue`)
    },
    {
      path:'/detail',
      name:'detail',
      component: import(/* webpackChunkName: "detail" */ `@/views/detail.vue`)
    }
  ]
})
```

上面这种写法没问题，但仔细一看它们结构都是相似的，作为一名出色的开发者，我们可以使用 `map` 循环来解决这种重复性的工作。

```js
const routeOptions = [
  {
    path:'/login',
    name:'login',
  },
  {
    path:'/index',
    name:'index',
  },
  {
    path:'/detail',
    name:'detail',
  },
]

const routes = routeOptions.map(route => {
  if (!route.component) {
    route = {
      ...route,
      component: () => import(`@/views/${route.name}.vue`)
    }
  }
  return route
})

let router = new Router({
  routes
})
```

在书写更少代码的同时，我们也把“魔法注释”给牺牲掉了。总所周知，代码中没办法编写动态注释。这个问题很尴尬，难道就没有两全其美的办法了吗？

强大的 `webpack` 来救场了，从 `webpack` 2.6.0 开始，占位符 `[index]` 和 `[request]` 被支持为递增的数字或实际解析的文件名。我们可以这样使用“魔法注释”：

```js
const routes = routeOptions.map(route => {
  if (!route.component) {
    route = {
      ...route,
      component: () => import(/* webpackChunkName: "[request]" */ `@/views/${route.name}.vue`)
    }
  }
  return route
})
```