---
title: growthReport
date: 2019-10-12
sidebar: 'auto'
categories:
 - projects
isShowComments: false
---

##  概述

- 成长报告根据不同用户的学习情况，从十几个维度，展示用户一年的学习数据
- 使用swiper创建竖版轮播图
- 每一个组件都是一张轮播图

##  动态组件

- is 属性值是组件名字或者是组件的选项对象
```js
// 组件的选项对象
<component v-bind:is="currentTab.component" class="tab"></component>

{
  name: "Home",
  component: {
    template: "<div>Home component</div>"
  }
},
```

```js
// 使用keep-alive可以缓存组件，动态第一次加载时候就会缓存，不用再重复加载 
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>

<component
  :is="getCurrentComp(item)"
  :isIpad="isIpad"
  :data="item"
  :isLast="isLast"
  :nickName="NickNameInFirst"/>
```

##  异步组件

```js
import Vue from 'vue';
const later = Vue.component('later', function (resolve) {
    require(['./later.vue'], resolve)
});
const later2 = Vue.component('later2', function (resolve) {
    require(['./later2.vue'], resolve)
});
```

```js
Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

```js
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

- 当index是0的时候返回0，1 
- index是length-1的时候返回 length-1和length-2
- 剩余的返回index-1 index index+1

- 监听echarts onfinished事件，保证截图时echarts已经截图完成

- PhantomJS实现服务端截图