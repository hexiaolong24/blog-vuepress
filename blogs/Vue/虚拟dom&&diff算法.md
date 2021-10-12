---
title: 虚拟dom&&diff算法
date: 2020-08-04
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
 - 前端
 - 框架
---

##  虚拟DOM树

Vue 通过建立一个虚拟 DOM 来追踪自己要如何改变真实 DOM

```js
return h('h1', {}, this.blogTitle)
```

h() 到底会返回什么呢？其实不是一个实际的 DOM 元素。它更准确的名字可能是 createNodeDescription，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，包括及其子节点的描述信息。我们把这样的节点描述为“虚拟节点 (virtual node)”，也常简写它为 VNode。“虚拟 DOM”是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。

##  什么是VNode
我们知道，render function 会被转化成 VNode 节点。Virtual DOM 其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

##  实现一个VNode
VNode 归根结底就是一个 JavaScript 对象，只要这个类的一些属性可以正确直观地描述清楚当前节点的信息即可。我们来实现一个简单的 VNode 类，加入一些基本属性，为了便于理解，我们先不考虑复杂的情况。
```js
class VNode {
    constructor (tag, data, children, text, elm) {
        /*当前节点的标签名*/
        this.tag = tag;
        /*当前节点的一些数据信息，比如props、attrs等数据*/
        this.data = data;
        /*当前节点的子节点，是一个数组*/
        this.children = children;
        /*当前节点的文本*/
        this.text = text;
        /*当前虚拟节点对应的真实dom节点*/
        this.elm = elm;
    }
}
// vue组件
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>

// js表达
function render () {
    return new VNode(
        'span',
        {
            /* 指令集合数组 */
            directives: [
                {
                    /* v-show指令 */
                    rawName: 'v-show',
                    expression: 'isShow',
                    name: 'show',
                    value: true
                }
            ],
            /* 静态class */
            staticClass: 'demo'
        },
        [ new VNode(undefined, undefined, undefined, 'This is a span.') ]
    );
}

// 转换成VNode
{
    tag: 'span',
    data: {
        /* 指令集合数组 */
        directives: [
            {
                /* v-show指令 */
                rawName: 'v-show',
                expression: 'isShow',
                name: 'show',
                value: true
            }
        ],
        /* 静态class */
        staticClass: 'demo'
    },
    text: undefined,
    children: [
        /* 子节点是一个文本VNode节点 */
        {
            tag: undefined,
            data: undefined,
            text: 'This is a span.',
            children: undefined
        }
    ]
}
```

## complie 编译

-   compile 编译可以分成 parse、optimize 与 generate 三个阶段，最终需要得到 render function

### parse
-   parse 会用正则等方式将 template 模板中进行字符串解析，得到指令、class、style等数据，形成 AST
```js
{
    /* 标签属性的map，记录了标签上属性 */
    'attrsMap': {
        ':class': 'c',
        'class': 'demo',
        'v-if': 'isShow'
    },
    /* 解析得到的:class */
    'classBinding': 'c',
    /* 标签属性v-if */
    'if': 'isShow',
    /* v-if的条件 */
    'ifConditions': [
        {
            'exp': 'isShow'
        }
    ],
    /* 标签属性class */
    'staticClass': 'demo',
    /* 标签的tag */
    'tag': 'div',
    /* 子标签数组 */
    'children': [
        {
            'attrsMap': {
                'v-for': "item in sz"
            },
            /* for循环的参数 */
            'alias': "item",
            /* for循环的对象 */
            'for': 'sz',
            /* for循环是否已经被处理的标记位 */
            'forProcessed': true,
            'tag': 'span',
            'children': [
                {
                    /* 表达式，_s是一个转字符串的函数 */
                    'expression': '_s(item)',
                    'text': '{{item}}'
                }
            ]
        }
    ]
}
```

### optimize
-   optimize 主要作用就跟它的名字一样，用作「优化」。
-   经过 optimize 这层的处理，每个节点会加上 static 属性，用来标记是否是静态的。
-   判断的标准是当 type 为 2（表达式节点）则是非静态节点，当 type 为 3（文本节点）的时候则是静态节点。
-   如果子节点是非静态节点，那么当前节点也是非静态节点。

