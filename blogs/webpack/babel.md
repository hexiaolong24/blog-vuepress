---
title: babel
date: 2020-10-29
sidebar: "auto"
categories:
  - webpack
tags:
  - webpack
---

## 三部分

- 代码解析 Parser
  将代码(其实就是字符串)转换成 AST( 抽象语法树)
- 代码转换 transformer
  访问 AST 的节点进行变换操作生成新的 AST
- 代码生成
  以新的 AST 为基础生成代码

### 代码解析 （babel 使用 acorn 这个库）

1.  词法分析（将代码(字符串)分割为 token 流,即语法单元成的数组）

- 数字：JavaScript 中的科学记数法以及普通数组都属于语法单元
- 括号：『(』『)』只要出现,不管任何意义都算是语法单元
- 标识符：连续字符,常见的有变量,常量(例如: null true),关键字(if break)等等
- 运算符：+、-、\*、/等等
- 注释,中括号等

2.  语法分析（分析 token 流，即第一步生成的数组，并生成 AST）
    做语法分析需要依照标准,大多数 JavaScript Parser 都遵循 estree 规范，以下举例常见标准

- 语句：循环、if 判断、异常处理语句
- 表达式：表达式是一组代码的集合，它返回一个值,
- 声明： 变量声明、函数声明
  最终得到抽象语法树

```js
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "identifierName": "add",
            "init": {
                "type": "ArrowFunctionExpression",
                "params": [
                    {
                        "type": "identifier",
                        "identifierName": "a"
                    },
                    {
                        "type": "identifier",
                        "identifierName": "b"
                    }
                ],
                "body": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "identifier",
                        "identifierName": "a"
                    },
                    "operator": "+",
                    "right": {
                        "type": "identifier",
                        "identifierName": "b"
                    }
                }
            }
        }
    ]
}
```

### 代码转换

1.  如何转换
    > 转换代码的关键就是根据当前的抽象语法树,以我们定义的规则生成新的抽象语法树,转换的过程就是生成新抽象语法树的过程.

在 Babel 中我们使用者最常使用的地方就是代码转换,大家常用的 Babel 插件就是定义代码转换规则而生的,而代码解析和生成这一头一尾都主要是 Babel 负责。
比如我们要用 babel 做一个 React 转小程序的转换器，babel 工作流程的粗略情况是这样的：

- babel 将 React 代码解析为抽象语法树
- 开发者利用 babel 插件定义转换规则，根据原本的抽象语法树生成一个符合小程序规则的新抽象语法树
- babel 则根据新的抽象语法树生成代码，此时的代码就是符合小程序规则的新代码

例如 Taro 就是用 babel 完成的小程序语法转换.

2.  遍历抽象语法树
3.  转换代码

### 生成代码
