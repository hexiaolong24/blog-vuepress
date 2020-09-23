---
title: Vue
date: 2019-08-31
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
 - 前端
 - 框架
---

## vue框架特点

1. 是一套构建用户界面(`user interface`)的渐进式框架。与其他重量级框架不同的是，`Vue` 从根本上采用最小成本、渐进增量(`incrementally adoptable`)的设计。`Vue` 的核心库只专注于视图层，并且很容易与其他第三方库或现有项目集成。\

2. 使用的是`MVVM`架构模式

   - M： `Model`数据层，负责保存数据

   - VM： `ViewModel`控制层, 负责接收`View`和用户响应，将数据传递给`Model`或者从`Model`中获取数据交给`View`展现

   - V： `View`视图层，负责从`controller`层获取数据显示数据及响应用户操作

   -  重点: `VM`层和`Model`层及`View`层实现了双向数据通信，当`View`层或者`Model`层的数据变化的时候都能够通过数据流管道直接导向对方，不需要做额外处理，优点是数据驱动，数据通信灵敏及时，`ViewModel`负荷减轻

3. MVC
   -  M： `Model`数据层，负责保存数据

   -  C： `Controller`控制层, 负责接收`View`和用户响应，将数据传递给`Model`或者从`Model`中获取数据交给`View`展现

   -  V： `View`视图层，负责从`controller`层获取数据显示数据及响应用户操作

   -  重点： `Model`和`View`没有直接通信，都是通过中间人`Controller`来传递，所以`Controller`中的负荷越来越重

## 生命周期函数

1. beforeCreate（`$el`不可见）

   - 在实例初始化之后，立即同步调用，在数据观察(`data observer`)和 `event/watcher` 配置之前被调用。

   - 自己理解：数据初始化之前，`vm`实例已经创建，`$el`不可见

2. created（`$el`不可见）

   - 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(`data observer`)，属性和方法的运算， `watch/event` 事件回调。然而，挂载阶段还没开始，`$el` 属性目前不可见。

   - 自己理解：数据初始化之后，已经实现数据代理，数据绑定，双向数据绑定

3. beforeMount（`$el`不可见）

   - 在挂载开始之前被调用：相关的 `render` 函数首次被调用。

   - 在`beforeMount`的时候发送请求处理大量数据的话会导致页面渲染时间延长，造成用户体验差

   - 特例： 首屏首次渲染的时候立马需要的数据可以在`beforeMount`发送，数据量不能太大

4. mounted（`$el`可见）

   - 在实例挂载之后调用，其中 `el` 被新创建的 `vm.$el` 替代。如果 `root` 实例挂载了一个文档内元素，当 `mounted` 被调用时 `vm.$el` 也在文档内。

5. beforeUpdate

   - 在 `DOM` 被 `patch` 之前调用数据修改。这是在 `DOM` 更新之前，访问已有 `DOM` 的最佳时机，例如，手动地移除之前添加的事件监听器。

   - 当页面需要数据实时更新的时候可以在这发送`ajax`请求

