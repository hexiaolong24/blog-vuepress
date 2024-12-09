---
title: webpack简介
date: 2019-08-06
sidebar: "auto"
categories:
  - webpack
tags:
  - webpack
---

## 是什么

webpack 是一种前端资源构建工具，一个静态模块打包器(module bundler)。 在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理。 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)。

- 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。

- 编译兼容。在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过 webpack 的 Loader 机制，不仅仅可以帮助我们对代码做 polyfill，还可以编译转换诸如.less, .vue, .jsx 这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。

- 能力扩展。通过 webpack 的 Plugin 机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

## 打包原理

1.  读取 webpack 的配置参数；
2.  启动 webpack，创建 Compiler 对象并开始解析项目；
3.  从入口文件（entry）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
4.  对不同文件类型的依赖模块文件使用对应的 Loader 进行编译，最终转为 Javascript 文件；
5.  整个过程中 webpack 会通过发布订阅模式，向外抛出一些 hooks，而 webpack 的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

- 其中文件的解析与构建是一个比较复杂的过程，在 webpack 源码中主要依赖于 compiler 和 compilation 两个核心对象实现。
  compiler 对象是一个全局单例，他负责把控整个 webpack 打包的构建流程。compilation 对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，compiler 都会重新生成一个新的 compilation 对象，负责此次更新的构建过程。

- 而每个模块间的依赖关系，则依赖于 AST 语法树。每个模块文件在通过 Loader 解析完成之后，会通过 acorn 库生成模块代码的 AST 语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。

- 最终 Webpack 打包出来的 bundle 文件是一个 IIFE 的执行函数。

## module

模块，在 webpack 眼里，任何可以被导入导出的文件都是一个模块。

## chunk

chunk 是 webpack 拆分出来的

- 每个入口文件都是一个 chunk
- 通过 import、require 引入的代码也是
- 通过 splitChunks 拆分出来的代码也是

## bundle

webpack 打包出来的文件，也可以理解为就是对 chunk 编译压缩打包等处理后的产出。

## Entry

入口(Entry)指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图

## Output

输出(Output)指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名

## Loader

Loader 让 webpack 能够去处理那些非 JavaScript 文件(webpack 自身只理解 JavaScript)

## Plugins

插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩， 一直到重新定义环境中的变量等。

## Mode

指定打包环境

## react

通过 cross-env 定义环境变量

## vue-cli V4.5.7

```js
vue inspect --mode=development > webpack.dev.js
vue inspect --mode=production > webpack.prod.js
```

## 开发环境配置

### loader

- `less-loader`将 less 文件编译成 css 文件，`css-loader`将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串，`style-loader`创建 style 标签，将 js 中的样式资源插入进行，添加到 head 中生效

- `html-loader`处理 html 文件的 img 图片（负责引入 img，从而能被 url-loader 进行处理）,`url-loader`处理图片资源，默认处理不了 html 中 img 图片，可以设置图片的体积，小于设置值的图片就会被转换成 base64 格式，该 loader 默认使用的是 es6 模块化，`html-loader`使用的是 commonJS,所以需要关闭`url-loader`的 esModule

- `file-loader`打包其他资源(除了 html/js/css 资源以外的资源)

### plugins

- `webpack-bundle-analyzer`,分析 bundle 文件各个模板的大小情况

- `html-webpack-plugin`，复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）

```js
/*
  开发环境配置：能让代码运行
    运行项目指令：
      webpack 会将打包结果输出出去
      npx webpack-dev-server 只会在内存中编译打包，没有输出
*/

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      // loader的配置
      {
        // 处理less资源
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          // 关闭es6模块化
          esModule: false,
          outputPath: "imgs",
        },
      },
      {
        // 处理html中img资源
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        // 处理其他资源
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media",
        },
      },
    ],
  },
  plugins: [
    // plugins的配置
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  mode: "development",
  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    port: 3000,
    open: true,
  },
};
```

## 生产环境配置

### loader

- `postcss-loader`,css 兼容性处理：`postcss` --> `postcss-loader` `postcss-preset-env`,帮 postcss 找到`package.json`中`browserslist`里面的配置，通过配置加载指定的 css 兼容性样式，postcss-preset-env 包含 autoprefixer（专门用来添加厂商前缀的），因此如果你已经使用了 preset 就无需单独添加它了

- `eslint-loader`,设置检查规则 package.json 中 eslintConfig 中设置，`"eslintConfig": {"extends":"airbnb-base"}`

- `babel-loader`
  1. 基本 js 兼容性处理 --> @babel/preset-env，问题：只能转换基本语法，如 promise 高级语法不能转换
  2. 全部 js 兼容性处理 --> @babel/polyfill ，问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
  3. 需要做兼容性处理的就做：按需加载 --> core-js

### plugins

- `mini-css-extract-plugin`对输出的 css 重命名，`MiniCssExtractPlugin.loader` 这个 loader 取代`style-loader` ,作用：提取 js 中的 css 成单独文件

