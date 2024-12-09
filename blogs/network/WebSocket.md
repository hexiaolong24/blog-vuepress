---
title: WebSocket
date: 2019-09-12
sidebar: "auto"
categories:
  - network
tags:
  - network
isShowComments: false
---

## 是什么

一种网络通信协议

## 为什么需要

- http 不能由服务端主动推送

## 特点

（1）建立在 TCP 协议之上，服务器端的实现比较容易。

（2）与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

（3）数据格式比较轻量，性能开销小，通信高效。

（4）可以发送文本，也可以发送二进制数据。

（5）没有同源限制，客户端可以与任意服务器通信。

（6）协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL

## 其他实时通讯的方法

- ajax 轮询
- 长轮询
  保持一个长连接，如果有返回就断开，如果没有就一直 hold，直到有响应，拿到数据继续发起

## 连接过程

- 发起 http 请求，告知进行 websocket 协议通讯，并告知版本

```js
// Requests Headers
Accept-Encoding: gzip, deflate, br
Accept-Language: zh,zh-TW;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6
Cache-Control: no-cache
Connection: Upgrade
Host: 127.0.0.1:3000
Origin: http://localhost:3000
Pragma: no-cache
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
Sec-WebSocket-Key: bwb9SFiJONXhQ/A4pLaXIg==
Sec-WebSocket-Version: 13
Upgrade: websocket

// 重点字段
// Connection: Upgrade 表示要升级协议
// Upgrade: websocket 要升级协议到websocket协议
// Sec-WebSocket-Version 表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。
// Sec-WebSocket-Key 对应服务端响应头的Sec-WebSocket-Accept，由于没有同源限制，websocket客户端可任意连接支持websocket的服务。这个就相当于一个钥匙一把锁，避免多余的，无意义的连接。

// Response Headers
Connection: Upgrade
Sec-WebSocket-Accept: 2jrbCWSCPlzPtxarlGTp4Y8XD20=
Upgrade: websocket

// 重点字段
// Sec-WebSocket-Accept: 用来告知服务器愿意发起一个websocket连接， 值根据客户端请求头的Sec-WebSocket-Key计算出来
```

## node 中的模块

- http 模块：用于处理 HTTP 请求和响应。WebSocket 是基于 HTTP 协议升级的，因此在 WebSocket 握手阶段会使用 http 模块。具体来说，WebSocket 使用 HTTP 协议中的 Upgrade 头来从 HTTP 连接升级到 WebSocket 连接。

- net 模块：底层 TCP 连接模块。WebSocket 是基于 TCP 协议的，net 模块提供了建立和管理 TCP 连接的基础。ws 库在底层使用了 net 模块来管理 WebSocket 连接。

- crypto 模块：用于生成 WebSocket 握手过程中的 Sec-WebSocket-Accept 值。WebSocket 握手要求服务端基于客户端提供的 Sec-WebSocket-Key 生成一个 Sec-WebSocket-Accept，其中涉及到 SHA-1 加密，crypto 模块正好提供了相关加密功能。

## api

```js
const ws = new WebSocket("ws://localhost:3000/websocket");

WebSocket.onopen： 连接成功后的回调
WebSocket.onclose： 连接关闭后的回调
WebSocket.onerror： 连接失败后的回调
WebSocket.onmessage： 客户端接收到服务端数据的回调
webSocket.bufferedAmount： 未发送至服务器的二进制字节数
WebSocket.binaryType： 使用二进制的数据类型连接
WebSocket.protocol ： 服务器选择的下属协议
WebSocket.url ： WebSocket 的绝对路径

WebSocket.readyState： 当前连接状态，对应的四个常量
// WebSocket.CONNECTING	0
// WebSocket.OPEN	1
// WebSocket.CLOSING	2
// WebSocket.CLOSED	3
```

```js
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function (evt) {
  console.log("Connection open ...");
  ws.send("Hello WebSockets!");
};

ws.onmessage = function (evt) {
  console.log("Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function (evt) {
  console.log("Connection closed.");
};
```

