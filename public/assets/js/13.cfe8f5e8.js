(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{499:function(t,a,n){"use strict";n.r(a);var e=n(4),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h2",{attrs:{id:"三个阶段"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#三个阶段"}},[t._v("#")]),t._v(" 三个阶段")]),t._v(" "),n("p",[t._v("首先我们都知道变量的赋值操作可以分为三个阶段，1创建变量 2 初始化变量，也就是申明变量 3 真正的赋值")]),t._v(" "),n("h2",{attrs:{id:"变量提升"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#变量提升"}},[t._v("#")]),t._v(" 变量提升")]),t._v(" "),n("p",[t._v("变量提升其实是变量申明提升，比如var a = 1，在这行代码执行之前访问a 变量是undefined，而不会报错，我们知道如果访问一个没有申明的变量时，会沿着作用域链找，如果没有找到会报错，（补充：但是访问一个变量的某个属性时如果没有就不会报错，而是undefined，这就说明 js 是一门动态型语言）")]),t._v(" "),n("p",[t._v("回到变量提升，var a = 1其实是三步，先是创建一个变量a ，之后初始化a,也就是申明变量var a  ; 最后是a = 1 ;在代码执行之前，js引擎会将所有的变量申明提前解析，这就是我们通常说的预解析，所以不会报错，而是undefined")]),t._v(" "),n("h2",{attrs:{id:"函数提升"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#函数提升"}},[t._v("#")]),t._v(" 函数提升")]),t._v(" "),n("p",[t._v("当然不只是var 的变量会提升，函数申明式function同样也会提升，而且函数提升不光会初始化，第三步真正的赋值操作也会提升，所以我们定义一个函数，不管在哪里都可以直接调用这个函数，而不是必须写在函数之后，当然前提是通过函数申明式创建的函数，如果你是通过函数表达式的形式创建，那和var 一个变量的效果其实是一样的，会得undefined，如果调用也会报错，提示xxx is not a function")]),t._v(" "),n("p",[t._v("同时函数提升也有特殊的地方，关于函数变量提升，在全局变量对象中的函数申明式都会变量提升，但是在局部作用域中，比如函数内部又有一个函数，内部这个函数如果不return或者不调用的话，就不会变量提升，其实js这样的设计，我个人的理解是因为全局变量对象中的代码会很多，如果我们和局部作用域中的函数一样，在有调用语句出现后才会预解析的话，这样效率会变低，但是因为局部作用域中的代码相对较少，所以会这样设计")]),t._v(" "),n("p",[t._v("最后一点就是如果函数和变量同名时，预解析的结果永远是函数")]),t._v(" "),n("blockquote",[n("p",[t._v("原因：1 函数优先级高于var  2 顺序解析 先var fn = 1，结果是var fn  ，之后function fn () {} ,直接定义函数，赋值  ，如果先是unction fn () {}，直接定义了函数，之后再看到var fu = 1 ,不会再看了，结果还是function")])]),t._v(" "),n("h2",{attrs:{id:"let-和-const"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#let-和-const"}},[t._v("#")]),t._v(" let 和 const")]),t._v(" "),n("p",[t._v("ES6 中 let 和 const 其实也存在变量提升，只是在创建过程中被提升了，但是初始化没有提升，不能提前访问，会报错Cannot access 'a' before initialization，let不能重复申明，在块级作用域中有效，const 定义一个常量，不能修改，其他和let一样")])])}),[],!1,null,null,null);a.default=r.exports}}]);