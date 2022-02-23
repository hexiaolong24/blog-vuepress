---
title: v-model
date: 2019-04-11
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
---

##  双向数据绑定为什么不能造成死循环
-   以input为例，其实是监听的input事件，绑定的value属性
-   当我们主动在视图中更改input的值时，会触发input事件，这会导致data中对应的属性发生更改
-   这时疑问发生，既然data中的数据更改了，那么会导致视图中的数据也更改，这样就会循环起来
-   但其实不是的，当data中的数据更改的时候，或者主动this.xxx = xxx;更改时不会触发input事件，所以不会造成死循环
