---
title: 剑指offer
date: 2020-08-09
sidebar: 'auto'
categories:
 - 算法
tags:
 - 算法
---

##  剑指offer 16 数值的整数次方
```js
// 时间复杂度O(logn)
var myPow = function(x, n) {
    if(n === 0) {
        return 1
    }
    if(n === 1) {
        return x
    }
    if(n === -1) {
        return 1/x
    }
    if(n % 2 === 0) {
        let res = myPow(x, n/2)
        return res * res
    }else {
        // 奇数时要减去 1，乘自己
        let res = myPow(x, (n-1)/2)
        return res * res * x
    }
};
```