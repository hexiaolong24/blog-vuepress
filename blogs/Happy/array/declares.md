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
    let result = [];
    for(let i=0;i<arr.length;i++){
        result.push(callback(arr[i], i));
    }
    return result;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 * @param {*} initValue 
 */
export function reduce(arr, callback, initValue){
    let result = initValue;
    for(let i=0;i<arr.length;i++){
        result = callback(result, arr[i]);
    }
    return result;
}

Array.prototype.reduce = function(fn, initVal) {
  let arr = this
  if(arr.length === 0) {
    throw new TypeError('empty array')
  }
  if(typeof fn !== 'function') {
    throw new TypeError(`${fn} is not a function`)
  }
  let curIndex, accVal
  if(initVal) {
    curIndex = 0
    accVal = initVal
  }else {
    initVal = arr[0]
    curIndex = 1
  }
  while(curIndex < arr.length) {
    if(Object.prototype.hasOwnProperty.call(arr, curIndex)) {
      accVal = fn(accVal, arr[curIndex], curIndex, arr)
    }
    curIndex++
  }
  return accVal
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function filter(arr, callback){
    let result = [];
    for(let i=0;i<arr.length;i++){
        let res = callback(arr[i], i);
        if(res){
            result.push(arr[i]);
        }
    }
    return result;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function find(arr, callback){
    for(let i=0;i<arr.length;i++){
        let res = callback(arr[i], i);
        if(res){
            return arr[i];
        }
    }
    return undefined;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function findIndex(arr, callback){
    for(let i=0;i<arr.length;i++){
        let res = callback(arr[i], i);
        if(res){
            return i;
        }
    }
    return -1;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function every(arr, callback){
    for(let i=0;i<arr.length;i++){
        if(!callback(arr[i], i)){
            return false;
        }
    }
    return true;
}


/**
 * 
 * @param {Array} arr 
 * @param {Function} callback 
 */
export function some(arr, callback){
    for(let i=0;i<arr.length;i++){
        if(callback(arr[i], i)){
            return true;
        }
    }
    return false;
}
Array.prototype.some = function(callback) {
  if(!Array.isArray(this)) {
    throw new Error(`${this}.some is not a function`)
  }
  for(let i = 0; i < this.length; i++) {
    if(callback(this[i], i, this)) {
      return true
    }
  }
  return false
}
```