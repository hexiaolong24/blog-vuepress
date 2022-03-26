---
title: cookie
date: 2019-06-12
sidebar: 'auto'
categories:
 - network
tags:
 - network
isShowComments: false
---

# cookie

##  是什么
Cookie 是服务器保存在浏览器的一小段文本信息，一般大小不能超过4KB

HTTP 协议不带有状态，有些请求需要区分状态，就通过 Cookie 附带字符串，让服务器返回不一样的回应。举例来说，用户登录以后，服务器往往会在网站上留下一个 Cookie，记录用户编号（比如id=1234），以后每次浏览器向服务器请求数据，就会带上这个字符串，服务器从而知道是谁在请求，应该回应什么内容

##  作用
Cookie 的目的就是区分用户，以及放置状态信息

##  使用场景
1.  对话（session）管理：保存登录状态、购物车等需要记录的信息
2.  个性化信息：保存用户的偏好，比如网页的字体大小、背景色等等
3.  追踪用户：记录和分析用户行为

Cookie 不是一种理想的客户端存储机制。它的容量很小（4KB），缺乏数据操作接口，而且会影响性能。客户端存储建议使用 Web storage API 和 IndexedDB。只有那些每次请求都需要让服务器知道的信息，才应该放在 Cookie 里面

##  包括什么
- Cookie 的名字
- Cookie 的值（真正的数据写在这里面）
- 到期时间（超过这个时间会失效）
- 所属域名（默认为当前域名）
- 生效的路径（默认为当前网址

##  使用
不使用cookie功能
```js
window.navigator.cookieEnabled // true
```

##  限制
- 一般来说，单个域名设置的 Cookie 不应超过30个，
- 每个 Cookie 的大小不能超过 4KB。超过限制以后，Cookie 将被忽略，不会被设置。

如果服务器想改变一个早先设置的 Cookie，必须同时满足四个条件：Cookie 的key、domain、path和secure都匹配

##  界限
Cookie 是按照域名区分的，foo.com只能读取自己放置的 Cookie，无法读取其他网站（比如bar.com）放置的 Cookie。一般情况下，一级域名也不能读取二级域名留下的 Cookie，比如mydomain.com不能读取subdomain.mydomain.com设置的 Cookie。但是有一个例外，设置 Cookie 的时候（不管是一级域名设置的，还是二级域名设置的），明确将domain属性设为一级域名，则这个域名下面的各级域名可以共享这个 Cookie。

```js
Set-Cookie: name=value; domain=mydomain.com
```

注意，区分 Cookie 时不考虑协议和端口。也就是说，http://example.com设置的 Cookie，可以被https://example.com或http://example.com:8080读取。

##  HTTP回应
- 服务器如果希望在浏览器保存 Cookie，就要在 HTTP 回应的头信息里面，放置一个Set-Cookie字段。

```js
Set-Cookie:foo=bar
```

##  HTTP请求
- 浏览器向服务器发送 HTTP 请求时，每个请求都会带上相应的 Cookie。也就是说，把服务器早前保存在浏览器的这段信息，再发回服务器。这时要使用 HTTP 头信息的Cookie字段。

##  属性
- Expires，Max-Age
Expires属性指定一个具体的到期时间，到了指定时间以后，浏览器就不再保留这个 Cookie。它的值是 UTC 格式，可以使用Date.prototype.toUTCString()进行格式转换。

```js
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```
如果不设置该属性，或者设为null，Cookie 只在当前会话（session）有效，浏览器窗口一旦关闭，当前 Session 结束，该 Cookie 就会被删除。另外，浏览器根据本地时间，决定 Cookie 是否过期，由于本地时间是不精确的，所以没有办法保证 Cookie 一定会在服务器指定的时间过期。

Max-Age属性指定从现在开始 Cookie 存在的秒数，比如60 * 60 * 24 * 365（即一年）。过了这个时间以后，浏览器就不再保留这个 Cookie。

如果同时指定了Expires和Max-Age，那么Max-Age的值将优先生效。

如果Set-Cookie字段没有指定Expires或Max-Age属性，那么这个 Cookie 就是 Session Cookie，即它只在本次对话存在，一旦用户关闭浏览器，浏览器就不会再保留这个 Cookie。

- Domain，Path 
Domain属性指定 Cookie 属于哪个域名，以后浏览器向服务器发送 HTTP 请求时，通过这个属性判断是否要附带某个 Cookie。

Path属性指定浏览器发出 HTTP 请求时，哪些路径要附带这个 Cookie。只要浏览器发现，Path属性是 HTTP 请求路径的开头一部分，就会在头信息里面带上这个 Cookie。比如，Path属性是/，那么请求/docs路径也会包含该 Cookie。当然，前提是 Domain 属性必须符合条件

- Secure，HttpOnly
Secure属性指定浏览器只有在加密协议 HTTPS 下，才能将这个 Cookie 发送到服务器。另一方面，如果当前协议是 HTTP，浏览器会自动忽略服务器发来的Secure属性。该属性只是一个开关，不需要指定值。如果通信是 HTTPS 协议，该开关自动打开。

HttpOnly属性指定该 Cookie 无法通过 JavaScript 脚本拿到，主要是document.cookie属性、XMLHttpRequest对象和 Request API 都拿不到该属性。这样就防止了该 Cookie 被脚本读到，只有浏览器发出 HTTP 请求时，才会带上该 Cookie。

- SameSite
Chrome 51 开始，浏览器的 Cookie 新增加了一个SameSite属性，用来防止 CSRF 攻击和用户追踪。

> 摘自 阮一峰老师 https://wangdoc.com/javascript/bom/cookie.html
