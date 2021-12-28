---
title: array
date: 2020-08-10
sidebar: 'auto'
categories:
 - 算法
tags:
 - 算法
---


##  数组理论知识
- 数组是存放在连续内存空间上的相同数据类型的集合
- 下标都是从0开始
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
// 时间复杂度：O(N^2)
// 空间复杂度：O(1)
// 每次循环将最大的一个放在最后
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
// 时间复杂度：O(N^2)
// 空间复杂度：O(1)
// 默认最小的
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
// 时间复杂度：O(NlogN)
// 空间复杂度：O(logN) 
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

##  插入排序
```js
var sortArray = function(nums) {
    const length = nums.length
    // 需要从1开始
    for(let i = 1; i < length; i++){
        let j = i
        let tempValue = nums[i]  // 获取要比较的值
        while(j > 0 && nums[j - 1] > tempValue){
            nums[j] = nums[j - 1]
            j--
        }
        nums[j] = tempValue
    }
    return nums
};
```
##  27.移除元素

-   暴力递归 时间复杂度O(n^2)
```js
var removeElement = function (nums, val) {
    let size = nums.length
    for (let i = 0; i < size; i++) {
        if (nums[i] === val) {
            for (let j = i + 1; j < size; j++) {
                nums[j - 1] = nums[j]
            }
            i--
            size--
        }
    }
    return size
};
```

-  快慢指针 时间复杂度O(n)
```js
var removeElement = function (nums, val) {
    let left = 0
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] !== val) {
            nums[left++] = nums[right]
        }
    }
    return left
};
```

##  977. 有序数组的平方
```js
// 时间复杂度O(n)
var sortedSquares = function(nums) {
    let arr = []
    for(let left = 0, right = nums.length - 1; left <= right;) {
        let LEFT = Math.abs(nums[left]) * Math.abs(nums[left])
        let RIGHT = Math.abs(nums[right]) * Math.abs(nums[right])
        if( LEFT > RIGHT) {
            arr.unshift(LEFT)
            left++
        }else {
            arr.unshift(RIGHT)
            right--
        }
    }
    return arr
};
```

##  209. 长度最小的子数组
```js
var minSubArrayLen = function(target, nums) {
    let l = r = sum = 0,
        res = nums.length + 1
    while(r < nums.length) {
        sum += nums[r++]
        while(sum >= target) {
            res = res < (r - l) ? res : (r - l)
            sum -= nums[l++]
        }
    }
    return res > nums.length ? 0 : res
};
```





