---
title: vue性能优化
date: 2020-08-08
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
 - 前端
 - 框架
---

##  代码层面

1.  v-if 和 v-show
-   v-if dom的销毁与重建
```css
// v-show
// 页面不占位,下面元素上移 事件不能触发
display: none;

// 占位 事件能触发
opacity: 0;

// 占位 事件不能触发
visibility: hidden;

```

2.  computed 和 wacth

watch 选项提供了一个更通用的方法，来响应数据的变化。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。
computed中不能执行异步操作

3.  v-for 遍历必须为 item 添加 key，且避免同时使用 v-if

4.  数据只做展示使用，不需要初始化响应式数据，则冻结数据提升性能 Object.freeze()

```js
export default {
  data: () => ({
    users: {}
  }),
  async created() {
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
};
```

5.  事件的销毁

6.  图片懒加载 vue-lazyload插件 v-lazy 

7.  路由懒加载 () => import('./xxx.vue')

8.  第三方插件按需引入

9.  优化无限列表性能 vue-virtual-scroll-list vue-virtual-scroller 

10. 服务端渲染 SSR or 预渲染

##  Webpack 层面的优化

1.  Webpack 对图片进行压缩  image-webpack-loader

2.  减少 ES6 转为 ES5 的冗余代码 babel-plugin-transform-runtime

3.  提取公共代码 CommonsChunkPlugin

4.  模板预编译

5.  提取组件css

6.  优化SourceMap

7.  构建结果输出分析 webpack-bundle-analyzer