- `optimize-css-assets-webpack-plugin`，直接调用一下就可以，压缩 css

- 生产环境下自动压缩 js(terserPlugin)

- `html-webpack-plugin`中配置，压缩 html,去空格，去注释

```js
const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    // 还需要在package.json中定义browserslist
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [require("postcss-preset-env")()],
    },
  },
];

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, "less-loader"],
      },
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
      */
      {
        // 在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          fix: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: { version: 3 },
                targets: {
                  chrome: "60",
                  firefox: "50",
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(jpg|png|gif)/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          outputPath: "imgs",
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: "file-loader",
        options: {
          outputPath: "media",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/built.css",
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  mode: "production",
};
```

## 优化配置

- 开发环境性能优化
- 生产环境性能优化

### 开发环境性能优化

- 优化打包构建速度
  - HMR
- 优化代码调试
  - source-map

### 生产环境性能优化

- 优化打包构建速度
  - oneOf
  - babel 缓存
  - 多进程打包
  - externals
  - dll
- 优化代码运行的性能
  - 缓存(hash-chunkhash-contenthash)
  - tree shaking
  - code split
  - 懒加载/预加载
  - pwa

### loader

- babel 缓存，在`babel-loader`中开启`cacheDirectory: true`，hash: 每次 wepack 构建时会生成一个唯一的 hash 值。问题: 因为 js 和 css 同时使用一个 hash 值。 chunkhash：根据 chunk 生成的 hash 值。如果打包来源于同一个 chunk，那么 hash 值就一样， 问题: js 和 css 的 hash 值还是一样的，因为 css 是在 js 中被引入的，所以同属于一个 chunk。contenthash: 根据文件的内容生成 hash 值。不同文件 hash 值一定不一样

- 多进程打包，`thread-loader`,开启多进程打包，进程启动大概为 600ms，进程通信也有开销。只有工作消耗时间比较长，才需要多进程打包

### plugins

- PWA: 渐进式网络开发应用程序(离线可访问),`workbox-webpack-plugin`

### 其他

- HMR `hot module replacement` 热模块替换 / 模块热替换,样式文件：可以使用 HMR 功能：因为`style-loader`内部实现了,js 文件：默认不能使用 HMR 功能 --> 需要修改 js 代码，添加支持 HMR 功能的代码,在`devServer`中配置`hot:true`

- source-map: 一种提供源代码到构建后代码映射技术,（如果构建后代码出错了，通过映射可以追踪源代码错误）
  - source-map 外部 错误代码准确信息 和 源代码准确位置
  - inline-source-map ：内联 构建速度快，只生成一个内联 sourcemap 文件 错误代码准确信息 和 源代码准确位置
  - hidden-source-map: 外部 错误代码准确信息 但是没有错误位置 不能追踪到源代码位置 只能提示到构建后的位置
  - eval-source-map: 内联 每一个文件都生成一个 sourcemap 文件 错误代码准确信息 和 源代码准确位置
  - nosources-source-map 外部 错误代码准确信息 但是没有源代码信息
  - cheap-source-map 外部 错误代码准确信息 和 源代码准确位置(只精确到行，整个一行都报错)
  - cheap-module-source-map 外部 错误代码准确信息 和 源代码准确位置 会将 loader 的 source map 加入进来

开发环境：速度快 位置准确 eval-source-map(脚手架使用的是这个) / eval-cheap-source-map
生产环境： 代码是否隐藏 调试要不要友好

- 内联会使代码体积很大 生产环境使用外部 source-map nosources-source-map

- oneOf 中的 loader 只会匹配一个，不能有两个配置处理同一种类型文件

- tree shaking：去除无用代码，前提：1. 必须使用 ES6 模块化 2. 开启 production 环境 作用: 减少代码体积
  在`package.json`中配置`"sideEffects": ["*.css", "*.less"]`,不排除的话可能会把 css / @babel/polyfill （副作用）文件干掉

- code-split 让某个文件被单独打包成一个 chunk,import 动态导入语法：能将某个文件单独打包,`import(/* webpackChunkName: 'test' */'./test')`

- preload 和 prefetch,预加载：当文件需要使用时提前预加载，import()语法，prefetch 预加载，会在使用之前，提前加载 js 文件，下一次导航可能需要使用的资源`import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test')`

- externals，指定某个包拒绝被打包，在实际项目中，我们可以发现在最后生成的 bundle 文件中，第三方库所占的比重很大。我们可以通过配置 externals，将其中常用的第三库（比如 vue、vue-router、vuex 等）抽离出来，放置在 CDN 中，通过 script 来引入，减少打包文件体积。

```js
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>;

externals: {
  // jquery，即key为项目逻辑代码中引入的第三方库名称
  // jQuery，即value，表示通过script引入之后的全局变量
  jquery: "jQuery";
}

import $ from "jquery";
```
