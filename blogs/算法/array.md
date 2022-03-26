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
-   时间复杂度O(logn)
-   空间复杂度O(1)
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

##  912 冒泡排序
```js
// 时间复杂度：O(N^2)
// 空间复杂度：O(1)
// 每次循环将最大的一个放在最后
var sortArray = function(nums) {
    for(let i = 0; i< nums.length-1; i++) {
        for(let j = 0; j < nums.length-i-1; j++) {
            if(nums[j] > nums[j+1]) {
                [nums[j],nums[j+1]] = [nums[j+1],nums[j]]
            }
        }
    }
    return nums
};
```

##  选择排序
```js
// 时间复杂度：O(N^2)
// 空间复杂度：O(1)
// 默认当前是最小的
var sortArray = function(nums) {
    for(let i = 0; i< nums.length; i++) {
        let min = i
        for(let j = i; j < nums.length; j++) {
            // 如果发现有更小的，则更新下标
            if(nums[min] > nums[j]) {
                min = j
            }
        }
        // 每循环一次检查下标是否与初始值相同，如果不相同，则交换彼此
        if(min !== i) {
            [nums[min], nums[i]] = [nums[i], nums[min]]
        }
    }
    return nums
};
```

## 快速排序
```js
// 时间复杂度：O(NlogN)
// 空间复杂度：O(logN) 
var sortArray = function(nums) {
    if(nums.length <= 1){
        return nums;
    }
    let index = parseInt(nums.length/2),
        // 要将flag 去除 splice会改变原数组
        flag = nums.splice(index, 1),
        left = [],
        right = [];
    for(let i=0; i < nums.length; i++) {
        if(nums[i] > flag) {
            right.push(nums[i])
        }else {
            left.push(nums[i])
        }
    }
    left = sortArray(left)
    right = sortArray(right)
    // 注意合并中间项
    return left.concat(flag, right)
};
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
-   你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。
-   不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并原地修改输入数组
-   要知道数组的元素在内存地址中是连续的，不能单独删除数组中的某个元素，只能覆盖

-   暴力递归 
```js
// 时间复杂度O(n^2)
// 空间复杂度O(1)
var removeElement = function (nums, val) {
    let size = nums.length
    for (let i = 0; i < size; i++) {
        if (nums[i] === val) {
            // 出现目标元素则依次将后一项覆盖到当前项
            for (let j = i + 1; j < size; j++) {
                nums[j - 1] = nums[j]
            }
            // 因为有删除元素，所以i-- 不然会漏检一次
            i--
            // 最终数组长度--
            size--
        }
    }
    return size
};
```

-  快慢指针
```js
// 时间复杂度O(n)
// 空间复杂度O(1)
var removeElement = function (nums, val) {
    let left = 0
    for (let right = 0; right < nums.length; right++) {
        // 如果不相等，left复制right,同时left++
        // 如果等于目标值，left原地不动，right++
        if (nums[right] !== val) {
            nums[left++] = nums[right]
        }
    }
    // 最终left的值就是数组的长度
    return left
};
```

##  977. 有序数组的平方
```js
// 时间复杂度O(n)
var sortedSquares = function(nums) {
    let arr = []
    // 注意 l <= r，如果不加=，会漏掉一个元素
    for(let l = 0, r = nums.length-1;l <= r;) {
        const L = Math.abs(nums[l])
        const R = Math.abs(nums[r])
        if(L > R) {
            arr.unshift(L*L)
            l++
        }else {
            arr.unshift(R*R)
            r--
        }
    }
    return arr
};
```

##  209. 长度最小的子数组
```js
// 时间复杂度O(n)
// 空间复杂度O(1)
var minSubArrayLen = function(target, nums) {
    let l = r = sum = 0,
        // 初始化一个大于length的值，为最终返回做比对
        res = nums.length + 1
    // r 控制边界
    while(r < nums.length) {
        // sum累计 r++
        sum += nums[r++]
        // 出现sum大于目标和的情况下
        while(sum >= target) {
            // 说明达成目标，更新 res
            res = res < (r - l) ? res : (r - l)
            // 同事左边指针向右移动，sum减去相应值
            sum -= nums[l++]
        }
    }
    // 与初始化值做比较
    return res > nums.length ? 0 : res
};
```

##  4 寻找两个正序数组的中位数
```js
var findMedianSortedArrays = (nums1, nums2) => {
    let len1 = nums1.length, len2 = nums2.length
    if (len1 > len2) return findMedianSortedArrays(nums2, nums1)//对nums1和nums2中长度较小的二分
    let len = len1 + len2//总长
    let start = 0, end = len1 //进行二分的开始和结束位置
    let partLen1, partLen2

    while (start <= end) {
        partLen1 = (start + end) >> 1//nums1二分的位置
        partLen2 = ((len + 1) >> 1) - partLen1//nums2二分的位置

        //L1:nums1二分之后左边的位置，L2，nums1二分之后右边的位置
        //R1:nums2二分之后左边的位置，R2，nums2二分之后右边的位置

        //如果左边没字符了，就定义成-Infinity，让所有数都大于它，否则就是nums1二分的位置左边一个
        let L1 = partLen1 === 0 ? -Infinity : nums1[partLen1 - 1]
        //如果左边没字符了，就定义成-Infinity，让所有数都大于它，否则就是nums2二分的位置左边一个
        let L2 = partLen2 === 0 ? -Infinity : nums2[partLen2 - 1]
        //如果右边没字符了，就定义成Infinity，让所有数都小于它，否则就是nums1二分的位置
        let R1 = partLen1 === len1 ? Infinity : nums1[partLen1]
        //如果右边没字符了，就定义成Infinity，让所有数都小于它，否则就是nums1二分的位置
        let R2 = partLen2 === len2 ? Infinity : nums2[partLen2]

        if (L1 > R2) {//不符合交叉小于等于 继续二分
            end = partLen1 - 1
        } else if (L2 > R1) {//不符合交叉小于等于 继续二分
            start = partLen1 + 1
        } else { // L1 <= R2 && L2 <= R1 符合交叉小于等于
            return len % 2 === 0 ?
                (Math.max(L1, L2) + Math.min(R1, R2)) / 2 : //长度为偶数返回作左侧较大者和右边较小者和的一半
                Math.max(L1, L2)	//长度为奇数返回作左侧较大者
        }
    }
}
```