### generate
-   generate 会将 AST 转化成 render funtion 字符串，最终得到 render 的字符串以及 staticRenderFns 字符串。

##  diff算法
###   一些API
-   insert
insert 用来在 parent 这个父节点下插入一个子节点，如果指定了 ref 则插入到 ref 这个子节点前面。
-   createElm
用来新建一个节点， tag 存在创建一个标签节点，否则创建一个文本节点。
-   addVnodes
addVnodes 用来批量调用 createElm 新建节点
-   removeNode
removeNode 用来移除一个节点。
-   removeVnodes
removeVnodes 会批量调用 removeNode 移除节点。

### patch
-   首先 diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，是一种相当高效的算法

```js
function patch (oldVnode, vnode, parentElm) {
    if (!oldVnode) {
        addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
    } else if (!vnode) {
        removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
    } else {
        if (sameVnode(oldVNode, vnode)) {
            patchVnode(oldVNode, vnode);
        } else {
            removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
            addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
        }
    }
}
```
-   因为 patch 的主要功能是比对两个 VNode 节点，将「差异」更新到视图上，所以入参有新老两个 VNode 以及父节点的 element 。我们来逐步捋一下逻辑
-   首先在 oldVnode（老 VNode 节点）不存在的时候，相当于新的 VNode 替代原本没有的节点，所以直接用 addVnodes 将这些节点批量添加到 parentElm 上
-   然后同理，在 vnode（新 VNode 节点）不存在的时候，相当于要把老的节点删除，所以直接使用 removeVnodes 进行批量的节点删除即可。
-   最后一种情况，当 oldVNode 与 vnode 都存在的时候，需要判断它们是否属于 sameVnode（相同的节点）。如果是则进行patchVnode（比对 VNode ）操作，否则删除老节点，增加新节点。

### sameVnode
```js
function sameVnode () {
    return (
        a.key === b.key &&
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        (!!a.data) === (!!b.data) &&
        sameInputType(a, b)
    )
}

function sameInputType (a, b) {
    if (a.tag !== 'input') return true
    let i
    const typeA = (i = a.data) && (i = i.attrs) && i.type
    const typeB = (i = b.data) && (i = i.attrs) && i.type
    return typeA === typeB
}
```
sameVnode 其实很简单，只有当 key、 tag、 isComment（是否为注释节点）、 data同时定义（或不定义），同时满足当标签类型为 input 的时候 type 相同（某些浏览器不支持动态修改类型，所以他们被视为不同类型）即可。

### patchVnode
```js
function patchVnode (oldVnode, vnode) {
    if (oldVnode === vnode) {
        return;
    }

    if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key) {
        vnode.elm = oldVnode.elm;
        vnode.componentInstance = oldVnode.componentInstance;
        return;
    }

    const elm = vnode.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode.children;

    if (vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
    } else {
        if (oldCh && ch && (oldCh !== ch)) {
            updateChildren(elm, oldCh, ch);
        } else if (ch) {
            if (oldVnode.text) nodeOps.setTextContent(elm, '');
            addVnodes(elm, null, ch, 0, ch.length - 1);
        } else if (oldCh) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        } else if (oldVnode.text) {
            nodeOps.setTextContent(elm, '')
        }
    }
}
```
-   首先在新老 VNode 节点相同的情况下，就不需要做任何改变了，直接 return 掉。
-   下面的这种情况也比较简单，在当新老 VNode 节点都是 isStatic（静态的），并且 key 相同时，只要将 componentInstance 与 elm 从老 VNode 节点“拿过来”即可。这里的 isStatic 也就是前面提到过的「编译」的时候会将静态节点标记出来，这样就可以跳过比对的过程。
-   接下来，当新 VNode 节点是文本节点的时候，直接用 setTextContent 来设置 text，这里的 nodeOps 是一个适配层，根据不同平台提供不同的操作平台 DOM 的方法，实现跨平台。
-   当新 VNode 节点是非文本节点当时候，需要分几种情况。
1.  oldCh 与 ch 都存在且不相同时，使用 updateChildren 函数来更新子节点，这个后面重点讲。
2.  如果只有 ch 存在的时候，如果老节点是文本节点则先将节点的文本清除，然后将 ch 批量插入插入到节点elm下。
3.  同理当只有 oldch 存在时，说明需要将老节点通过 removeVnodes 全部清除。
4.  最后一种情况是当只有老节点是文本节点的时候，清除其节点文本内容