6. updated

   - 由于数据更改导致的虚拟 `DOM` 重新渲染和打补丁，在这之后会调用该钩子。

     当这个钩子被调用时，组件 `DOM` 已经更新，所以你现在可以执行依赖于 `DOM` 的操作。然而在大多数情况下，应该避免在此期间更改状态。如果要相应状态改变，通常最好使用[计算属性](https://vue.docschina.org/v2/api/#computed)或 [watcher](https://vue.docschina.org/v2/api/#watch) 取而代之。

   - 请注意，更新并不能保证所有子组件也都已重新呈现。如果要等到整个视图重新渲染后，可以在更新后的`vm.$nextTick`中使用

7. beforeDestroy

   - 实例销毁之前调用。在这一步，实例仍然完全可用。

   - 可以清除定时器，移除`BScroll`对象等

8. destroyed

   - `Vue` 实例销毁后调用。调用后，`Vue` 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁，切断和页面的关联。

9. errorCaptured

   - 当任何一个来自后代组件的错误时被捕获时调用。此钩子函数会收到三个参数：错误对象、发生错误的组件实例，和一个包含错误在何处被捕获信息的字符串。此钩子函数可以返回 `false`，以阻止该错误继续向上冒泡。

10. activated && deactivated

    - 当组件在 `<keep-alive>` 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

    - 进入调用`activated`，离开调用`deactivated`

## 路由传参

```js
this.$route.query
this.$route.params
//可以监视$route的变化，获取最新的参数
watch: {
	$route(value){
		const id = value.params.id
	}
}
//编程式导航
this.$router.push('path')
this.$router.replace('path')
this.$router.back()
```

1. `params`传参

```js
//route
{
  path:'/home/message/detial/:id',
  component:homeMessageDetail,
},
//params传参,必须用name
```
```html
//第一种写法
<router-link :to="`/home/message/detial/${item.id}`">{{item.text}}</router-link>
```
```js
this.$router.push("/home/message/detial/"+id)
```
```js
//第二种写法
{
  name: "Detail",
  path:'/home/message/detial/:id',
  component:homeMessageDetail,
},
```
```html
<router-link :to="{name:'Detail',params:{id:item.id}}">{{item.text}}</router-link>
```

2.  `query`传参

```html
//query传参，可以用name也可以用path，一般用path，也可以直接拼串
//第一种
<router-link :to="{name:'Detail',query:{id:item.id}}">{{item.text}}</router-link>

//第二种
<router-link :to="{path:'/home/message/detial',query:{id:item.id}}">{{item.text}}</router-link>

//第三种
<router-link :to="`/home/message/detial?name=${item.id}`">{{item.text}}</router-link>
```

3.  `meta`传参

```js
{
  path:'/home/message/detial',
  component:homeMessageDetail,
  meta: {
    id:1
  }
},
```

4.  `props`传参

```js

//使用的话需要在组件内声明接收。
//第一种布尔值需要params或者query传参,布尔值用来声明是否将params参数传入当前的路由组件的props中。
{
  path:'/home/message/detial',
  component:homeMessageDetail,
  meta: {
    id:1
  },
  props: true
},
//第二种对象，不需要params或者query传参
{
  path:'/home/message/detial',
  component:homeMessageDetail,
  props: {
    id:1
  },
},

//第三种函数（能够拿到当前的路由对象），需要params或者query传参,声明形参，注入实参，实参就是当前跳转的路由对象。写好后直接取就行了
props:(route)=>{
  id:route.params.id
}

```

5.  `router-view`传参
   
```html
//只要被router-view包含的路由组件中，都可以通过this.$attrs来获取到这个参数
<router-view msg='kobe'></router-view>
```

```js
//获取参数
this.$attrs.msg;
```
   
## 组件通信

1. props传参

1 多用于‘父传子’， 通过标签属性传递，在子组件通过`props`接收
2 子传父，在父组件定义一个函数，子组件调用函数
3 隔代相传，复杂繁琐
4 兄弟之间传递，必须通过父组件

```js
// props声明接受的三种方式
props:['name', 'age']

props:{
	name:String,
	age:Number
}

props:{
	name:{type: String, required: true, default: 18}
}
```
> 注意：
	通过props传递的数据如果是基本数据类型，在子组件中修改了，不会影响父组件中的显示，不会报错，但是会有警告，如果是引用数据类型，父组件中的状态也会改变，因为传递的是引用地址，也不会报错，但是不要这样做，因为父组件的状态有可能是多个组件在共同使用，所以数据在哪，就在哪修改数据
  对比：在React中如果是基本数据类型会报错，引用数据类型不会报错

2. 自定义事件

- 父组件中通过标签属性的形式，向子组件传递一个在父组件定义的函数 `@addToDo='addtodo'`,在子组件中通过`this.$emit('addtodo',数据)`分发,给谁绑定谁才能分发事件，可以代替子传父的函数传参，通过标签属性的形式，自定义事件，`v-on:事件名='xxx'`

- 父通过`ref`找到子组件

```js
this.$ref.xxx.$on('addtodo',this.addtodo)
```

3. 自定义事件总线

```js
Vue.prototype.$globalEventBus = new Vue()
this.$globalEventBus.$on('事件名'，回调函数)
this.$globalEventBus.$emit('事件名'，数据)
//传哪个解哪个，不传都解
this.$globalEventBus.$off('事件名')
```

4. slot插槽

```html
// 1 普通插槽 父传子

<slot>默认值</slot>
<slot>想要的标签结构</slot>

// 2 具名插槽

<slot name='left'>默认值</slot>
<slot name='right'>默认值</slot>

<header>
	<span slot='left'>内容</span>
	<span slot='right'>内容</span>
</header>

// 3 作用域插槽
// 数据在子组件，子组件有部分结构需要父组件传递过去，但是父组件又会依据子组件传过来的数据，显示相应的结构
// 子组件传递数据
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    <!-- 我们为每个 todo 提供一个 slot 元素， -->
    <!-- 然后，将 `todo` 对象作为 slot 元素的一个 prop 传入。 -->
    <slot v-bind:todo="todo">
      <!-- 这里是回退内容(fallback content) -->
      {{ todo.text }}
    </slot>
  </li>
</ul>


// 父组件接收
// slot-scope的属性值是一个对象，里面包含着子组件传过来的数据
// slot-scope="{ todo }"可以使用ES6的语法，解构赋值

<todo-list v-bind:todos="todos">
  <!-- 将 `slotProps` 作为插槽内容所在作用域(slot scope)的引用名称 -->
  <template slot-scope="slotProps">
    <!-- 为 todo items 定义一个模板， -->
    <!-- 通过 `slotProps` 访问每个 todo 对象。 -->
    <span v-if="slotProps.todo.isComplete">✓</span>
    {{ slotProps.todo.text }}
  </template>
</todo-list>
```

5. pubsub

6. $refs

7. vuex

# vuex

1. 对应用中组件的状态进行集中式的管理(读/写)

2. 多用于中大型项目，组件嵌套层级较多，数据较为复杂的场景

3. 核心概念

   - store：状态管理对象
   - mutations：本质是函数，负责为`store`提供修改后的最新的数据
   - actions：本质是函数，负责调用`mutations`并为`mutations`提供参与修改状态的最新数据
   - dispatch：本质是函数负责分发调用指定的`action`，并且为`action`提供数据
   - commit：本质是函数，调用`mutations`，并且为`mutations`提供数据
   - 发送异步请求必须在`actions`中，如果不发请求，可以不写`actions`，直接`commit`
   - getters：依据`state`计算出新的状态数据

4. 代码模板

index.js

```js
Vue.use(Vuex)

export default new Vuex.Store({
  mutations,
  actions,
  getters,
  modules:{
    Msite,
    Shop,
    User
  }
})
```

- 模块
- `mutations`中可以接受两个参数`(state,goods)`
- `actions`中也可以接受两个参数`({ commit,state },{ isAdd,food })`
- `commit(RESET_RATINGS,ratings)`
- `this.$store.dispatch('updateFoodCount',{isAdd,food:this.food})`
-  在模块化中取`state`的方法
```js
...mapState({
  shopcart: state => state.Shop.shopcart,
  info: state => state.Shop.info
}),
```
- 在模块化中取`getters`与原来相同`...mapGetters(["totalCount", "totalPrice"])`

```js
import {
  RESET_GOODS,
  RESET_RATINGS,
  RESET_INFO,
  ADD_FOOD_COUNT,
  REDUCE_FOOD_COUNT,
  CLEAR_ALL
} from '../mutation_types';
import { reqGoods, reqInfo, reqRatings } from "../../api";
import Vue from 'vue';
const state = {
  goods:[],
  ratings:[],
  info:{},
  shopcart:[]
}
const mutations = {
  [RESET_GOODS](state, goods){
    state.goods = goods
  },
  [RESET_RATINGS](state, ratings){
    state.ratings = ratings
  },
  [RESET_INFO](state, info){
    state.info = info
  },

  //增加
  [ADD_FOOD_COUNT](state,{ food }){
    if (food.count) {
      food.count++
    }else {
      //原有的数据是可以监视的，但是如果是自己新添加的，就不会获得监视，页面不能同时更新
      //必须使用Vue.set,添加一个响应式的属性
      // food.coutn = 1 错误的
      Vue.set(food,'count',1)
      state.shopcart.push(food)
    }
  },
  //减少
  [REDUCE_FOOD_COUNT](state,{food}){
    if (food.count>0) {
      food.count--
      if (food.count === 0) {
        state.shopcart.splice(state.shopcart.indexOf(food),1)
      }
    }
  },
  //清空购物车
  [CLEAR_ALL](state){
    state.shopcart.forEach(food => {
      food.count = 0
    });
    state.shopcart = []
  }
}
const actions = {
  async getGoods ({commit}) {
    const result = await reqGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RESET_GOODS,goods)
    }
  },
  async getInfo ({commit}) {
    const result = await reqInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RESET_INFO,info)
    }
  },
  async getRatings ({commit}) {
    const result = await reqRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RESET_RATINGS,ratings)
    }
  },
  updateFoodCount ({commit},{isAdd, food}){
    if (isAdd) {//增加
      commit(ADD_FOOD_COUNT,{food})
    }else {//减少
      commit(REDUCE_FOOD_COUNT,{food})
    }
  }
}
const getters = {
  totalCount (state) {
    return state.shopcart.reduce((pre,food) => pre + food.count,0)
  },
  totalPrice (state) {
    return state.shopcart.reduce((pre,food) => pre + food.count*food.price,0)
  }
}

export default{
  state,
  mutations,
  actions,
  getters
}
```


## computed、methods、watch

- 计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。注意，如果实例范畴之外的依赖 (比如非响应式的 `not reactive`) 是不会触发计算属性更新的。

- `computed` 属性会基于它所依赖的数据进行缓存。每个 `computed` 属性，只有在它所依赖的数据发生变化时，才会重新取值(`re-evaluate`)。这就意味着，只要 `message` 没有发生变化，多次访问 `computed` 属性 ，将会立刻返回之前计算过的结果，而不必每次都重新执行函数。

- 相比之下，每当触发重新渲染(`re-render`)时，`method` 调用方式将总是再次执行函数。

- 为什么我们需要将依赖数据缓存起来？假设一种场景，我们有一个高性能开销(`expensive`)的 `computed` 属性 **A**，在 `computed` 属性的 `getter` 函数内部，需要遍历循环一个巨大数组，并进行大量计算。然后还有其他 `computed` 属性直接或间接依赖于 **A**。如果没有缓存，我们将不可避免地多次执行 **A** 的 `getter` 函数，这远多余实际需要执行的次数！然而在某些场景下，你可能不希望有缓存，请使用 `method` 方法替代。

- `watch` 属性是很吸引人的使用方式，然而，当你有一些数据需要随着另外一些数据变化时，过度滥用 `watch` 属性会造成一些问题 - 尤其是那些具有 `AngularJS` 开发背景的开发人员。因此，更推荐的方式是，使用 `computed` 属性，而不是命令式(`imperative`)的 `watch` 回调函数

- 虽然在大多数情况下，更适合使用 `computed` 属性，然而有些时候，还是需要一个自定义 `watcher`。这就是为什么 `Vue` 要通过 `watch` 选项，来提供一个更加通用的响应数据变化的方式。当你需要在数据变化响应时，执行异步操作，或高性能消耗的操作，自定义 `watcher` 的方式就会很有帮助。

- 什么时候想缓存中添加计算属性

  - `get`返回一个新的值
  
  - 主动改变了属性

- 调用了`get`方法返回了一个新的值，不会调用`set`方法

## 过滤器

- 过滤器可以在两种场景中使用：**双花括号插值(mustache interpolation)和 v-bind 表达式**。过滤器应该追加到 JavaScript 表达式的末尾，以“管道符号(`pipe symbol`)”表示

```html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```
```js
//局部定义
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

//在创建Vue实例之前，定义一个全局的过滤器
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//链式调用
{{ message | filterA | filterB }}
```

## 自定义指令

### 指令钩子函数

- `bind`：在指令第一次绑定到元素时调用，只会调用一次。可以在此钩子函数中，执行一次性的初始化设置。

- `inserted`：在已绑定的元素插入到父节点时调用（只能保证父节点存在，不一定存在于 `document` 中）

- `update`：在包含指令的组件的 `VNode` 更新后调用，**但可能之前其子组件已更新**。指令的值可能更新或者还没更新，然而可以通过比较绑定的当前值和旧值，来跳过不必要的更新（参考下面的钩子函数）

- `componentUpdated`：在包含指令的组件的 `VNode` 更新后调用，并且其子组件的 `VNode` 已更新。

- `unbind`：在指令从元素上解除绑定时调用，只会调用一次。

### 参数

- `el`：指令绑定的元素。可以用于直接操作 `DOM`

- `binding`：一个对象，包含以下属性
  - `name`：指令的名称，不包括 `v-` 前缀
  - `value`：向指令传入的值
  - `oldValue`：之前的值，只在 `update` 和 `componentUpdated` 钩子函数中可用
  - `expression`：指令绑定的表达式(`expression`)，以字符串格式
  - `arg`：向指令传入的参数
  - `modifiers`：一个对象，包含修饰符，如果有的话

- `vnode`：由 `Vue` 编译器(`Vue’s compiler`)生成的虚拟 `Node` 节点(`virtual node`)

- `oldVnode`：之前的虚拟 `Node` 节点(`virtual node`)，只在 `update` 和 `componentUpdated`钩子函数中可用

# vue扩展

## 动态组件、缓存组件、异步组件

1. 动态组件
    通过`<component :is="componentName">`来动态决定渲染哪个组件
    被切换的组件默认会被自动销毁

2. 缓存组件
    通过`<keep-alive>`来缓存被切换的动态组件(非路由组件)
    也可以缓存路由组件

3. 异步组件（路由懒加载）
    在需要组件时, 才异步请求加载组件的代码,动态`import()`按照一定的条件或者按需加载模块
    `const Miste = () => import('文件路径')`

## 图片懒加载

```js
import VueLazyload from 'vue-lazyload'
import loading from '图片路径'

Vue.use(VueLazyload,{
	loading
})
```
使用示例，如果涉及到当前图片是动态的，有可能切换显示，必须使用v-if，因为用了图片懒加载之后，用v-show默认你是有一张图片的，那这样就不会接受新的图片，不能实现切换的效果
```html
<img v-lazy='food.image'>
```

## 路由守卫

全局路由守卫直接写在`router`文件夹的`index.js`中，组件路由守卫直接写在组件中。路由守卫的另一个用法，如果一个组件没有被`<keep-alive>`包住，可以在`beforeDestory`中做清除的相关操作，但是如果被包住了，说明路由组件不能销毁，如果需要在离开或者进入的时候做相关操作，可以使用组件路由守卫，也可以使用`activated`和`deactivated`的生命周期函数


## mixin混合(不推荐使用，后期维护成本大)

1. 作用:
    复用多个组件重复的JS代码(配置)
    一个`mixin`是一个可复用的组件配置对象
2. 定义`mixin`
```js
var myMixin = {
  data () {
    return {
      a: 'a1111',
    }
  },
  computed: {
    length () {
      return this.a.length
    }
  }
}
```
3. 多组件中引入`mixin`,通过`mixins`配置引用,mixin中的配置与当前组件的配置会自动合并

```js
mixins: [myMixin]
```

## 原生事件和vue自定义事件

1. 什么时候是DOM原生事件

a) 给`html`标签绑定的`dom事件监听`

