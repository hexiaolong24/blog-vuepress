---
title: 原生node ajax
date: 2019-07-12
sidebar: 'auto'
categories:
 - network
tags:
 - network
isShowComments: false
keys:
 - '1360d01f3f0d562dc30b433a62443dcd'
---

```js

//node原生服务器
// let http = require('http')
// let server = http.createServer((request,response)=>{
//     response.send('ok')
// })
// server.listen(3000,(err)=>{
//     if (!err){
//         console.log('服务器连接成功')
//     } else {
//         console.log(err)
//     }
// })


//express搭建服务器
// let express = require('express')

// let app = express()
// app.disabled('x-powered-by')
// app.get('/',(request,response)=>{
//     response.send('ok')
// })

// app.listen(3000,function (err) {
//     if (!err){
//         console.log('服务器启动成功')
//     } else {
//         console.log(err)
//     }
// })



//原生Ajax
//1 实例化一个XMLHttpRequest对象
// let xhr = new XMLHttpRequest()
//2 给对象绑定监听
// xhr.onreadystatechange = function () {
    // if(xhr.readyState === 4 && xhr.status >= 200&&xhr.status<=299){
    //     console.log(xhr.response)
    // }
// }
//3 指定发请求的方式、地址、参数
// xhr.open("GET","http://localhost:3000/ajax_get?name=kobe&age=18&t="+Date.now())
//加现在的时间是为了解决IE在请求地址不变的情况下默认走强缓存的问题，而Chrome和火狐是尝试协商缓存
//4 发送请求
// xhr.send()



//POST请求
// let xhr = new XMLHttpRequest()
// xhr.onreadystatechange = function(){
//   if (xhr.readyState ===4 && xhr.status === 200){
//         console.log(xhr.response)
//       }
//    }

// xhr.open("POST","http://localhost:3000/")
//设置post请求所特有的请求头
// xhr.setRequestHeader("content-type","application/x-www-form-urlencoded")
//参数在这里写
// xhr.send("name=kobe&age=18")


```