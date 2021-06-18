(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{555:function(s,n,t){"use strict";t.r(n);var e=t(4),a=Object(e.a)({},(function(){var s=this,n=s.$createElement,t=s._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//node原生服务器")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let http = require('http')")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let server = http.createServer((request,response)=>{")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     response.send('ok')")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// })")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// server.listen(3000,(err)=>{")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     if (!err){")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//         console.log('服务器连接成功')")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     } else {")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//         console.log(err)")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     }")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// })")]),s._v("\n\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//express搭建服务器")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let express = require('express')")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let app = express()")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// app.disabled('x-powered-by')")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// app.get('/',(request,response)=>{")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     response.send('ok')")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// })")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// app.listen(3000,function (err) {")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     if (!err){")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//         console.log('服务器启动成功')")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     } else {")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//         console.log(err)")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     }")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// })")]),s._v("\n\n\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//原生Ajax")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//1 实例化一个XMLHttpRequest对象")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let xhr = new XMLHttpRequest()")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//2 给对象绑定监听")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// xhr.onreadystatechange = function () {")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// if(xhr.readyState === 4 && xhr.status >= 200&&xhr.status<=299){")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     console.log(xhr.response)")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// }")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// }")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//3 指定发请求的方式、地址、参数")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v('// xhr.open("GET","http://localhost:3000/ajax_get?name=kobe&age=18&t="+Date.now())')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//加现在的时间是为了解决IE在请求地址不变的情况下默认走强缓存的问题，而Chrome和火狐是尝试协商缓存")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//4 发送请求")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// xhr.send()")]),s._v("\n\n\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//POST请求")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let xhr = new XMLHttpRequest()")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// xhr.onreadystatechange = function(){")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//   if (xhr.readyState ===4 && xhr.status === 200){")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//         console.log(xhr.response)")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//       }")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//    }")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v('// xhr.open("POST","http://localhost:3000/")')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//设置post请求所特有的请求头")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v('// xhr.setRequestHeader("content-type","application/x-www-form-urlencoded")')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//参数在这里写")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v('// xhr.send("name=kobe&age=18")')]),s._v("\n\n\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br"),t("span",{staticClass:"line-number"},[s._v("35")]),t("br"),t("span",{staticClass:"line-number"},[s._v("36")]),t("br"),t("span",{staticClass:"line-number"},[s._v("37")]),t("br"),t("span",{staticClass:"line-number"},[s._v("38")]),t("br"),t("span",{staticClass:"line-number"},[s._v("39")]),t("br"),t("span",{staticClass:"line-number"},[s._v("40")]),t("br"),t("span",{staticClass:"line-number"},[s._v("41")]),t("br"),t("span",{staticClass:"line-number"},[s._v("42")]),t("br"),t("span",{staticClass:"line-number"},[s._v("43")]),t("br"),t("span",{staticClass:"line-number"},[s._v("44")]),t("br"),t("span",{staticClass:"line-number"},[s._v("45")]),t("br"),t("span",{staticClass:"line-number"},[s._v("46")]),t("br"),t("span",{staticClass:"line-number"},[s._v("47")]),t("br"),t("span",{staticClass:"line-number"},[s._v("48")]),t("br"),t("span",{staticClass:"line-number"},[s._v("49")]),t("br"),t("span",{staticClass:"line-number"},[s._v("50")]),t("br"),t("span",{staticClass:"line-number"},[s._v("51")]),t("br"),t("span",{staticClass:"line-number"},[s._v("52")]),t("br"),t("span",{staticClass:"line-number"},[s._v("53")]),t("br"),t("span",{staticClass:"line-number"},[s._v("54")]),t("br"),t("span",{staticClass:"line-number"},[s._v("55")]),t("br"),t("span",{staticClass:"line-number"},[s._v("56")]),t("br"),t("span",{staticClass:"line-number"},[s._v("57")]),t("br"),t("span",{staticClass:"line-number"},[s._v("58")]),t("br"),t("span",{staticClass:"line-number"},[s._v("59")]),t("br"),t("span",{staticClass:"line-number"},[s._v("60")]),t("br"),t("span",{staticClass:"line-number"},[s._v("61")]),t("br"),t("span",{staticClass:"line-number"},[s._v("62")]),t("br"),t("span",{staticClass:"line-number"},[s._v("63")]),t("br"),t("span",{staticClass:"line-number"},[s._v("64")]),t("br"),t("span",{staticClass:"line-number"},[s._v("65")]),t("br"),t("span",{staticClass:"line-number"},[s._v("66")]),t("br")])])])}),[],!1,null,null,null);n.default=a.exports}}]);