b) 给组件标签绑定的`dom事件监听`，必须使用`.native`,绑定到了组件的根元素上

```html
<MyCommponent @click.native="handleClick">
```
2. 什么时候是自定义事件

a) 自定义事件名
b) 给组件绑定`dom事件监听`,但是没有用`.native`

## 在组件标签上使用v-model

1. `v-model`的本质
```html
<!-- 相当于下面的表达式 -->
<input v-model="name">

<input :value="name" @input="name = $event.target.value">
```
2. 在自定义组件上使用`v-model`

```html
<!-- 相当于下面的表达式 -->
<MyInput v-model="name">
<!-- 这里的input是自定义事件 -->
<MyInput :value="name" @input='handleinput'> 
```

```js
methods: {
  handleinput(){
      this.name=value
  }
}
```

```html
<!-- 在 MyInput.vue 中，声明接受value，并且给input绑定input监听，分发事件 -->
props: ['value']
<input :value='value' @input="$emit('input', $event.target.value)">
```

## vue的响应式原理

1. 关注点有哪些?
- `vue`的数据绑定效果: 组件更新`data`数据后, 当前组件及相关的子组件都会更新相应的节点
- 如何知道数据变化了?
- 通知哪些组件更新渲染?
- 组件更新渲染是同步还是异步的?
    
