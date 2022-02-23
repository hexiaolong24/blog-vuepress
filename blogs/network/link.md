---
title: link
date: 2021-09-12
sidebar: 'auto'
categories:
 - network
tags:
 - network
---

##  link  外部资源链接元素
-   rel,关系 (relationship) 链接类型 icon 
-   sizes 图标大小
-   media
```js
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">
```
-   as 设置了rel="preload" 或者 rel="prefetch" 时才能使用。它规定了<link>元素加载的内容的类型
    -   audio
    -   document	
    -   fetch
    -   font
    -   image
    -   script
    -   style
    -   video
    -   worker

-   importance优先级,只有存在rel=“preload”或rel=“prefetch”时，importance属性才能用于<link>元素
-   crossorigin  anonymous会发起一个跨域请求  use-credentials发起带认证信息的跨域请求
    -   请求头带Origin: HTTP 头
    -   响应头Access-Control-Allow-Origin: HTTP 头

-   title可以选择不同的样式表

```js
<link href="default.css" rel="stylesheet" title="Default Style">
<link href="fancy.css" rel="alternate stylesheet" title="Fancy">
<link href="basic.css" rel="alternate stylesheet" title="Basic">
```
-   onload onerror
```js
<link rel="stylesheet" href="mystylesheet.css" onload="sheetLoaded()" onerror="sheetError()">
```

##  prefetch 
-   prefetch,它旨在预取将在下一次导航/页面加载中使用的资源,浏览器会给prefetch资源的优先级低于资源preload——当前页面比下一个页面更重要

##  preload 类型链接预加载
-   as href rel
```js
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="main.js" as="script">
```

##  font
-   在获取字体时必须添加一个crossorigin属性，因为它们是使用匿名模式 CORS 获取的。是的，即使您的字体与页面同源
```js
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```
-   可以加载
```js
/* 同源（即域、方案、端口匹配文档）*/src: url(fonts/simple.woff);

/* 没有重定向的数据 url 被视为同源 */
src: url("data:application/font-woff;base64,...");

/* 跨域，不同域 */
/* Access-Control-Allow-Origin 响应头设置为 '*' */
src: url(http://another.example.com/fonts/simple.woff);
```
-   不能加载
```js
/* 跨源，不同的方案 *//* 响应中没有 Access-Control-xxx 标头 */
源代码：网址（http://example.com/fonts/simple.woff）；

/* 跨域，不同域 */
/* 响应中没有 Access-Control-xxx 标头 */
src: url(http://another.example.com/fonts/simple.woff);
```

##  不立即执行资源
-   先用link预加载，再执行的时候创建script标签
```js
// 预加载
var preload = document.createElement("link");
link.href = "myscript.js";
link.rel = "preload";
link.as = "script";
document.head.appendChild(link);

// 执行
var script = document.createElement("script");
script.src = "myscript.js";
document.body.appendChild(script);
```

##  先预加载，加载完之后立即执行
-   监听onload事件
```js

<link rel="preload" as="script" href="async_script.js"
onload="var script = document.createElement('script');
        script.src = this.href;
        document.body.appendChild(script);">
```