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

##  21 奇数排在偶数前面
- 双指针
```js
var exchange = function(nums) {
  let l = 0, r = nums.length -1
  while(l < r) {
    // 如果左指针是奇数，则++
    while(l < r && (nums[l] & 1) === 1) {
      l++
    }
    // 如果右指针是偶数，则--
    while(l < r && (nums[r] & 1) === 0) {
      r--
    }
    // 出现奇偶则开始交换
    [nums[l], nums[r]] = [nums[r], nums[l]]
  }
  return nums
};
```

##  34 二叉树中和为某一值的路径
```js
var pathSum = function(root, target) {
    let res = [],path = []
    const helper = (root, path, sum) => {
        if(!root) return
        path.push(root.val)
        sum += root.val
        if(sum === target && !root.left && !root.right) {
            res.push([...path])
        }
        root.left && helper(root.left, path, sum)
        root.right && helper(root.right, path, sum)
        sum -= root.val
        path.pop()
    }
    helper(root, path, 0)
    return res
};
```