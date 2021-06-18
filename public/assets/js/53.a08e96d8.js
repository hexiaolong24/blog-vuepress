(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{554:function(t,e,v){"use strict";v.r(e);var s=v(4),_=Object(s.a)({},(function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("h2",{attrs:{id:"是什么"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#是什么"}},[t._v("#")]),t._v(" 是什么")]),t._v(" "),v("p",[t._v("超文本传输协议（属于应用层协议）")]),t._v(" "),v("h2",{attrs:{id:"特点"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#特点"}},[t._v("#")]),t._v(" 特点")]),t._v(" "),v("p",[t._v("无状态，现在cookie解决了无状态的问题（早期网页开发时，用cookie解决，现在是cookie和session配合使用）")]),t._v(" "),v("h2",{attrs:{id:"作用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#作用"}},[t._v("#")]),t._v(" 作用")]),t._v(" "),v("p",[t._v("规定了服务器和客户端传递信息的规则（统称为报文，分为：请求报文、响应报文。）")]),t._v(" "),v("h2",{attrs:{id:"状态码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#状态码"}},[t._v("#")]),t._v(" 状态码")]),t._v(" "),v("ul",[v("li",[t._v("1xx : 服务器已经收到了本次请求，但是还需要进一步的处理才可以。")]),t._v(" "),v("li",[t._v("2xx : 服务器已经收到了本次请求，且已经分析、处理等........最终处理完毕！")]),t._v(" "),v("li",[t._v("3xx : 服务器已经接收到了请求，还需要其他的资源，或者重定向到其他位置，甚至交给其他服务器处理。")]),t._v(" "),v("li",[t._v("4xx ：一般指请求的参数或者地址有错误， 出现了服务器无法理解的请求（一般是前端的锅）。")]),t._v(" "),v("li",[t._v("5xx ：服务器内部错误（不是因为请求地址或者请求参数不当造成的），无法响应用户请求（一般是后端人员的锅）。")])]),t._v(" "),v("table",[v("thead",[v("tr",[v("th",[t._v("状态码")]),t._v(" "),v("th",{staticStyle:{"text-align":"center"}},[t._v("含义")])])]),t._v(" "),v("tbody",[v("tr",[v("td",[t._v("200")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("成功（最理想状态）")])]),t._v(" "),v("tr",[v("td",[t._v("204")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("（无内容）服务器成功处理了请求，但没有返回任何内容。")])]),t._v(" "),v("tr",[v("td",[t._v("301")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("重定向，被请求的旧资源永久移除了（不可以访问了），将会跳转到一个新资源，搜索引擎在抓取新内容的同时也将旧的网址替换为重定向之后的网址；")])]),t._v(" "),v("tr",[v("td",[t._v("302")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("重定向，被请求的旧资源还在（仍然可以访问），但会临时跳转到一个新资源，搜索引擎会抓取新的内容而保存旧的网址。")])]),t._v(" "),v("tr",[v("td",[t._v("304")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("请求资源重定向到缓存中（命中了协商缓存）。")])]),t._v(" "),v("tr",[v("td",[t._v("400")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("（错误请求）服务器不理解请求的语法")])]),t._v(" "),v("tr",[v("td",[t._v("401")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("（未授权） 请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应")])]),t._v(" "),v("tr",[v("td",[t._v("403")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("（禁止） 服务器拒绝请求")])]),t._v(" "),v("tr",[v("td",[t._v("404")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("资源未找到，一般是客户端请求了不存在的资源。")])]),t._v(" "),v("tr",[v("td",[t._v("405")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("（方法禁用） 禁用请求中指定的方法")])]),t._v(" "),v("tr",[v("td",[t._v("500")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("服务器收到了请求，但是服务器内部产生了错误。")])]),t._v(" "),v("tr",[v("td",[t._v("502")]),t._v(" "),v("td",{staticStyle:{"text-align":"center"}},[t._v("连接服务器失败（服务器在处理一个请求的时候，或许需要其他的服务器配合，但是联系不上其他的服务器了）。")])])])]),t._v(" "),v("h2",{attrs:{id:"http-0-9"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http-0-9"}},[t._v("#")]),t._v(" http/0.9")]),t._v(" "),v("p",[t._v("HTTP 是基于 TCP/IP 协议的应用层协议。它不涉及数据包（packet）传输，主要规定了客户端和服务器之间的通信格式，默认使用80端口。\n最早版本是1991年发布的0.9版。该版本极其简单，只有一个命令GET。")]),t._v(" "),v("div",{staticClass:"language-js line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-js"}},[v("code",[v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 协议规定，服务器只能回应HTML格式的字符串，不能回应别的格式")]),t._v("\n"),v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// GET /index.html")]),t._v("\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br"),v("span",{staticClass:"line-number"},[t._v("2")]),v("br")])]),v("h2",{attrs:{id:"http-1-0"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http-1-0"}},[t._v("#")]),t._v(" http/1.0")]),t._v(" "),v("ul",[v("li",[v("p",[t._v("1996年5月，HTTP/1.0 版本发布，内容大大增加。")])]),t._v(" "),v("li",[v("p",[t._v("首先，任何格式的内容都可以发送。这使得互联网不仅可以传输文字，还能传输图像、视频、二进制文件。这为互联网的大发展奠定了基础。")])]),t._v(" "),v("li",[v("p",[t._v("其次，除了GET命令，还引入了POST命令和HEAD命令，丰富了浏览器与服务器的互动手段。")])]),t._v(" "),v("li",[v("p",[t._v("再次，HTTP请求和回应的格式也变了。除了数据部分，每次通信都必须包括头信息（HTTP header），用来描述一些元数据。")])]),t._v(" "),v("li",[v("p",[t._v("其他的新增功能还包括状态码（status code）、多字符集支持、多部分发送（multi-part type）、权限（authorization）、缓存（cache）、内容编码（content encoding）等。")])]),t._v(" "),v("li",[v("p",[t._v("缺点\nHTTP/1.0 版的主要缺点是，每个TCP连接只能发送一个请求。发送数据完毕，连接就关闭，如果还要请求其他资源，就必须再新建一个连接。")])])]),t._v(" "),v("p",[t._v("TCP连接的新建成本很高，因为需要客户端和服务器三次握手，并且开始时发送速率较慢（slow start）。所以，HTTP 1.0版本的性能比较差。随着网页加载的外部资源越来越多，这个问题就愈发突出了。")]),t._v(" "),v("p",[t._v("为了解决这个问题，有些浏览器在请求时，用了一个非标准的Connection字段。")]),t._v(" "),v("div",{staticClass:"language-js line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-js"}},[v("code",[v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Connection: keep-alive")]),t._v("\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br")])]),v("p",[t._v("这个字段要求服务器不要关闭TCP连接，以便其他请求复用。服务器同样回应这个字段。")]),t._v(" "),v("p",[t._v("一个可以复用的TCP连接就建立了，直到客户端或服务器主动关闭连接。但是，这不是标准字段，不同实现的行为可能不一致，因此不是根本的解决办法。")]),t._v(" "),v("h2",{attrs:{id:"http-1-1"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http-1-1"}},[t._v("#")]),t._v(" http/1.1")]),t._v(" "),v("p",[t._v("1997年1月，HTTP/1.1 版本发布，只比 1.0 版本晚了半年。它进一步完善了 HTTP 协议，一直用到了20年后的今天，直到现在还是最流行的版本。")]),t._v(" "),v("ol",[v("li",[t._v("持久连接\n1.1 版的最大变化，就是引入了持久连接（persistent connection），即TCP连接默认不关闭，可以被多个请求复用，不用声明Connection: keep-alive。")])]),t._v(" "),v("p",[t._v("客户端和服务器发现对方一段时间没有活动，就可以主动关闭连接。不过，规范的做法是，客户端在最后一个请求时，发送Connection: close，明确要求服务器关闭TCP连接。")]),t._v(" "),v("div",{staticClass:"language-js line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-js"}},[v("code",[v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Connection: close")]),t._v("\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br")])]),v("p",[t._v("目前，对于同一个域名，大多数浏览器允许同时建立6个持久连接。")]),t._v(" "),v("ol",{attrs:{start:"2"}},[v("li",[t._v("管道机制\n1.1 版还引入了管道机制（pipelining），即在同一个TCP连接里面，客户端可以同时发送多个请求。这样就进一步改进了HTTP协议的效率。")])]),t._v(" "),v("p",[t._v("举例来说，客户端需要请求两个资源。以前的做法是，在同一个TCP连接里面，先发送A请求，然后等待服务器做出回应，收到后再发出B请求。管道机制则是允许浏览器同时发出A请求和B请求，但是服务器还是按照顺序，先回应A请求，完成后再回应B请求。")]),t._v(" "),v("ol",{attrs:{start:"3"}},[v("li",[t._v("Content-Length 字段\n一个TCP连接现在可以传送多个回应，势必就要有一种机制，区分数据包是属于哪一个回应的。这就是Content-length字段的作用，声明本次回应的数据长度。")])]),t._v(" "),v("div",{staticClass:"language-js line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-js"}},[v("code",[v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Content-Length: 3495")]),t._v("\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br")])]),v("p",[t._v("上面代码告诉浏览器，本次回应的长度是3495个字节，后面的字节就属于下一个回应了。")]),t._v(" "),v("p",[t._v("在1.0版中，Content-Length字段不是必需的，因为浏览器发现服务器关闭了TCP连接，就表明收到的数据包已经全了")]),t._v(" "),v("ol",{attrs:{start:"4"}},[v("li",[t._v("分块传输编码\n使用Content-Length字段的前提条件是，服务器发送回应之前，必须知道回应的数据长度。")])]),t._v(" "),v("p",[t._v('对于一些很耗时的动态操作来说，这意味着，服务器要等到所有操作完成，才能发送数据，显然这样的效率不高。更好的处理方法是，产生一块数据，就发送一块，采用"流模式"（stream）取代"缓存模式"（buffer）。')]),t._v(" "),v("p",[t._v('因此，1.1版规定可以不使用Content-Length字段，而使用"分块传输编码"（chunked transfer encoding）。只要请求或回应的头信息有Transfer-Encoding字段，就表明回应将由数量未定的数据块组成。')]),t._v(" "),v("div",{staticClass:"language-js line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-js"}},[v("code",[v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Transfer-Encoding: chunked")]),t._v("\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br")])]),v("p",[t._v("每个非空的数据块之前，会有一个16进制的数值，表示这个块的长度。最后是一个大小为0的块，就表示本次回应的数据发送完了")]),t._v(" "),v("ol",{attrs:{start:"5"}},[v("li",[t._v("其他功能\n1.1版还新增了许多动词方法：PUT、PATCH、HEAD、 OPTIONS、DELETE。")])]),t._v(" "),v("p",[t._v("另外，客户端请求的头信息新增了Host字段，用来指定服务器的域名。\n有了Host字段，就可以将请求发往同一台服务器上的不同网站，为虚拟主机的兴起打下了基础。")]),t._v(" "),v("ol",{attrs:{start:"6"}},[v("li",[t._v('缺点\n虽然1.1版允许复用TCP连接，但是同一个TCP连接里面，所有的数据通信是按次序进行的。服务器只有处理完一个回应，才会进行下一个回应。要是前面的回应特别慢，后面就会有许多请求排队等着。这称为"队头堵塞"（Head-of-line blocking）。')])]),t._v(" "),v("p",[t._v("为了避免这个问题，只有两种方法：一是减少请求数，二是同时多开持久连接。这导致了很多的网页优化技巧，比如合并脚本和样式表、将图片嵌入CSS代码、域名分片（domain sharding）等等。如果HTTP协议设计得更好一些，这些额外的工作是可以避免的。")]),t._v(" "),v("h2",{attrs:{id:"spdy-协议"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#spdy-协议"}},[t._v("#")]),t._v(" SPDY 协议")]),t._v(" "),v("p",[t._v("2009年，谷歌公开了自行研发的 SPDY 协议，主要解决 HTTP/1.1 效率不高的问题。")]),t._v(" "),v("p",[t._v("这个协议在Chrome浏览器上证明可行以后，就被当作 HTTP/2 的基础，主要特性都在 HTTP/2 之中得到继承。")]),t._v(" "),v("h2",{attrs:{id:"http-2"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#http-2"}},[t._v("#")]),t._v(" HTTP/2")]),t._v(" "),v("p",[t._v("2015年，HTTP/2 发布。它不叫 HTTP/2.0，是因为标准委员会不打算再发布子版本了，下一个新版本将是 HTTP/3。")]),t._v(" "),v("ol",[v("li",[t._v('二进制协议\nHTTP/1.1 版的头信息肯定是文本（ASCII编码），数据体可以是文本，也可以是二进制。HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制，并且统称为"帧"（frame）：头信息帧和数据帧。')])]),t._v(" "),v("p",[t._v("二进制协议的一个好处是，可以定义额外的帧。HTTP/2 定义了近十种帧，为将来的高级应用打好了基础。如果使用文本实现这种功能，解析数据将会变得非常麻烦，二进制解析则方便得多。")]),t._v(" "),v("ol",{attrs:{start:"2"}},[v("li",[t._v("多工")])]),t._v(" "),v("p",[t._v('HTTP/2 复用TCP连接，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了"队头堵塞"。')]),t._v(" "),v("p",[t._v("举例来说，在一个TCP连接里面，服务器同时收到了A请求和B请求，于是先回应A请求，结果发现处理过程非常耗时，于是就发送A请求已经处理好的部分， 接着回应B请求，完成后，再发送A请求剩下的部分。")]),t._v(" "),v("p",[t._v("这样双向的、实时的通信，就叫做多工（Multiplexing）。")]),t._v(" "),v("ol",{attrs:{start:"3"}},[v("li",[t._v("数据流")])]),t._v(" "),v("p",[t._v("因为 HTTP/2 的数据包是不按顺序发送的，同一个连接里面连续的数据包，可能属于不同的回应。因此，必须要对数据包做标记，指出它属于哪个回应。")]),t._v(" "),v("p",[t._v("HTTP/2 将每个请求或回应的所有数据包，称为一个数据流（stream）。每个数据流都有一个独一无二的编号。数据包发送的时候，都必须标记数据流ID，用来区分它属于哪个数据流。另外还规定，客户端发出的数据流，ID一律为奇数，服务器发出的，ID为偶数。")]),t._v(" "),v("p",[t._v("数据流发送到一半的时候，客户端和服务器都可以发送信号（RST_STREAM帧），取消这个数据流。1.1版取消数据流的唯一方法，就是关闭TCP连接。这就是说，HTTP/2 可以取消某一次请求，同时保证TCP连接还打开着，可以被其他请求使用。")]),t._v(" "),v("p",[t._v("客户端还可以指定数据流的优先级。优先级越高，服务器就会越早回应。")]),t._v(" "),v("ol",{attrs:{start:"4"}},[v("li",[t._v("头信息压缩")])]),t._v(" "),v("p",[t._v("HTTP 协议不带有状态，每次请求都必须附上所有信息。所以，请求的很多字段都是重复的，比如Cookie和User Agent，一模一样的内容，每次请求都必须附带，这会浪费很多带宽，也影响速度。")]),t._v(" "),v("p",[t._v("HTTP/2 对这一点做了优化，引入了头信息压缩机制（header compression）。一方面，头信息使用gzip或compress压缩后再发送；另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送同样字段了，只发送索引号，这样就提高速度了。")]),t._v(" "),v("ol",{attrs:{start:"5"}},[v("li",[t._v("服务器推送")])]),t._v(" "),v("p",[t._v("HTTP/2 允许服务器未经请求，主动向客户端发送资源，这叫做服务器推送（server push）。")]),t._v(" "),v("p",[t._v("常见场景是客户端请求一个网页，这个网页里面包含很多静态资源。正常情况下，客户端必须收到网页后，解析HTML源码，发现有静态资源，再发出静态资源请求。其实，服务器可以预期到客户端请求网页后，很可能会再请求静态资源，所以就主动把这些静态资源随着网页一起发给客户端了。")]),t._v(" "),v("h2",{attrs:{id:"ssl延迟"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ssl延迟"}},[t._v("#")]),t._v(" ssl延迟")]),t._v(" "),v("p",[t._v("客户端首先发送SYN数据包，然后服务器发送SYN+ACK数据包，最后客户端发送ACK数据包，接下来就可以发送内容了。这三个数据包的发送过程，叫做TCP握手。")]),t._v(" "),v("p",[t._v("再来看HTTPs链接，它也采用TCP协议发送数据，所以它也需要上面的这三步握手过程。而且，在这三步结束以后，它还有一个SSL握手。")]),t._v(" "),v("p",[t._v("HTTP耗时 = TCP握手")]),t._v(" "),v("p",[t._v("HTTPs耗时 = TCP握手 + SSL握手")]),t._v(" "),v("p",[t._v("命令行工具curl有一个w参数，可以用来测量TCP握手和SSL握手的具体耗时，以访问支付宝为例。")]),t._v(" "),v("div",{staticClass:"language-js line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-js"}},[v("code",[v("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// $ curl -w "TCP handshake: %{time_connect}, SSL handshake: %{time_appconnect}\\n" -so /dev/null https://www.alipay.com')]),t._v("\n\n"),v("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// TCP handshake: 0.022, SSL handshake: 0.064")]),t._v("\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br"),v("span",{staticClass:"line-number"},[t._v("2")]),v("br"),v("span",{staticClass:"line-number"},[t._v("3")]),v("br")])]),v("p",[t._v("从运行结果可以看到，SSL握手的耗时（64毫秒）大概是TCP握手（22毫秒）的三倍。也就是说，在建立连接的阶段，HTTPs链接比HTTP链接要长3倍的时间，具体数字取决于CPU的快慢和网络状况。")]),t._v(" "),v("h2",{attrs:{id:"ssl-tls协议运行机制的概述"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ssl-tls协议运行机制的概述"}},[t._v("#")]),t._v(" SSL/TLS协议运行机制的概述")]),t._v(" "),v("ol",[v("li",[t._v("作用")])]),t._v(" "),v("ul",[v("li",[t._v("不使用SSL/TLS的HTTP通信，就是不加密的通信。所有信息明文传播，带来了三大风险。")])]),t._v(" "),v("p",[t._v("（1） 窃听风险（eavesdropping）：第三方可以获知通信内容。")]),t._v(" "),v("p",[t._v("（2） 篡改风险（tampering）：第三方可以修改通信内容。")]),t._v(" "),v("p",[t._v("（3） 冒充风险（pretending）：第三方可以冒充他人身份参与通信。")]),t._v(" "),v("ul",[v("li",[t._v("希望达到")])]),t._v(" "),v("p",[t._v("（1） 所有信息都是加密传播，第三方无法窃听。")]),t._v(" "),v("p",[t._v("（2） 具有校验机制，一旦被篡改，通信双方会立刻发现。")]),t._v(" "),v("p",[t._v("（3） 配备身份证书，防止身份被冒充。")]),t._v(" "),v("ol",{attrs:{start:"2"}},[v("li",[t._v("历史\n1994年，NetScape公司设计了SSL协议（Secure Sockets Layer）的1.0版，但是未发布。")])]),t._v(" "),v("p",[t._v("1995年，NetScape公司发布SSL 2.0版，很快发现有严重漏洞。")]),t._v(" "),v("p",[t._v("1996年，SSL 3.0版问世，得到大规模应用。")]),t._v(" "),v("p",[t._v("1999年，互联网标准化组织ISOC接替NetScape公司，发布了SSL的升级版TLS 1.0版。")]),t._v(" "),v("p",[t._v("2006年和2008年，TLS进行了两次升级，分别为TLS 1.1版和TLS 1.2版。最新的变动是2011年TLS 1.2的修订版。")]),t._v(" "),v("p",[t._v("目前，应用最广泛的是TLS 1.0，接下来是SSL 3.0。但是，主流浏览器都已经实现了TLS 1.2的支持。")]),t._v(" "),v("p",[t._v("TLS 1.0通常被标示为SSL 3.1，TLS 1.1为SSL 3.2，TLS 1.2为SSL 3.3。")]),t._v(" "),v("ol",{attrs:{start:"3"}},[v("li",[t._v("SSL协议的握手过程")])]),t._v(" "),v("p",[t._v("第一步，客户端给出协议版本号、一个客户端生成的随机数（Client random），以及客户端支持的加密方法。")]),t._v(" "),v("p",[t._v("第二步，服务端确认双方使用的加密方法，并给出数字证书、以及一个服务器生成的随机数（Server random）。")]),t._v(" "),v("p",[t._v("第三步，客户端确认数字证书有效，然后生成一个新的随机数（Premaster secret），并使用数字证书中的公钥，加密这个随机数，发给服务端。")]),t._v(" "),v("p",[t._v("第四步，服务端使用自己的私钥，获取客户端发来的随机数（即Premaster secret）。")]),t._v(" "),v("p",[t._v('第五步，客户端和服务端根据约定的加密方法，使用前面的三个随机数，生成"对话密钥"（session key），用来加密接下来的整个对话过程。')]),t._v(" "),v("ol",{attrs:{start:"4"}},[v("li",[t._v("私钥的作用")])]),t._v(" "),v("p",[t._v("握手阶段有三点需要注意。")]),t._v(" "),v("p",[t._v("（1）生成对话密钥一共需要三个随机数。")]),t._v(" "),v("p",[t._v('（2）握手之后的对话使用"对话密钥"加密（对称加密），服务器的公钥和私钥只用于加密和解密"对话密钥"（非对称加密），无其他作用。')]),t._v(" "),v("p",[t._v("（3）服务器公钥放在服务器的数字证书之中。")]),t._v(" "),v("ol",{attrs:{start:"5"}},[v("li",[t._v("DH算法的握手阶段")])]),t._v(" "),v("p",[t._v("整个握手阶段都不加密（也没法加密），都是明文的。因此，如果有人窃听通信，他可以知道双方选择的加密方法，以及三个随机数中的两个。整个通话的安全，只取决于第三个随机数（Premaster secret）能不能被破解。")]),t._v(" "),v("p",[t._v("虽然理论上，只要服务器的公钥足够长（比如2048位），那么Premaster secret可以保证不被破解。但是为了足够安全，我们可以考虑把握手阶段的算法从默认的RSA算法，改为 Diffie-Hellman算法（简称DH算法）。")]),t._v(" "),v("p",[t._v("采用DH算法后，Premaster secret不需要传递，双方只要交换各自的参数，就可以算出这个随机数。")]),t._v(" "),v("p",[t._v("第三步和第四步由传递Premaster secret变成了传递DH算法所需的参数，然后双方各自算出Premaster secret。这样就提高了安全性。")])])}),[],!1,null,null,null);e.default=_.exports}}]);