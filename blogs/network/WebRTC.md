---
title: WebRTC
date: 2019-09-12
sidebar: 'auto'
categories:
 - network
tags:
 - network
isShowComments: false
---

##  是什么
WebRTC（Web Real-Time Communications）是由谷歌开源并推进纳入W3C标准的一项音视频技术，旨在通过点对点的方式，在不借助中间媒介的情况下，实现浏览器之间的实时音视频通信

##  第一步 找到对方

- 信令服务器
所谓信令（signaling）服务器，是一个帮助双方建立连接的「中间人」，WebRTC并没有规定信令服务器的标准，意味着开发者可以用任何技术来实现，如WebSocket或http

- 发起WebRTC通信的两端被称为对等端（Peer），成功建立的连接被称为PeerConnection，一次WebRTC通信可包含多个PeerConnection
- 在寻找对等端阶段，信令服务器的工作一般是标识与验证参与者的身份，浏览器连接信令服务器并发送会话必须信息，如房间号、账号信息等，由信令服务器找到可以通信的对等端并开始尝试通信

##  第二步 进行协商
协商过程主要指SDP交换。

SDP（Session Description Protocol）指会话描述协议，是一种通用的协议，使用范围不仅限于WebRTC。主要用来描述多媒体会话，用途包括会话声明、会话邀请、会话初始化等。
### SDP作用
- 设备支持的媒体能力，包括编解码器等
- ICE候选地址
- 流媒体传输协议

```js
// v=代表协议版本号
// o=代表会话发起者，包括username、sessionId等
// s=代表session名称，为唯一字段
// c=代表连接信息，包括网络类型、地址类型、地址等
// t=代表会话时间，包括开始/结束时间，均为0表示持久会话
// m=代表媒体描述，包括媒体类型、端口、传输协议、媒体格式等
// a=代表附加属性，此处用于对媒体协议进行扩展

v=0
o=alice 2890844526 2890844526 IN IP4 host.anywhere.com
s=
c=IN IP4 host.anywhere.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
m=video 51372 RTP/AVP 31
a=rtpmap:31 H261/90000
m=video 53000 RTP/AVP 32
a=rtpmap:32 MPV/90000
```

##  第三步：建立连接
现代互联网环境非常复杂，我们的设备通常隐藏在层层网关后面，因此，要建立直接的连接，还需要知道双方可用的连接地址，这个过程被称为NAT穿越，主要由ICE服务器完成，所以也称为ICE打洞。

##  第四步：进行通信
WebRTC选择了UDP作为底层传输协议

- 原因
  - UDP协议无连接，资源消耗小，速度快
  - 传输过程中少量的数据损失影响不大
  - TCP协议的超时重连机制会造成非常明显的延迟

而在UDP之上，WebRTC使用了再封装的RTP与RTCP两个协议：

  - RTP（Realtime Transport Protocol）：实时传输协议，主要用来传输对实时性要求比较高的数据，比如音视频数据
  - RTCP（RTP Trasport Control Protocol）：RTP传输控制协议，顾名思义，主要用来监控数据传输的质量，并给予数据发送方反馈


