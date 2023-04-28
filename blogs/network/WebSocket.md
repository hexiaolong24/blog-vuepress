---
title: WebSocket
date: 2019-09-12
sidebar: 'auto'
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

```js
var ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = function (evt) {
	console.log('Connection open ...');
	ws.send('Hello WebSockets!');
};

ws.onmessage = function (evt) {
	console.log('Received Message: ' + evt.data);
	ws.close();
};

ws.onclose = function (evt) {
	console.log('Connection closed.');
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
import { useEffect, useRef, useState } from 'react';

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
			setError('WebSocket connection closed.');
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
import React, { useEffect, useRef, useState } from 'react';

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
	const ws = useWebSocket('ws://localhost:8080/ws', {
		onMessage: (event) => {
			console.log(event.data);
		},
	});

	useEffect(() => {
		if (ws) {
			ws.send('Hello, WebSocket!');
		}
	}, [ws]);

	return <div>Hello, WebSocket!</div>;
};
```
