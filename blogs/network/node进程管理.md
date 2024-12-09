---
title: node进程管理
date: 2019-09-24
sidebar: "auto"
categories:
  - network
tags:
  - Node.js
---

## 创建子进程

node 提供了 child_process 模块用来进行子进程的创建，该模块一共有四个方法用来创建子进程。

```js
const { spawn, exec, execFile, fork } = require('child_process')

spawn(command[, args][, options])

exec(command[, options][, callback])

execFile(file[, args][, options][, callback])

fork(modulePath[, args][, options])
```

### spawn

```js
const { spawn } = require("child_process");
const child = spawn("ls", ["-lh", "/home"]);

child.on("close", (code) => {
  console.log(`子进程退出码：${code}`);
});

const { stdin, stdout, stderr } = child;

stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});
```

- 通过 spawn 创建的子进程，继承自 EventEmitter，所以可以在上面进行事件（discount，error，close，message）的监听。同时子进程具有三个输入输出流：stdin、stdout、stderr，通过这三个流，可以实时获取子进程的输入输出和错误信息。
- 这个方法的最终实现基于 libuv

### exec/execFile

- exec 最后调用的就是 execFile 方法,唯一的区别是，exec 中调用的 normalizeExecArgs 方法会将 opts 的 shell 属性默认设置为 true。

```js
exports.exec = function exec(/* command , options, callback */) {
  const opts = normalizeExecArgs.apply(null, arguments);
  return exports.execFile(opts.file, opts.options, opts.callback);
};

function normalizeExecArgs(command, options, callback) {
  options = { ...options };
  options.shell = typeof options.shell === "string" ? options.shell : true;
  return { options };
}
```

- 在 exec 中最终调用的是 spawn 方法

```js
exports.execFile = function execFile(file /* , args, options, callback */) {
  let args = [];
  let callback;
  let options;
  var child = spawn(file, args, {
    // ... some options
  });

  return child;
};
```

- exec 会将 spawn 的输入输出流转换成 String，默认使用 UTF-8 的编码，然后传递给回调函数，使用回调方式在 node 中较为熟悉，比流更容易操作，所以我们能使用 exec 方法执行一些 shell 命令，然后在回调中获取返回值。有点需要注意，这里的 buffer 是有最大缓存区的，如果超出会直接被 kill 掉，可用通过 maxBuffer 属性进行配置（默认: 200\*1024）。

```js
const { exec } = require("child_process");
exec("ls -lh /home", (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
```

### fork

- fork 最后也是调用 spawn 来创建子进程，但是 fork 是 spawn 的一种特殊情况，用于衍生新的 Node.js 进程，会产生一个新的 V8 实例，所以执行 fork 方法时需要指定一个 js 文件。

```js
exports.fork = function fork(modulePath /* , args, options */) {
  // ...

  options.shell = false;

  return spawn(options.execPath, args, options);
};
```

- 通过 fork 创建子进程之后，父子进程直接会创建一个 IPC（进程间通信）通道，方便父子进程直接通信，在 js 层使用 process.send(message) 和 process.on('message', msg => {}) 进行通信。而在底层，实现进程间通信的方式有很多，Node 的进程间通信基于 libuv 实现，不同操作系统实现方式不一致。在\*unix 系统中采用 Unix Domain Socket 方式实现
- parent.js

```js
const path = require("path");
const { fork } = require("child_process");
const child = fork(path.join(__dirname, "child.js"));
child.on("message", (msg) => {
  console.log("message from child", msg);
});
child.send("hello child, I'm master");
```

- child.js

```js
process.on("message", (msg) => {
  console.log("message from master:", msg);
});
let counter = 0;
setInterval(() => {
  process.send({
    child: true,
    counter: counter++,
  });
}, 1000);
```

## 惊群是什么

- 简单说来，多线程/多进程等待同一个 socket 事件，当这个事件发生时，这些线程/进程被同时唤醒，就是惊群。可以想见，效率很低下，许多进程被内核重新调度唤醒，同时去响应这一个事件，当然只有一个进程能处理事件成功，其他的进程在处理该事件失败后重新休眠（也有其他选择）。这种性能浪费现象就是惊群。

