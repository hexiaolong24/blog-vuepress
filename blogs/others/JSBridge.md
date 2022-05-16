---
title: JSBridge
date: 2020-07-02
sidebar: "auto"
categories:
  - others
tags:
  - 前端
---

##  作用
- 在Hybrid模式下，H5会经常需要使用Native的功能，比如打开二维码扫描、调用原生页面、获取用户信息等，同时Native也需要向Web端发送推送、更新状态等，而JavaScript是运行在单独的JS Context中（Webview容器、JSCore等），与原生有运行环境的隔离，所以需要有一种机制实现Native端和Web端的双向通信，这就是JSBridge：以JavaScript引擎或Webview容器作为媒介，通过协定协议进行通信，实现Native端和Web端双向通信的一种机制。
- 通过JSBridge，Web端可以调用Native端的Java接口，同样Native端也可以通过JSBridge调用Web端的JavaScript接口，实现彼此的双向调用

##  Webview
- webView是移动端提供的运行JavaScript的环境，是系统渲染Web网页的一个控件，可与页面JavaScript交互，实现混合开发，其中Android和iOS又有些不同：

  - Android的WebView采用的是低版本和高版本使用了不同的webkit内核，4.4后直接使用了Chrome。
  - iOS中UIWebView算是自IOS2就有，但性能较差，特性支持较差，WKWebView是iOS8之后的升级版，性能更强特性支持也较好。

WebView控件除了能加载指定的url外，还可以对URL请求、JavaScript的对话框、加载进度、页面交互进行强大的处理，之后会提到拦截请求、执行JS脚本都依赖于此


##  Native 与 Webview 的通信方式

### js调用native
####  几种方式
1.  Native 向 Webview 中的 window 注入一个暴露指定 Native 方法 ( Android ) 或接受 JavaScript 消息 ( iOS ) 的对象
2.  拦截 Webview 内的某类特定的 URL Scheme，并根据 URL 来执行对应的 Native 方法。
3.  拦截 JavaScript 的 console.log 、alert 、prompt 或 confirm，并执行对应的 Native 方法

####  注入式
- Android（4.2+）提供了addJavascriptInterface注入
```js
  // 注入全局JS对象
webView.addJavascriptInterface(new NativeBridge(this), "NativeBridge");

class NativeBridge {
  private Context ctx;
  NativeBridge(Context ctx) {
    this.ctx = ctx;
  }

  // 增加JS调用接口
  @JavascriptInterface
  public void showNativeDialog(String text) {
    new AlertDialog.Builder(ctx).setMessage(text).create().show();
  }
}
```
- iOS的UIWebView提供了JavaSciptCore
- iOS的WKWebView提供了WKScriptMessageHandler
#### URL SCHEME
  - 安卓提供了shouldOverrideUrlLoading方法拦截
  - UIWebView使用shouldStartLoadWithRequest，WKWebView则使用decidePolicyForNavigationAction
URL SCHEME是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol 和 host 一般是自定义的，例如: qunarhy://hy/url?url=ymfe.tech，protocol 是 qunarhy，host 则是 hy,如果符合我们自定义的URL Schema，对URL进行解析，拿到相关操作、操作，进而调用原生Native的方法,如果不符合我们自定义的URL Schema，我们直接转发，请求真正的服务
  - 缺陷
    - 使用 iframe.src 发送 URL SCHEME 会有 url 长度的隐患，数据格式有限制
    - 创建请求，需要一定的耗时，比注入 API 的方式调用同样的功能，耗时会较长
  - 为什么选择 iframe.src 不选择其他
    - a标签需要用户操作
    - location.href可能会引起页面的跳转丢失调用
    - 发送ajax请求Android没有相应的拦截方法

### native调用js
- Native端调用Web端，这个比较简单，JavaScript作为解释性语言，最大的一个特性就是可以随时随地地通过解释器执行一段JS代码，所以可以将拼接的JavaScript代码字符串，传入JS解析器执行就可以，JS解析器在这里就是webView
1.  Android 4.4之前只能用loadUrl来实现，并且无法执行回调
```js
String jsCode = String.format("window.showWebDialog('%s')", text);
webView.loadUrl("javascript: " + jsCode);
```
2.  Android 4.4之后提供了evaluateJavascript来执行JS代码，并且可以获取返回值执行回调
```js
String jsCode = String.format("window.showWebDialog('%s')", text);
webView.evaluateJavascript(jsCode, new ValueCallback<String>() {
  @Override
  public void onReceiveValue(String value) {

  }
});
```
- iOS2的UIWebView使用stringByEvaluatingJavaScriptFromString

- iOS8的WKWebView使用evaluateJavaScript

##  带回调的调用
上面已经说到了Native、Web间双向通信的两种方法，但站在一端而言还是一个单向通信的过程 ，比如站在Web的角度：Web调用Native的方法，Native直接相关操作但无法将结果返回给Web，但实际使用中会经常需要将操作的结果返回，也就是JS回调
- 实现
我们在一端调用的时候在参数中加一个callbackId标记对应的回调，对端接收到调用请求后，进行实际操作，如果带有callbackId，对端再进行一次调用，将结果、callbackId回传回来，这端根据callbackId匹配相应的回调，将结果传入执行就可以了，实际上还是通过两次调用实现的
```js
// Web端代码：
<body>
  <div>
    <button id="showBtn">获取Native输入，以Web弹窗展现</button>
  </div>
</body>
<script>
  let id = 1;
  // 根据id保存callback
  const callbackMap = {};
  // 使用JSSDK封装调用与Native通信的事件，避免过多的污染全局环境
  window.JSSDK = {
    // 获取Native端输入框value，带有回调
    getNativeEditTextValue(callback) {
      const callbackId = id++;
      callbackMap[callbackId] = callback;
      // 调用JSB方法，并将callbackId传入
      window.NativeBridge.getNativeEditTextValue(callbackId);
    },
    // 接收Native端传来的callbackId
    receiveMessage(callbackId, value) {
      if (callbackMap[callbackId]) {
        // 根据ID匹配callback，并执行
        callbackMap[callbackId](value);
      }
    }
  };

	const showBtn = document.querySelector('#showBtn');
  // 绑定按钮事件
  showBtn.addEventListener('click', e => {
    // 通过JSSDK调用，将回调函数传入
    window.JSSDK.getNativeEditTextValue(value => window.alert('Natvie输入值：' + value));
  });
</script>
```

##  总结
- JavaScript 调用 Native 推荐使用 注入 API 的方式
- Native 调用 JavaScript 则直接执行拼接好的 JavaScript 代码即可

