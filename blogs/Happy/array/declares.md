---
title: declares
date: 2019-03-28
sidebar: 'auto'
categories:
 - Happy
tags:
 - array
---

### array方法实现原理


```js
/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function map(arr, callback){
    //声明一个空的数组
    let result = [];
    //遍历数组
    for(let i=0;i<arr.length;i++){
        //执行回调
        result.push(callback(arr[i], i));
    }
    //返回结果
    return result;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 * @param {*} initValue 
 */
export function reduce(arr, callback, initValue){
    //声明变量
    let result = initValue;
    //执行回调
    for(let i=0;i<arr.length;i++){
        //执行回调
        result = callback(result, arr[i]);
    }
    //返回最终的结果
    return result;
}

Array.prototype.myReduce = function(callback,initval) {
  if(callback instanceof Function) {
    let arr = this;
    let result = []
    if(initval) {
      result = initval;
      for(let i = 0; i< arr.length; i++) {
        result = callback(result,arr[i],arr)
      }
    }else {
      result = arr[0];
      for(let i = 1; i< arr.length; i++) {
        result = callback(result,arr[i],arr)
      }
    }
    return result
  }else {
    throw new Error(`${callback} is not a function`)
  }
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function filter(arr, callback){
    //声明空数组
    let result = [];
    //遍历数组
    for(let i=0;i<arr.length;i++){
        //执行回调
        let res = callback(arr[i], i);
        //判断 如果为真则压入到 result 结果中
        if(res){
            result.push(arr[i]);
        }
    }
    //返回结果
    return result;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function find(arr, callback){
    //遍历数组
    for(let i=0;i<arr.length;i++){
        //执行回调
        let res = callback(arr[i], i);
        //判断
        if(res){
            //返回当前正在遍历的元素
            return arr[i];
        }
    }
    //如果没有遇到满足条件的 返回 undefined
    return undefined;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function findIndex(arr, callback){
    //遍历数组
    for(let i=0;i<arr.length;i++){
        //执行回调
        let res = callback(arr[i], i);
        //判断
        if(res){
            //返回当前正在遍历的元素
            return i;
        }
    }
    //如果没有遇到满足条件的 返回 undefined
    return -1;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function every(arr, callback){
    //遍历数组
    for(let i=0;i<arr.length;i++){
        // 执行回调 如果回调执行返回结果为 false
        if(!callback(arr[i], i)){
            return false;
        }
    }
    //如果都满足条件则返回 true
    return true;
}


/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function some(arr, callback){
    //遍历数组
    for(let i=0;i<arr.length;i++){
        // 执行回调 如果有执行结果为true的则返回
        if(callback(arr[i], i)){
            return true;
        }
    }
    // 如果没有满足条件的返回false
    return false;
}
```