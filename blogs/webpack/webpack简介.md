---
title: webpack简介
date: 2019-08-31
sidebar: 'auto'
categories:
 - webpack
tags:
 - webpack
---

##  是什么

webpack 是一种前端资源构建工具，一个静态模块打包器(module bundler)。 在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理。 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)。

- 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。

- 编译兼容。在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过webpack的Loader机制，不仅仅可以帮助我们对代码做polyfill，还可以编译转换诸如.less, .vue, .jsx这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。

- 能力扩展。通过webpack的Plugin机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

##  打包原理

1.  读取webpack的配置参数；
2.  启动webpack，创建Compiler对象并开始解析项目；
3.  从入口文件（entry）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
4.  对不同文件类型的依赖模块文件使用对应的Loader进行编译，最终转为Javascript文件；
5.  整个过程中webpack会通过发布订阅模式，向外抛出一些hooks，而webpack的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

- 其中文件的解析与构建是一个比较复杂的过程，在webpack源码中主要依赖于compiler和compilation两个核心对象实现。
compiler对象是一个全局单例，他负责把控整个webpack打包的构建流程。compilation对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，compiler都会重新生成一个新的compilation对象，负责此次更新的构建过程。

- 而每个模块间的依赖关系，则依赖于AST语法树。每个模块文件在通过Loader解析完成之后，会通过acorn库生成模块代码的AST语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。

- 最终Webpack打包出来的bundle文件是一个IIFE的执行函数。

##  Entry

入口(Entry)指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图

##  Output

输出(Output)指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名

##  Loader

Loader让webpack能够去处理那些非JavaScript文件(webpack自身只理解JavaScript)

##  Plugins

插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩， 一直到重新定义环境中的变量等。

##  Mode

指定打包环境

##  react

通过cross-env 定义环境变量

##  vue-cli V4.5.7

```js
vue inspect --mode=development > webpack.dev.js
vue inspect --mode=production > webpack.prod.js
```


##  开发环境配置

### loader

- `less-loader`将less文件编译成css文件，`css-loader`将css文件变成commonjs模块加载js中，里面内容是样式字符串，`style-loader`创建style标签，将js中的样式资源插入进行，添加到head中生效

- `html-loader`处理html文件的img图片（负责引入img，从而能被url-loader进行处理）,`url-loader`处理图片资源，默认处理不了html中img图片，可以设置图片的体积，小于设置值的图片就会被转换成base64格式，改loader默认使用的是es6模块化，`html-loader`使用的是commonJS,所以需要关闭`url-loader`的esModule

- `file-loader`打包其他资源(除了html/js/css资源以外的资源)

### plugins

- `html-webpack-plugin`，复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）

```js
/*
  开发环境配置：能让代码运行
    运行项目指令：
      webpack 会将打包结果输出出去
      npx webpack-dev-server 只会在内存中编译打包，没有输出
*/

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // loader的配置
      {
        // 处理less资源
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          // 关闭es6模块化
          esModule: false,
          outputPath: 'imgs'
        }
      },
      {
        // 处理html中img资源
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        // 处理其他资源
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }
    ]
  },
  plugins: [
    // plugins的配置
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true
  }
};

```

##  生产环境配置

### loader

- `postcss-loader`,css兼容性处理：`postcss` --> `postcss-loader` `postcss-preset-env`,帮postcss找到`package.json`中`browserslist`里面的配置，通过配置加载指定的css兼容性样式

- `eslint-loader`,设置检查规则package.json中eslintConfig中设置，`"eslintConfig": {"extends":"airbnb-base"}`

- `babel-loader`
  1. 基本js兼容性处理 --> @babel/preset-env，问题：只能转换基本语法，如promise高级语法不能转换
  2. 全部js兼容性处理 --> @babel/polyfill ，问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
  3. 需要做兼容性处理的就做：按需加载  --> core-js

### plugins

- `mini-css-extract-plugin`对输出的css重命名，`MiniCssExtractPlugin.loader` 这个loader取代`style-loader` ,作用：提取js中的css成单独文件

- `optimize-css-assets-webpack-plugin`，直接调用一下就可以，压缩css

- 生产环境下自动压缩js

- `html-webpack-plugin`中配置，压缩html,去空格，去注释

```js
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在package.json中定义browserslist
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()]
    }
  }
];

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader']
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
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {version: 3},
                targets: {
                  chrome: '60',
                  firefox: '50'
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.(jpg|png|gif)/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'imgs',
          esModule: false
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          outputPath: 'media'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  mode: 'production'
};

```

##  优化配置

* 开发环境性能优化
* 生产环境性能优化

### 开发环境性能优化
* 优化打包构建速度
  * HMR
* 优化代码调试
  * source-map

### 生产环境性能优化
* 优化打包构建速度
  * oneOf
  * babel缓存
  * 多进程打包
  * externals
  * dll
* 优化代码运行的性能
  * 缓存(hash-chunkhash-contenthash)
  * tree shaking
  * code split
  * 懒加载/预加载
  * pwa

###  loader

- babel缓存，在`babel-loader`中开启`cacheDirectory: true`，hash: 每次wepack构建时会生成一个唯一的hash值。问题: 因为js和css同时使用一个hash值。 chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样， 问题: js和css的hash值还是一样的，因为css是在js中被引入的，所以同属于一个chunk。contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样   

- 多进程打包，`thread-loader`,开启多进程打包，进程启动大概为600ms，进程通信也有开销。只有工作消耗时间比较长，才需要多进程打包

### plugins

- PWA: 渐进式网络开发应用程序(离线可访问),`workbox-webpack-plugin`


### 其他

- HMR `hot module replacement` 热模块替换 / 模块热替换,样式文件：可以使用HMR功能：因为`style-loader`内部实现了,js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码,在`devServer`中配置`hot:true`

- source-map: 一种提供源代码到构建后代码映射技术,（如果构建后代码出错了，通过映射可以追踪源代码错误）

- oneOf中的loader只会匹配一个，不能有两个配置处理同一种类型文件

- tree shaking：去除无用代码，前提：1. 必须使用ES6模块化  2. 开启production环境 作用: 减少代码体积
  在`package.json`中配置`"sideEffects": ["*.css", "*.less"]`,不排除的话可能会把css / @babel/polyfill （副作用）文件干掉

- code-split 让某个文件被单独打包成一个chunk,import动态导入语法：能将某个文件单独打包,`import(/* webpackChunkName: 'test' */'./test')`

- preload和prefetch,懒加载：当文件需要使用时才加载，import()语法，prefetch预加载，会在使用之前，提前加载js文件，等其他资源加载完毕，浏览器空闲了，再偷偷加载资源`import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test')`

- externals，指定某个包拒绝被打包



  


