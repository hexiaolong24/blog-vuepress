---
title: nginx
date: 2020-10-15
sidebar: 'auto'
categories:
 - linux
---

##  nginx原理（多进程模型）
- 开启master主进程，读取并校验配置文件nginx.conf（不处理业务，协调子进）
- 开启多个子进程（worker）响应请求

##  配置
- worker_processes 默认是1 表示开启一个业务进程，一般对应CPU内核数
- worker_connections 1024; 单个业务进程可接受连接数
- include mime.types 引入http mime媒体嗅探类型，可自定义添加
- default_type application/octet-stream 如果mime类型没匹配上，默认使用二进制流的方式传输。
- sendfile on; 使用linux的 sendfile(socket, file, len) 高效网络传输，也就是数据0拷贝。如果不开启nginx会先读取文件拷贝到缓存中一份，再响应给用户，开启之后不需要多拷贝一份，直接响应给用户
- keepalive_timeout 65;长链接超时时间
- 虚拟主机配置
```
server {
  listen 80; 监听端口号 
  server_name localhost; 主机名 
  # www.baidu.com/aaa url
  # /aaa uri
  location / { 匹配uri 
    root html; 文件根目录(相对路径，从usr/local/nginx/html 开始查找) 
    index index.html index.htm; 默认页名称 
  }
  error_page 500 502 503 504 /50x.html; 报错编码对应页面 
  location = /50x.html { 
    root html; 
  } 
}
```

##  虚拟主机
原本一台服务器只能对应一个站点，通过虚拟主机技术可以虚拟化成多个站点同时对外提供服务
- servername匹配规则
写在前面的匹配上就不会继续往下匹配了
- 完整匹配
可以在同一servername中匹配多个域名
```
server_name www.kobeforever24.cn aaa.kobeforever24.cn;
```
- 泛域名解析，通配符匹配
```
server_name *.kobeforever24.cn
```
- 通配符结束匹配
```
server_name kobeforever24.*;
```
- 正则匹配
```
server_name ~^[0-9]+\.kobeforever24\.cn$;
```

##  实例
- 多用户二级域名
  1.  域名代理商配置泛解析kobeforever24.cn到一台服务器上，此服务器nginx反向代理转发到业务服务器
  2.  业务服务器取出xiaoming在数据库中查找对应信息返回给nginx
  3.  nginx响应对应页面
- 短链接 kobeforever24.cn/shalkfklasdjflk
  1.  nginx反向代理转发到业务服务器
  2.  数据库（key - 真实地址）找出对应真实跳转地址
  3.  redirect
- httpdns
  - 普通dns解析使用UDP协议，httpdns走的是http协议
  - httpdns一般适用于app或C/S架构（在当前软件中预埋几个ip地址），不能用于浏览器（浏览器不允许外部加载ip使用）
  - 浏览器访问kobeforever24.cn,首先是dns解析，使用udp协议
  - 但是app或C/S架构访问kobeforever24.cn，httpdns相当于在预埋httpdns服务器ip中请求192.168.1.1/get?name=kobeforever24.cn,此时返回对应ip(存在数据库、文本文件、内存)

##  反向代理
客户端通过客户端网关请求到nginx服务器，nginx转发到对应业务服务器，反向代理
- nginx瓶颈，带宽上限不够大的情况下，复杂的io操作会有问题
- nginx是隧道式代理模型，如果业务服务器响应数据非常大（比如视频），那Nginx就会有负载的问题，
- lvs是DR模型（通过虚拟伪装ip实现），客户端通过nginx网关转发，业务服务器直接返回到客户端网关，不通过nginx
- proxy_pass 和root 只能写一个
- proxy_pass http://www.kobeforever24.cn; 配置完整域名就不会302重定向
- proxy_pass http://kobeforever24.cn; 如果配置不完整域名就会302重定向
```
server {
  listen 80; 监听端口号 
  server_name localhost; 主机名 
  # www.baidu.com/aaa url
  # /aaa uri
  location / { 匹配uri 
    proxy_pass http://www.kobeforever24.cn;
  }
  error_page 500 502 503 504 /50x.html; 报错编码对应页面 
  location = /50x.html { 
    root html; 
  } 
}
```

##  负载均衡
### 基本配置
```
upstream httpds { 
  server 192.168.44.102; 
  server 192.168.43.103; 
}

server {
  listen 80; 监听端口号 
  server_name localhost; 主机名 
  # www.baidu.com/aaa url
  # /aaa uri
  location / { 匹配uri 
    proxy_pass http://httpds;
  }
  error_page 500 502 503 504 /50x.html; 报错编码对应页面 
  location = /50x.html { 
    root html; 
  } 
}
```

### 策略
- 轮询
默认情况下使用轮询方式，逐一转发，这种方式适用于无状态请求。

- weight(权重)
  - down：表示当前的server暂时不参与负载
  - weight：默认为1.weight越大，负载的权重就越大。
  - backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。
```
upstream httpds { 
  server 127.0.0.1:8050 weight=10 down; 
  server 127.0.0.1:8060 weight=1; 
  server 127.0.0.1:8060 weight=1 backup; 
}
```

