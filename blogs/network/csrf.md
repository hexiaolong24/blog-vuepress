---
title: csrf
date: 2019-09-12
sidebar: 'auto'
categories:
 - network
tags:
 - network
isShowComments: false
---

##  定义
CSRF(Cross-site request forgery), 即跨站请求伪造，指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户目前的登录状态发起跨站请求。

##  分类
- 自动发get请求，携带cookie
```html
<img src="https://xxx.com/info?user=hhh&count=100">
```
- 自动发post请求
```js
<form id='hacker-form' action="https://xxx.com/info" method="POST">
  <input type="hidden" name="user" value="hhh" />
  <input type="hidden" name="count" value="100" />
</form>
<script>document.getElementById('hacker-form').submit();</script>
```
- 诱导触发get请求

这就是CSRF攻击的原理。和XSS攻击对比，CSRF 攻击并不需要将恶意代码注入用户当前页面的html文档中，而是跳转到新的页面，利用服务器的验证漏洞和用户之前的登录状态来模拟用户进行操作

##  措施
1.  cookie的SameSite
  - Strict 浏览器完全禁止第三方请求携带Cookie
  - Lax 只能在 get 方法提交表单况或者a 标签发送 get 请求的情况下可以携带 Cookie
  - None 默认会携带cookie
2.  验证来源站点
  - Origin只包含域名信息，而
  - Referer包含了具体的 URL 路径。
  - 当然，这两者都是可以伪造的，通过 Ajax 中自定义请求头即可，安全性略差
3.  csrf Token