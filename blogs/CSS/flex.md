---
title: flex
date: 2018-09-28
sidebar: "auto"
categories:
  - CSS
tags:
  - CSS
---

# 容器属性

## flex-direction

- 默认值 row 行
- column 列
- row-reverse 主轴 start end 翻转
- column-reverse 侧轴 start end 翻转

## justify-content

- flex-start 默认值
- flex-end
- center
- space-around 空间包含项目
- space-between 项目包含空间
- space-evenly 项目与边框距离全部都相等

## align-items 侧轴富裕空间

- flex-start
- flex-end
- center
- stretch 默认值 拉伸 占满整个侧轴
- baseline 按第一行文字基线对齐

## flex-wrap

- nowrap 默认值 不换行
- wrap 元素换行
- wrap-reverse 元素换行，并且侧轴 start end 翻转

## flex-flow

- 是 flex-direction 和 flex-wrap 的简写形式
- flex-flow: flex-direction flex-wrap

## align-content 整体侧轴 前提是换行，如果没有换行看 align-items

- flex-start
- flex-end
- stretch
- space-around
- space-between
- center

# 项目属性

## order

- 默认值为 0 按从小到大的顺序排列，可以是负数

## flex-grow 项目弹性空间（放大比例）

- 默认值是 0，如果存在额外空间也不放大，负值无效

## flex-shrink

- 默认值是 1，表示如果空间不够，该项目会缩小，如果是 0，不会缩小

## flex-basis

- 当一个元素同时被设置了 flex-basis (除值为 auto 外) 和 width (或者在 flex-direction: column 情况下设置了 height) , flex-basis 具有更高的优先级.
- max-width/min-width > flex-basis > width > box
- 属性值可以是长度（20%，10rem 等）或者默认值 auto，自身的宽

## align-self 自身的侧轴富裕空间，可覆盖侧轴富裕空间

- align-items 是整体，假如 align-items: flex-start; 第一个元素 align-self: flex-end;那么第一个元素会是 end 方向，覆盖整体的侧轴富裕空间

## flex 简写形式 flex: 1;等分布局

- flex-grow 1
- flex-shrink 1
- flex-basis 0 (任意数字+任意长度单位)

## 等分布局

- display: flex;
- 除第一个子元素: margin-left: auto;

```html
<div class="wrap">
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

```CSS
.wrap {
  width: 200px;
  display: flex;
  align-items: flex-end;
  background-color: #eee;
  justify-content: space-between;
}
.left {
  width: 50px;
  background-color: pink;
}
.right {
  height: 100px;
  flex-grow: 1;
  background-color: yellow;
}
```

```CSS
.wrap {
  width: 1000px;
  display: flex;
  background-color: #999;
}
/*
  100 + 500 * 2/5 = 300
*/
.left {
  flex: 2 0 100px;
  background-color: pink;
}
/*
  400 + 500 * 3/5 = 700
*/
.right {
  background-color: yellow;
  flex: 3 0 400px;
}
```