```js
import { useRef, useEffect } from 'react'

interface WebSocketMessage {
  [key: string]: any
}

interface WebSocketHookOptions {
  onOpen?: () => void
  onClose?: () => void
  onMessage?: (data: WebSocketMessage) => void
  onError?: (error: Event) => void
}

export function useWebSocket(url: string, options: WebSocketHookOptions = {}) {
  const { onOpen, onClose, onMessage, onError } = options

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket(url)

    socketRef.current = socket

    if (onOpen) {
      socket.addEventListener('open', onOpen)
    }

    if (onClose) {
      socket.addEventListener('close', onClose)
    }

    if (onMessage) {
      const messageHandler = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data)
          onMessage(data)
        } catch (error) {
          console.error('WebSocket message error', error)
        }
      }
      socket.addEventListener('message', messageHandler)
      return () => {
        socket.removeEventListener('message', messageHandler)
      }
    }

    if (onError) {
      socket.addEventListener('error', onError)
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [url, onOpen, onClose, onMessage, onError])

  return {
    send: (data: any) => {
      const socket = socketRef.current
      if (socket) {
        socket.send(JSON.stringify(data))
      } else {
        console.error('WebSocket is not connected')
      }
    },
  }
}

```

```ts
import { useEffect, useRef, useState } from "react";

type WebSocketHook = [
  WebSocket | null,
  {
    sendMessage: (message: any) => void;
    closeWebSocket: () => void;
  } | null,
  boolean,
  string | null
];

type OnMessageCallback = (message: any) => void;

export const useWebSocket = (
  url: string,
  onMessage: OnMessageCallback
): WebSocketHook => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const webSocketRef = useRef<WebSocket | null>(null);

  const sendMessage = (message: any) => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === WebSocket.OPEN
    ) {
      webSocketRef.current.send(JSON.stringify(message));
    }
  };

  const closeWebSocket = () => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    webSocketRef.current = new WebSocket(url);

    webSocketRef.current.onopen = () => {
      setIsLoading(false);
      setWebSocket(webSocketRef.current);
    };

    webSocketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    webSocketRef.current.onclose = () => {
      setWebSocket(null);
      setError("WebSocket connection closed.");
    };

    webSocketRef.current.onerror = (error) => {
      setError(error.message);
    };

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [url, onMessage]);

  return [webSocket, { sendMessage, closeWebSocket }, isLoading, error];
};
```

```ts
import React, { useEffect, useRef, useState } from "react";

type WebSocketOptions = {
  onMessage: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onOpen?: (event: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
};

const useWebSocket = (
  url: string,
  options: WebSocketOptions
): WebSocket | undefined => {
  const {
    onMessage,
    onError = () => {},
    onClose = () => {},
    onOpen = () => {},
    reconnectInterval = 1000,
    reconnectAttempts = Infinity,
  } = options;

  const [ws, setWebSocket] = useState<WebSocket>();
  const reconnectCount = useRef<number>(0);

  const connect = () => {
    const socket = new WebSocket(url);
    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = (event) => {
      onClose(event);

      if (!ws) {
        // try to reconnect immediately if the initial connection failed
        setTimeout(() => {
          connect();
        }, reconnectInterval);
      } else if (reconnectCount.current < reconnectAttempts) {
        // otherwise attempt to reconnect using exponential backoff
        setTimeout(() => {
          reconnectCount.current += 1;
          connect();
        }, reconnectInterval * Math.pow(2, reconnectCount.current));
      }
    };
    socket.onopen = (event) => {
      setWebSocket(socket);
      onOpen(event);
      reconnectCount.current = 0; // reset the reconnect counter after a successful connection
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return ws;
};

// Usage example
const App = () => {
  const ws = useWebSocket("ws://localhost:8080/ws", {
    onMessage: (event) => {
      console.log(event.data);
    },
  });

  useEffect(() => {
    if (ws) {
      ws.send("Hello, WebSocket!");
    }
  }, [ws]);

  return <div>Hello, WebSocket!</div>;
};
```
