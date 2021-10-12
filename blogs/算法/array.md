---
title: array
date: 2020-08-10
sidebar: 'auto'
categories:
 - 算法
tags:
 - 算法
---

##  704 二分查找
```js
var search = function(nums, target) {
    let l = 0,r = nums.length-1
    while(l <= r) {
        let mid = (l + r) >> 1
        if(nums[mid] === target){
            return mid
        }else {
            l = nums[mid] > target ? l : mid + 1
            r = nums[mid] > target ? mid -1 : r
        }
    }
    return -1
};
```

##  冒泡排序
```js
function sort(arr) {
    for(let i = 0; i < arr.length -1; i++) {
        for(let j = 0; j < arr.length -i -1; j++) {
            if(arr[j] > arr[j + 1]) {
                let tem = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tem
            }
        }
    }
    return arr
}
```

##  选择排序
```js
function sort(arr) {
    let min
    for(let i = 0; i < arr.length; i++) {
        min = i
        for(let j = i+1; j< arr.length; j++) {
            if(arr[min] > arr[j]) {
                min = j
            }
        }
        if(min !== i) {
            let tem = arr[min]
            arr[min] = arr[i]
            arr[i] = tem
        }
    }
    return arr
}
```

## 快速排序
```js
function sort(arr) {
    if(arr.length <= 1){
        return arr;
    }
    let index = parseInt(arr.length/2),
        flag = arr.splice(index, 1),
        left = [],
        right = [];
    for(let i=0; i < arr.length; i++) {
        if(arr[i] > flag) {
            right.push(arr[i])
        }else {
            left.push(arr[i])
        }
    }
    left = sort(left)
    right = sort(right)
    return left.concat(flag, right)
}
```

