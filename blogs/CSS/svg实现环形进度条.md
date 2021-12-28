---
title: svg实现环形进度条
date: 2021-11-24
sidebar: 'auto'
categories:
 - CSS
tags:
 - CSS
---

```html
<style>
/* 最外层定位，大小 */
.svg {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50px;
    left: 50px;
}
.text {
    /* 文字颜色 */
    fill: rgb(236, 82, 40);
    font-weight: 600;
}
.outcircle {
    /* 圆形内圈颜色 */
    fill: none;
    /* 环形边颜色 */
    stroke: rgb(246, 193, 102);
    /* 宽度 */
    stroke-width: 6;
    /* 起点终端圆形 */
    stroke-linecap: round;
    /* 一个参数时表示虚线长度和每段虚线之间的间距*/
    /* 两个参数时表示虚线长度和每段虚线之间的间距*/
    /* 设置整个环形时，第一个为进度的长度，第二个参数固定为周长即可 */
    stroke-dasharray: 145, 188.4;
    /* 起点旋转 */
    transform:rotate(130deg);
    transform-origin: center;
    transform-box:fill-box;
    /* stroke-dashoffset 起点偏移量，暂时没用到 */
}
.innercircle {
    /* 内容颜色 */
    fill: none;
    stroke: rgb(236, 82, 40);
    stroke-width: 6;
    stroke-linecap: round;
    /* 长度 */
    stroke-dasharray: 130, 188.4;
    /* 起点 */
    transform:rotate(130deg);
    transform-origin: center;
    transform-box:fill-box;
}
</style>
<body>
<svg class="svg">
    <circle class="outcircle"
        cx="43.75"
        cy="46"
        r="30" />
    <circle class="innercircle"
        cx="43.75"
        cy="46"
        r="30" />
    <text class="text"
        x="43.75"
        y="40"
        text-anchor="middle">
        <tspan>仅剩</tspan>
    </text>
    <text class="text"
        x="43.75"
        y="58"
        text-anchor="middle">
        <tspan>100张</tspan>
    </text>
</svg>
</body>
```