---
title: electron入门
date: 2019-03-11
sidebar: 'auto'
categories:
 - electron
---

##  hello world

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>holle world</title>
</head>
<body>
  holle world
</body>
</html>
```
main.js,注意将入口文件改问main.js

```js
let electron = require('electron')
let app = electron.app
let BrowserWindow = electron.BrowserWindow
let mainWindow = null

app.on('ready',() => {
  mainWindow = new BrowserWindow({
    width:  600,
    height: 600
  })
  mainWindow.loadFile('index.html')
  mainWindow.on('closed',() => {
    mainWindow = null
  })
})
```

##  主进程、渲染进程

main.js:

```js
let electron = require('electron')
// 引用app
let app = electron.app 
// 窗口引用
let BrowserWindow = electron.BrowserWindow
// 声明主窗口
let mainWindow = null

app.on('ready',() => {
  // 创建主窗口
  mainWindow = new BrowserWindow({
    width:  600,
    height: 600,
    // 启用node api
    webPreferences: {
      nodeIntegration: true
    }
  })
  // 加载html页面
  mainWindow.loadFile('index.html')
  // 监听主进程关闭
  mainWindow.on('closed',() => {
    mainWindow = null
  })
})
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>holle world</title>
</head>
<body>
  <button id="btn">全明星</button>
  <div id="all"></div>
  <script src="render/index.js"></script>
</body>
</html>
```

render/index.js

```js
let fs = require('fs')
window.onload = function() {
  let btn = this.document.querySelector('#btn')
  let div = this.document.querySelector('#all')
  btn.onclick = () => {
    fs.readFile('nba.txt', (err, data) => {
      if (!err) {
        div.innerHTML = data
      }
    }) 
  }
}
```

##  remote

> 在渲染进程中使用主进程模块

render/demo02.js

```js
// remote之后才能用主进程的方法
let BrowserWindow = require('electron').remote.BrowserWindow
window.onload = function() {
  let btn = this.document.querySelector('#btn')
  btn.onclick = () => {
    minWin = new BrowserWindow({
      width: 500,
      height: 500
    })
    // 加载html页面
    minWin.loadFile('pink.html')
    // 监听主进程关闭
    minWin.on('closed',() => {
      minWin = null
    })
  }
}
```