- ip_hash
根据客户端的ip地址转发同一台服务器，可以保持回话。

- least_conn
最少连接访问

- url_hash
根据用户访问的url定向转发请求,比如kobeforever24.cn/login 和 kobeforever24.cn/home 分别到不同的服务器

- fair
根据后端服务器响应时间转发请求

##  动静分离
- 静态资源直接存在Nginx服务器上，不在转发到业务服务器
- 增加location
```
location /css { 
  root /usr/local/nginx/static; 
  index index.html index.htm; 
} 
location /images { 
  root /usr/local/nginx/static; 
  index index.html index.htm; 
} 
location /js { 
  root /usr/local/nginx/static; 
  index index.html index.htm; 
}
```
- location匹配顺序
  - 多个正则location直接按书写顺序匹配，成功后就不会继续往后面匹配
  - 普通（非正则）location会一直往下，直到找到匹配度最高的（最大前缀匹配）
  - 当普通location与正则location同时存在，如果正则匹配成功,则不会再执行普通匹配
  - 所有类型location存在时，“=”匹配 > “^~”匹配 > 正则匹配 > 普通（最大前缀匹配）
```
location ~*/(css|img|js) {
  root /usr/local/nginx/static; 
}
```
## alias与root
root用来设置根目录，而alias在接受请求的时候在路径上不会加上location。
```
location ~*/(css|img|js) {
  alias /usr/local/nginx/static; 
}
```
1.  alias指定的目录是准确的，即location匹配访问的path目录下的文件直接是在alias目录下查找的； 
2.  root指定的目录是location匹配访问的path目录的上一级目录,这个path目录一定要是真实存在root指定目录下的
3.  使用alias标签的目录块中不能使用rewrite的break；另外，alias指定的目录后面必须要加上"/"符号
4.  alias虚拟目录配置中，location匹配的path目录如果后面不带"/"，那么访问的url地址中这个path目录后面加不加"/"不影响访问，访问时它会自动加上"/"； 但是如果location匹配的path目录后面加上"/"，那么访问的url地址中这个path目录必须要加上"/"，访问时它不会自动加上"/"。如果不加上"/"，访问就会失败
5.  root目录配置中，location匹配的path目录后面带不带"/"，都不会影响访问。

##  UrlRewrite
```
rewrite ^/([0-9]+).html$ /index.jsp?pageNum=$1 break;
```
```js
// rewrite <regex> <replacement> [flag]; 
// 关键字 正则 替代内容 flag标记
```
- flag标记说明： 
  - last #本条规则匹配完成后，继续向下匹配新的location URI规则 
  - break #本条规则匹配完成即终止，不再匹配后面的任何规则 
  - redirect #返回302临时重定向，浏览器地址会显示跳转后的URL地址 
  - permanent #返回301永久重定向，浏览器地址栏会显示跳转后的URL地址

##  防火墙配置
- 开启防火墙
```
systemctl start firewalld
```
- 重启防火墙
```
systemctl restart firewalld
```
- 重载规则
```
firewall-cmd --reload
```
- 查看已配置规则
```
firewall-cmd --list-all
```
- 指定端口和ip访问
```
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.44.101" port protocol="tcp" port="8080" accept"
```
- 移除规则
```
firewall-cmd --permanent --remove-rich-rule="rule family="ipv4" source address="192.168.44.101" port port="8080" protocol="tcp" accept"
```

##  防盗链配置
第二次请求时，请求头会携带referer 比如一些静态资源为防止其他网址引用就可开启防盗链
```
valid_referers none | blocked | server_names | strings ....;
```
- none， 检测 Referer 头域不存在的情况。
- blocked，检测 Referer 头域的值被防火墙或者代理服务器删除或伪装的情况。这种情况该头域的值不以“http://” 或 “https://” 开头。
- server_names ，设置一个或多个 URL ，检测 Referer 头域的值是否是这些 URL 中的某一个。
- 配置在需要防盗链的location中
```
valid_referers 192.168.44.101; 
if ($invalid_referer) { 
  return 403; 
}
```

##  高可用配置（keepalived）
保持两台nginx服务器可以互相切换
- 原理是两太nginx服务器配置虚拟ip，keepalived其实监测的是keepalived是否有问题，监测不到nginx服务是否有问题，如果监测有问题，虚拟ip在两台服务器上互相切换，更好的方法是用脚本监测nginx监测nginx费否有问题，如果Nginx挂了，直接kill keepalived的进程，这样起到真正监测nginx的目的
- 安装
```
yum install keepalived
```
- 配置
```
! Configuration File for keepalived 
global_defs { 
  router_id lb110 
}
vrrp_instance atguigu { 
  state BACKUP 
  interface ens33 
  virtual_router_id 51 
  priority 50 
  advert_int 1 
  authentication { 
    auth_type PASS 
    auth_pass 1111 
  }
  virtual_ipaddress { 
    192.168.44.200 
  } 
}
```
- 启动服务
```
systemctl start keepalived
```






