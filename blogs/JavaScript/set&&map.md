---
title: set、map
date: 2018-04-24
sidebar: auto
categories:
  - JavaScript
tags:
  - JavaScript
---

## Set

- ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值
- Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化
- Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为 NaN 等于自身，而精确相等运算符认为 NaN 不等于自身。

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set; // Set {NaN}
```

### 操作方法

```js
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size; // 2

s.has(1); // true
s.has(2); // true
s.has(3); // false

s.delete(2);
s.has(2); // false
s.clear(); // Set(0) {}

// 数组去重
let arr = [1, 1, 2, 3];
let unique = [...new Set(arr)];

let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = [...new Set([...a, ...b])]; // [1,2,3,4]

// 交集
let intersect = [...new Set([...a].filter((x) => b.has(x)))];
[2, 3];

// 差集
let difference = Array.from(new Set([...a].filter((x) => !b.has(x))));
[1];
```

### 遍历操作

- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员
  需要特别指出的是，Set 的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
- Set 的键名和键值是一个值

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
	console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
	console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
	console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

- Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 values 方法。这意味着，可以省略 values 方法，直接用 for...of 循环遍历 Set。

```js
Set.prototype[Symbol.iterator] === Set.prototype.values; // true

Set.prototype[Symbol.iterator] === Set.prototype.keys; // true

Set.prototype[Symbol.iterator] === Set.prototype.entries; // false

Map.prototype[Symbol.iterator] === Map.prototype.entries; // true

Map.prototype[Symbol.iterator] === Map.prototype.keys; // false

Map.prototype[Symbol.iterator] === Map.prototype.values; // false

let set = new Set(['red', 'green', 'blue']);
for (let x of set) {
	console.log(x);
}
// red
// green
// blue
```

- forEach

```js
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value));
// 1 : 1
// 4 : 4
// 9 : 9
```

## WeakSet

- WeakSet 的成员只能是对象，而不能是其他类型的值。接收的参数最外层必须是就有 interable 接口的对象，这个对象内部的成员必须是对象类型才可以，这样 WeakSet 就会把这个参数内部的成员变成自己的成员
- 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
- WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

### 操作方法

- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在

### 不能遍历

- WeakSet 没有 size 属性，没有办法遍历它的成员。

## Map

类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

规范要求 map 实现“平均访问时间与集合中的元素数量呈次线性关系”。因此，它可以在内部表示为哈希表（使用 O(1) 查找）、搜索树（使用 O(log(N)) 查找）或任何其他数据结构，只要复杂度小于 O(N)。

### 键的相等

- 键的比较基于零值相等算法，曾经使用同值相等

- Map.prototype.set()
- Map.prototype.get()
- Map.prototype.delete()
- Map.prototype.has(key)
- Map.prototype.clear()
- size
- Map 构造函数接受数组作为参数，实际上执行的是下面的算法。

```js
const items = [
	['name', '张三'],
	['title', 'Author'],
];

const map = new Map();

items.forEach(([key, value]) => map.set(key, value));
```

- 任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作 Map 构造函数的参数

### 遍历方法

- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历 Map 的所有成员

Map 的遍历顺序就是插入顺序。

## WeakMap

- 只接受对象做为键名（null 除外）
- 其次，WeakMap 的键名所指向的对象，不计入垃圾回收机制。

- 只有 get()、set()、has()、delete()

## WeakRef

- WeakSet 和 WeakMap 是基于弱引用的数据结构，ES2021 更进一步，提供了 WeakRef 对象，用于直接创建对象的弱引用。

```js
let target = {};
let wr = new WeakRef(target);

let obj = wr.deref();
if (obj) {
	// target 未被垃圾回收机制清除
	// ...
}
```
