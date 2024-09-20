---
title: Node内存
date: 2019-09-24
sidebar: 'auto'
categories:
  - node
tags:
  - Node.js
---

## Module Wrapper Function

Node 中任何一个模块（js 文件）都被一个外层函数所包裹

```js
function (exports, require, module, __filename, __dirname) {}
        //  exports：用于暴露模块
        //  require：用于引入模块
        //  module：用于暴露模块
        //  __filename：当前文件所在的路径（绝对）
        //  __dirname：当前文件所在文件夹的路径（绝对）

```

为什么要有这个外层函数（这个外层函数有什么作用？）

- 隐藏内部实现

- 支持 CommonJs 的模块化

## 对于浏览器端而言，js 由哪几部分组成？

1.  BOM 浏览器对象模型 -------- 很多的 API（location，history）

2.  DOM 文档对象模型 ---------- 很多的 API（对 DOM 的增删改查）

3.  ES 规范 -------------------- ES5、ES6.....

## Node 端 js 由几部分组成？

1.  没有了 BOM ----- 因为服务器不需要（服务端没有浏览器对象）

2.  没有了 DOM ----- 因为没有浏览器窗口

3.  几乎包含了所有的 ES 规范

4.  没有了 window，但是取而代之的是一个叫做 global 的全局变量。

## 场景

- 适用于异步非阻塞任务
- 不适用于 CPU 密集型，如（图像处理）

## Node 内存

### 错误场景

```shell
<--- Last few GCs --->

[1:0x63b6120]   122046 ms: Mark-sweep (reduce) 2003.3 (2005.1) -> 2003.2 (2005.1) MB, 4.1 / 0.5 ms  (+ 0.1 ms in 1 steps since start of marking, biggest step 0.1 ms, walltime since start of marking 47 ms) (average mu = 0.999, current mu = 0.999) external

<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

或者直接退出

```
Killed
error Command failed with exit code 137.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

```
Killed
ELIFECYCLE  Command failed with exit code 137.
```

### 指标

前端构建项目我们需要关注内存和 CPU

### 内存监控 process os 两个包

```js
import { freemem, totalmem } from 'os';

const { rss, heapUsed, heapTotal } = process.memoryUsage();

const sysFree = freemem(); // 获取系统空闲内存

const sysTotal = totalmem(); // 获取系统总内存

// 计算内存占有率
heapUsed / heapTotal; // 堆内存占用率
rss / sysTotal; // 进程内存占用率
1 - sysFree / sysTotal; // 系统内存占用率
```

主要关注堆内存，设置 max-old-space-size 是来调整老生代堆内存

### 内存监控 Profile

为了监控 Node.js 应用程序中的内存使用情况，我们还可以使用内存监控工具，如 V8 profiler。这些工具可以帮助我们识别内存泄漏并读取和分析内存快照。可以通过如下的方式来获取内存快照。最后将生成的 heapsnapshot 文件导入 Chrome devtool 即可分析内存快照。

```js
import { Session } from 'inspector';

const session = new Session();
session.connect();

async function dumpProfile() {
	session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
		writeFileSync('profile.heapsnapshot', m.params.chunk);
	});

	await session.post('HeapProfiler.takeHeapSnapshot', null);
}
```

### cpu 分析

- process.cpuUsage 用于获取进程 CPU 时间的方法，它返回一个包含用户 CPU 时间和系统 CPU 时间的对象。
- 用户 CPU 时间表示进程使用 CPU 的时间，而系统 CPU 时间表示操作系统使用 CPU 的时间。
- process.hrtime.bigint 方法是一个高精度计时器，用于获取当前时间的纳秒级别的精确时间戳，返回一个 BigInt 类型的值。结合这两者可以计算出 CPU 利用率。

```js
const startTime = process.hrtime.bigint();
const startUsage = process.cpuUsage();

doSomething();

const endTime = process.hrtime.bigint();
const endUsage = process.cpuUsage(startUsage);

const duration = Number(endTime - startTime) / 1000; // ms
(endUsage.user + endUsage.system) / duration; // cpu 利用率
```

### max-old-space-size 的作用

计算堆内存大小

```js
// heap 堆
import { getHeapStatistics } from 'v8';

Math.floor(getHeapStatistics().heap_size_limit / 1024 / 1024);
```

在一个 4GB 的 Node.js v16 执行上述脚本得到的最大对内存值为 2015M。编写一个简单的脚本来测试内存。

```js
// 改编自 https://github.com/mcollina/climem/blob/master/app.js
const array = [];

setInterval(() => {
	array.push(Buffer.alloc(1024 * 1024 * 50).toString()); // 50M
}, 3000);
```

- Node.js 进程在 122 秒后出现 OOM 问题，此时堆内存非常接近 heap_size_limit ，另外还有空闲内存 700M。
- 设置 max-old-space-size=3584 后再次执行脚本。内存变化指标如下所示。此时该进程在 220 秒后才出现 OOM 问题，剩余的空闲内存快接近于 0。

### 构建分析 Webpack ProfilingPlugin

该插件可以生产 Profile 文件用以分析构建过程,该插件内存消耗较大

```js
{
	plugins: [
		// ...
		new ProfilingPlugin({
			outputPath: join(__dirname, 'profile', `profile.json`),
		}),
	];
}
```

- 分析结果 entry plugin / eslint plugin / js 压缩 terser plugin / css 压缩 / html 生成

### 内存监控

```js
// 按照一定的间隔收集数据
async function collectMemoryUsage() {}

class MemWatchPlugin {
	apply(compiler) {
		// 构建开始前
		compiler.hooks.beforeRun.tap(pluginName, collectMemoryUsage);

		// 构建结束后
		compiler.hooks.done.tap(pluginName, saveMemoryUsageData);

		// 构建失败后
		compiler.hooks.failed.tap(pluginName, saveMemoryUsageData);
	}
}
```

### max-old-space-size 不生效场景

如果依赖包特别大，需要使用 externals
