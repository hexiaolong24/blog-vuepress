---
title: 盒模型box model
date: 2018-08-28
sidebar: 'auto'
categories:
 - CSS
tags:
 - CSS
---

##  标准盒模型

box-sizing:content-box;默认值

##  内容区 内边距 边框 外边距 content padding border margin

padding border默认向外扩大，content大小不受影响，文本内容在content中

1.  maring 可以是负值，如果是负值，元素自动向相反的方向移动

2.  margin 可以使用auto，如果水平方向设置auto，浏览器会将水平外边距取最大,如果是垂直方向设置auto，浏览器会将垂直方向设置为0

3.  垂直方向外边距的重叠：兄弟元素垂直外边距会取最大值

4.  父子元素，子元素的上外边距会传递给父元素

##  怪异盒模型 

box-sizing:border-box;

padding border默认向里去挤，content内容区的大小会变小

##  关于背景图片、背景颜色的填充问题

1 填充区域 content padding border

2 背景图片默认起始位置 padding 左上角 ，但是border的默认颜色是黑色，如果想看到border区域显示图片，需要设置透明，如果设置了background-repeat: no-repeat；图片还足够大，则border-right 和border-bottom的区域会看到

3 背景裁剪 background-clip: border-box;默认值，background-clip: padding-box;裁去padding以外的，也就是border区域看不到，background-clip: content-box;

4 背景起始位置background-origin: padding-box;默认是padding区域，可以更改为border或者content

5 background-position背景图片位置，与background-origin配合使用，确定坐标原点内联元素盒模型

##  内联元素盒模型

1 margin只能设置水平方向，垂直方向不影响布局

2 padding border 都可以设置（也就是背景颜色和背景图片都可以出现，自己content区的内容也可以改变，）其中水平方向的会影响布局，垂直方向的不会影响布局

3 不能设置宽高