- 惊群通常发生在 server 上，当父进程绑定一个端口监听 socket，然后 fork 出多个子进程，子进程们开始循环处理（比如 accept）这个 socket。每当用户发起一个 TCP 连接时，多个子进程同时被唤醒，然后其中一个子进程 accept 新连接成功，余者皆失败，重新休眠

- 可以使用 Nginx 负载均衡处理

## cluster 模块

除了用 nginx 做反向代理，node 本身也提供了一个 cluster 模块，用于多核 CPU 环境下多进程的负载均衡。cluster 模块创建子进程本质上是通过 child_procee.fork，利用该模块可以很容易的创建共享 http 服务同一端口的子进程服务器。

```js
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // 判断是否为主进程
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 子进程进行服务器创建
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是一个 HTTP 服务器。
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("hello world\n");
    })
    .listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 子进程端口监听问题

子进程全部都在监听同一个端口，我们知道，服务监听同一个端口会出现端口占用的问题，那么 cluster 模块如何保证端口不冲突的呢？ - http 模块的 createServer 继承自 net 模块。

- 在 net 模块中，listen 方法会调用 listenInCluster 方法，listenInCluster 判断当前是否为 master 进程。
- 所有子进程的 listen 其实是不起作用的
- 基于 round-robin 算法的一种模型。主要思路是 master 进程创建 socket，绑定地址以及端口后再进行监听。该 socket 的 fd 不传递到各个 worker 进程。当 master 进程获取到新的连接时，再决定将 accept 到的客户端连接分发给指定的 worker 处理。这里使用了指定, 所以如何传递以及传递给哪个 worker 完全是可控的。round-robin 只是其中的某种算法而已，当然可以换成其他的

### 主进程与子进程通信

- fork 子进程的时候，对子进程进行了 internalMessage 事件的监听。

```js
worker.process.on("internalMessage", internal(worker, onmessage));
```

- 子进程向 master 进程发送消息，一般使用 process.send 方法，会被监听的 message 事件所接收。这里是因为发送的 message 指定了 cmd: 'NODE*CLUSTER'，只要 cmd 字段以 NODE*开头，这样消息就会认为是内部通信，被 internalMessage 事件所接收。
- master 进程接收到消息后，根据 act 的类型开始执行不同的方法，这里 act 为 queryServer。queryServer 方法会构造一个 key，如果这个 key（规则主要为地址+端口+文件描述符）之前不存在，则对 RoundRobinHandle 构造函数进行了实例化，RoundRobinHandle 构造函数中启动了一个 TCP 服务，并对之前指定的端口进行了监听

## 监听退出

- 给 process 对象添加 uncaughtException 事件绑定能够避免发生异常时进程直接退出。在回调函数里调用当前运行 server 对象的 close 方法，停止接收新的连接。同时告知 master 进程该 worker 进程即将退出，可以 fork 新的 worker 了。

- 接着在几秒中之后差不多所有请求都已经处理完毕后，该进程主动退出，其中 timeout 可以根据实际业务场景进行设置

```js
setTimeout(function () {
  process.exit(1);
}, timeout);
```

- 在关闭服务器之前，后续新接收的 request 全部关闭 keep-alive 特性，通知客户端不需要与该服务器保持 socket 连接了。

```js
server.on("request", function (req, res) {
  req.shouldKeepAlive = false;
  res.shouldKeepAlive = false;
  if (!res._header) {
    res.setHeader("Connection", "close");
  }
});
```

## 进程守护

cluster 模块已经处理好了进程守护，当某个 worker 进程发生异常退出或者与 master 进程失去联系（disconnected）时，master 进程都会收到相应的事件通知。

```js
cluster.on("exit", function () {
  clsuter.fork();
});

cluster.on("disconnect", function () {
  clsuter.fork();
});
```

### 捕获异常

- process.on('uncaughtException', handler)