### updateChildren
-   首先我们定义 oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 分别是新老两个 VNode 的两边的索引，同时 oldStartVnode、newStartVnode、oldEndVnode 以及 newEndVnode 分别指向这几个索引对应的 VNode 节点
-   接下来是一个 while 循环，在这过程中，oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 会逐渐向中间靠拢。
-   接下来这一块，是将 oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 两两比对的过程，一共会出现 2*2=4 种情况。
-   首先是 oldStartVnode 与 newStartVnode 符合 sameVnode 时，说明老 VNode 节点的头部与新 VNode 节点的头部是相同的 VNode 节点，直接进行 patchVnode，同时 oldStartIdx 与 newStartIdx 向后移动一位。
-   其次是 oldEndVnode 与 newEndVnode 符合 sameVnode，也就是两个 VNode 的结尾是相同的 VNode，同样进行 patchVnode 操作并将 oldEndVnode 与 newEndVnode 向前移动一位。
-   接下来是两种交叉的情况。
-   先是 oldStartVnode 与 newEndVnode 符合 sameVnode 的时候，也就是老 VNode 节点的头部与新 VNode 节点的尾部是同一节点的时候，将 oldStartVnode.elm 这个节点直接移动到 oldEndVnode.elm 这个节点的后面即可。然后 oldStartIdx 向后移动一位，newEndIdx 向前移动一位
-   同理，oldEndVnode 与 newStartVnode 符合 sameVnode 时，也就是老 VNode 节点的尾部与新 VNode 节点的头部是同一节点的时候，将 oldEndVnode.elm 插入到 oldStartVnode.elm 前面。同样的，oldEndIdx 向前移动一位，newStartIdx 向后移动一位。
-   最后是当以上情况都不符合的时候，createKeyToOldIdx 的作用是产生 key 与 index 索引对应的一个 map 表。比如说：
```js
[
    {xx: xx, key: 'key0'},
    {xx: xx, key: 'key1'}, 
    {xx: xx, key: 'key2'}
]
```
-   在经过 createKeyToOldIdx 转化以后会变成：
```js
{
    key0: 0, 
    key1: 1, 
    key2: 2
}
```
-   我们可以根据某一个 key 的值，快速地从 oldKeyToIdx（createKeyToOldIdx 的返回值）中获取相同 key 的节点的索引 idxInOld，然后找到相同的节点
-   如果没有找到相同的节点，则通过 createElm 创建一个新节点，并将 newStartIdx 向后移动一位。
-   否则如果找到了节点，同时它符合 sameVnode，则将这两个节点进行 patchVnode，将该位置的老节点赋值 undefined（之后如果还有新节点与该节点key相同可以检测出来提示已有重复的 key ），同时将 newStartVnode.elm 插入到 oldStartVnode.elm 的前面。同理，newStartIdx 往后移动一位。
-   如果不符合 sameVnode，只能创建一个新节点插入到 parentElm 的子节点中，newStartIdx 往后移动一位。
-   最后一步就很容易啦，当 while 循环结束以后，如果 oldStartIdx > oldEndIdx，说明老节点比对完了，但是新节点还有多的，需要将新节点插入到真实 DOM 中去，调用 addVnodes 将这些节点插入即可。
-   同理，如果满足 newStartIdx > newEndIdx 条件，说明新节点比对完了，老节点还有多，将这些无用的老节点通过 removeVnodes 批量删除即可。