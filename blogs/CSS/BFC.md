---
title: BFC
date: 2018-10-28
sidebar: 'auto'
categories:
 - CSS
tags:
 - CSS
---

##  解决浮动引起的父元素高度塌陷

-   如果是定位引起的，那么只能给父元素加高
1.  同上，父元素加高
2.  父元素开启BFC,absolute fixed float inline-block本质是开启IFC
3.  父元素overflow: hidden;本质也是开启BFC
5.  伪元素
```
.clearfix: after {
    content: '',
    display: block/table;
    clear: both;
}
```

##  BFC
### 概念
-   Block Formatting Context 块级格式化上下文，BFC它决定了元素如何对其内容进行定位，以及与其它元素的关系和相互作用，当涉及到可视化布局时，Block Formatting Context提供了一个环境，HTML在这个环境中按照一定的规则进行布局。
-   通俗理解BFC是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。有点类似与作用域的意思

### 怎样触发BFC
-   float的值不为none
-   overflow的值不为visible
-   display的值为block table inline-block(IFC)
-   position的值不为relative和static

### BFC内规则
-   内部盒子会垂直排列
-   垂直方向的距离由margin决定， 属于同一个BFC的两个相邻的标签外边距会发生重叠
-   计算BFC的高度时，浮动子元素也参与计算
-   BFC就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签

### 解决什么问题
-   float引起的高度塌陷
-   相邻兄弟元素margin重叠问题，在其中一个元素外包一层BFC元素
```js
<style>
    .wrap {
        overflow: hidden;
    }
    p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 100px;
    }
</style>
<body>
    <p>Haha</p>
    <div class="wrap">
        <p>Hehe</p>
    </div>
</body>
```

##  IFC
-   内联格式上下文 IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来

##  GFC（GrideLayout formatting contexts）：网格布局格式化上下文

##  FFC（Flex formatting contexts）:自适应格式上下文 