2. 基本原理
- 在初始化时: 利用`Object.defineProperty()`给`data`属性添加 `setter` 监视数据变化
- 在初始化时: 每个组件实例都有相应的观察者 `watcher` 对象, 每个属性都关联上所有相关的`watcher`对象
- 在更新数据后: 对应的`setter`调用, 通知所有相关的`watcher`, `watcher`内异步更新节点或者子组件

3. 一些细节
- 只有`data`中属性是响应式的, 只在组件对象上的属性不是响应式的
- `data`中所有层次属性都是响应式的
- 直接给`data`中响应式属性对象添加一个新的属性, 默认不是响应式的, 需要用`Vue`提供的语法添加

```js
Vue.set(obj, propName, value)
vm.$set(obj, propName, value)
```
- `vue`的异步更新: 
  - `vue` 在内部尝试对异步队列使用原生的 `Promise.then` 和 `MessageChannel`，
  - 如果执行环境不支持，会采用 `setTimeout(fn, 0)` 代替
- 关于`<Root>`组件标签: 
  - 整体应用界面的根标签不是`<App>`, 而是`<Root>`, 
  - `<Root>`对应的是`vm`
  - index页面中的的`div`元素会被替换, 而不是插入其中
- 组件的`data`配置为什么不能是对象?
  - 组件会被多次使用, 每次使用都会读取`data`配置值, 如果是对象, 那就会共用一个`data`对象
  - 而函数就没有问题, 因为每次调用函数返回一个新的`data`对象

