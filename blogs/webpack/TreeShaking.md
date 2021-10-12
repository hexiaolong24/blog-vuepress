---
title: TreeShaking
date: 2021-08-24
sidebar: 'auto'
categories:
 - webpack
tags:
 - webpack
---

##  是什么
在webpack对模块进行打包时，将模块中未被使用的冗余代码剔除，仅打包有效代码，精简生成包的体积。
##  怎么用
1.  ESModule
前提是模块必须采用ES6Module语法，因为treeShaking依赖ES6的静态语法：import 和 export。如果项目中使用了babel的话， @babel/preset-env 默认将模块转换成CommonJs语法，因此需要设置module：false，webpack2后已经支持ESModule。
2.  webpack对模块打标记 && 压缩工具uglifyjs-webpack-plugin
-   预备知识
1）压缩工具的作用：混淆，压缩，最小化，删除不可达代码等
2）treeShaking依赖于对模块导出和被导入的分析
-   optimization.providedExports：确定每个模块的导出，用于其他优化或代码生成。默认所有模式都开启
-   optimization.usedExports：确定每个模块下被使用的导出。生产模式下默认开启，其他模式下不开启
3）webpack对代码进行标记，把import & export标记为3类
-   所有import标记为/* harmony import */
-   被使用过的export标记为/harmony export([type])/，其中[type]和webpack内部有关，可能是binding，immutable等
-   没有被使用的export标记为/* unused harmony export [FuncName] */，其中[FuncName]为export的方法名，之后使用Uglifyjs（或者其他类似的工具）进行代码精简，把没用的都删除。其中能标记为unused是需要optimization.usedExports，在开发环境下默认optimization.usedExports = false

##  [optimization.usedExports: true]
1.  webpack打包（uglifyWebpackPlugin处理前）
未被使用的export会被标记为/* unused harmony export name */，不会使用__webpack_require__.d进行exports绑定；
2.  经过UglifyJSPlugin压缩后，未使用的接口代码会被删除（如果被别的模块import导入但未被使用，同样会被剔除）。原理显而易见，age未被__webpack_require__.d引用，所以压缩工具可以将其安全移除。

##  对比CommonJs
可以看到ESModule中压缩工具可以根据静态分析得知哪些变量被引用，哪些未被引用，未被引用的就可以安全删除；而CommonJs中导出的变量都挂载在exports上，没法由静态分析得知是否被引用。

##  生产环境下
1.  webpack打包（uglifyWebpackPlugin处理前）
由于生产环境内置了ModuleConcatenationPlugin插件，实现"预编译"，让webpack根据模块间的关系依赖图中，将所有的模块连接成一个模块，称为"作用域提升"。对于代码缩小体积有很大的提升，也能侧面解决副作用的问题；每个模块会被标记//CONCATENATED MODULE。
2.  开启uglifyWebpackPlugin：
compress: true;函数的调用会被用函数体替换，使用变量处用其对应值代替，将未使用的变量删除。

##  总结
-   开启ScopeHoisting：所有代码打包到一个作用域内，然后使用压缩工具根据变量是否被引用进行处理，删除未被引用的代码；
-   未开启ScopeHoisting：每个模块保持自己的作用域，由webpack的treeShaking对export打标记，未被使用的导出不会被webpack链接到exports（即被引用数为0），然后使用压缩工具将被引用数为0的变量清除

##  sideEffects
### 是什么
在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。比如console.log()、 polyfills、import a CSS file等。由于编译器并不知道其是否会影响运行效果，故而不做处理。
### 怎么做
在package.json中设置如何处理副作用：
```js
// package.json
//false:无副作用，模块无export被使用时，可直接跳过（删除）该模块
//true:有副作用，保留副作用代码
"sideEffects": [Boolean], 
or
//[file1,file2]:指定有副作用的文件，在webpack作用域提升时就不会引入
//accepts relative, absolute, and glob patterns to the relevant files
"sideEffects": ['*.css', 'src/tool.js'],
```

### 扩展
package.json 和 webpack.optimization中sideEffects的区别？

后者表示是否识别第三方库 package.json 中的 sideEffects，以跳过无副作用的情况下没有export被使用的模块。生产模式下默认开启（true），其他模式不开启。
