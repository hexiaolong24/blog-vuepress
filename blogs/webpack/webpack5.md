---
title: webpack5
date: 2019-08-06
sidebar: "auto"
categories:
  - webpack
tags:
  - webpack
---

## 总体方向

- 使用持久化缓存 Persistent Caching 提高构建性能
- 使用更好的算法和默认值改进长期缓存
- 通过更好的 Tree Shaking 和 Code Generation 改进包大小
- 提高与 Web 平台的兼容性
- 清理在 v4 中实现功能时处于奇怪状态的内部结构，而不会引入任何重大更改
- 通过现在引入重大更改来为未来的功能做好准备，使我们能够尽可能长时间地使用 v5

1.  自动删除 Node.js Polyfill
2.  自动清除上次输出
3.  长期缓存

    - 添加了用于长期缓存的新算法。默认情况下，这些选项在生产模式下处于启用状态。以前是顺序容易失效

    ```js
    chunkIds: "deterministic" moduleIds: "deterministic" mangleExports: "deterministic"
    // 开发环境中默认使用 named ,所以可以不使用 import(/* webpackChunkName: "name" */ "module")
    ```

    - contenthash 默认使用 realContentHash
      Webpack 5 现在在使用 [contenthash] 时将使用文件内容的真实哈希值。在它之前，它 “只” 使用内部结构的哈希值。当仅更改注释或重命名变量时，这可能会对长期缓存产生积极影响。最小化后，这些更改不可见

4.  Module Federation
5.  异步模块

- async externals
- WebAssembly Modules
- esModule

6.  tree shaking

- 嵌套 tree-shaking
  可以删除 b

```js
// inner.js
export const a = 1;
export const b = 2;

// module.js
export * as inner from "./inner";
// or import * as inner from './inner'; export { inner };

// user.js
import * as module from "./module";
console.log(module.inner.a);
```

- 内部模块依赖分析 optimization.innerGraph 生产环境下默认启用

```js
import { something } from "./something";

function usingSomething() {
  return something;
}

export function test() {
  return usingSomething();
}
```

默认情况下只有在 test 被使用的情况下才会 使用 something
但是当 "sideEffects": false 被设置时，这允许省略更多的模块。在此示例中，当 test 导出时，将省略 ./something

- 增加了 CommonJs Tree Shaking
- 常规 Tree Shaking 改进
  - export \* 已得到改进，可以跟踪更多信息，并且不再将 default 导出标记为已使用。
  - export \* 现在会在 webpack 确定存在冲突的导出时显示警告。
  - import() 允许通过 /_ webpackExports: ["abc", "default"] _/ 魔术注释手动对模块进行树形摇动。

7.  改进的代码生成 Code Generation
8.  改进的 target 选项，以前只有 web node 可供选择，现在可以有更多的配置 比如 node@16.0 ES2015
9.  模块大小配置

```js
module.exports = {
  optimization: {
    splitChunks: {
      minSize: {
        javascript: 30000,
        webassembly: 50000,
      },
    },
  },
};
```

10. Persistent Caching 持久缓存
    默认不开启：优先考虑安全性而不是性能，必须让更新的文件得以重新生效 - 对于 Module： webpack 会跟踪每个 Module 的 fileDependencies contextDependencies 和 missingDependencies，并创建文件系统快照。将此快照与实际文件系统进行比较，当检测到差异时，将触发该模块的重新构建。 - 对于 bundle：对于 bundle.js 的 cache 条目，webpack 会存储一个 etag，它是所有贡献者的哈希值。此 etag 将进行比较，并且仅当它与缓存条目匹配时才能使用。
    Snapshot types 快照类型

- timestamp
- Contenthash
- timestamp + Contenthash

```js
// webpack.config.js
module.exports = {
  cache: {
    // 开启持久化缓存
    type: "fileSystem",
    buildDependencies: {
      // 重新构建的依据
      config: [__filename],
    },
    version: `${process.env.GIT_REV}`,
    name: `${env.target}`,
  },
};
```

- 开箱即用
- 完整性
  module resolve、build 阶段，还在 代码生成、sourceMap 等
- 可靠性
  相较于 v4 版本，内置了更加安全基于 content hash 的缓存对比策略，即 timestamp + content hash
- 性能
  compile 流程和持久化缓存解耦，在 compile 阶段持久化缓存数据的动作不会阻碍整个流程，而是缓存至一个队列当中，只有当 compile 结束后才会进行，与之相关的配置可参见 cache

## 垃圾回收

未使用的缓存条目将在 1 个月后从缓存中删除。
