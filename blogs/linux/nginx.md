---
title: nginx
date: 2020-10-15
sidebar: 'auto'
categories:
  - linux
---

## nginx 原理（多进程模型）

- 开启 master 主进程，读取并校验配置文件 nginx.conf（不处理业务，协调子进）
- 开启多个子进程（worker）响应请求

## 配置

- worker_processes 默认是 1 表示开启一个业务进程，一般对应 CPU 内核数
- worker_connections 1024; 单个业务进程可接受连接数
- include mime.types 引入 http mime 媒体嗅探类型，可自定义添加
- default_type application/octet-stream 如果 mime 类型没匹配上，默认使用二进制流的方式传输。
- sendfile on; 使用 linux 的 sendfile(socket, file, len) 高效网络传输，也就是数据 0 拷贝。如果不开启 nginx 会先读取文件拷贝到缓存中一份，再响应给用户，开启之后不需要多拷贝一份，直接响应给用户
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

## 虚拟主机

原本一台服务器只能对应一个站点，通过虚拟主机技术可以虚拟化成多个站点同时对外提供服务

- servername 匹配规则
  写在前面的匹配上就不会继续往下匹配了
- 完整匹配
  可以在同一 servername 中匹配多个域名

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

## 实例

- 多用户二级域名
  1.  域名代理商配置泛解析 kobeforever24.cn 到一台服务器上，此服务器 nginx 反向代理转发到业务服务器
  2.  业务服务器取出 xiaoming 在数据库中查找对应信息返回给 nginx
  3.  nginx 响应对应页面
- 短链接 kobeforever24.cn/shalkfklasdjflk
  1.  nginx 反向代理转发到业务服务器
  2.  数据库（key - 真实地址）找出对应真实跳转地址
  3.  redirect
- httpdns
  - 普通 dns 解析使用 UDP 协议，httpdns 走的是 http 协议
  - httpdns 一般适用于 app 或 C/S 架构（在当前软件中预埋几个 ip 地址），不能用于浏览器（浏览器不允许外部加载 ip 使用）
  - 浏览器访问 kobeforever24.cn,首先是 dns 解析，使用 udp 协议
  - 但是 app 或 C/S 架构访问 kobeforever24.cn，httpdns 相当于在预埋 httpdns 服务器 ip 中请求 192.168.1.1/get?name=kobeforever24.cn,此时返回对应 ip(存在数据库、文本文件、内存)

## 反向代理

客户端通过客户端网关请求到 nginx 服务器，nginx 转发到对应业务服务器，反向代理

- nginx 瓶颈，带宽上限不够大的情况下，复杂的 io 操作会有问题
- nginx 是隧道式代理模型，如果业务服务器响应数据非常大（比如视频），那 Nginx 就会有负载的问题，
- lvs 是 DR 模型（通过虚拟伪装 ip 实现），客户端通过 nginx 网关转发，业务服务器直接返回到客户端网关，不通过 nginx
- proxy_pass 和 root 只能写一个
- proxy_pass http://www.kobeforever24.cn; 配置完整域名就不会 302 重定向
- proxy_pass http://kobeforever24.cn; 如果配置不完整域名就会 302 重定向

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

## 负载均衡

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
  - down：表示当前的 server 暂时不参与负载
  - weight：默认为 1.weight 越大，负载的权重就越大。
  - backup： 其它所有的非 backup 机器 down 或者忙的时候，请求 backup 机器。

```
upstream httpds {
  server 127.0.0.1:8050 weight=10 down;
  server 127.0.0.1:8060 weight=1;
  server 127.0.0.1:8060 weight=1 backup;
}
```

- ip_hash
  根据客户端的 ip 地址转发同一台服务器，可以保持回话。

- least_conn
  最少连接访问

- url_hash
  根据用户访问的 url 定向转发请求,比如 kobeforever24.cn/login 和 kobeforever24.cn/home 分别到不同的服务器

- fair
  根据后端服务器响应时间转发请求

## 动静分离

- 静态资源直接存在 Nginx 服务器上，不在转发到业务服务器
- 增加 location

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

- location 匹配顺序
  - 多个正则 location 直接按书写顺序匹配，成功后就不会继续往后面匹配
  - 普通（非正则）location 会一直往下，直到找到匹配度最高的（最大前缀匹配）
  - 当普通 location 与正则 location 同时存在，如果正则匹配成功,则不会再执行普通匹配
  - 所有类型 location 存在时，“=”匹配 > “^~”匹配 > 正则匹配 > 普通（最大前缀匹配）

```
location ~*/(css|img|js) {
  root /usr/local/nginx/static;
}
```

## alias 与 root

root 用来设置根目录，而 alias 在接受请求的时候在路径上不会加上 location。

```
location ~*/(css|img|js) {
  alias /usr/local/nginx/static;
}
```

1.  alias 指定的目录是准确的，即 location 匹配访问的 path 目录下的文件直接是在 alias 目录下查找的；
2.  root 指定的目录是 location 匹配访问的 path 目录的上一级目录,这个 path 目录一定要是真实存在 root 指定目录下的
3.  使用 alias 标签的目录块中不能使用 rewrite 的 break；另外，alias 指定的目录后面必须要加上"/"符号
4.  alias 虚拟目录配置中，location 匹配的 path 目录如果后面不带"/"，那么访问的 url 地址中这个 path 目录后面加不加"/"不影响访问，访问时它会自动加上"/"； 但是如果 location 匹配的 path 目录后面加上"/"，那么访问的 url 地址中这个 path 目录必须要加上"/"，访问时它不会自动加上"/"。如果不加上"/"，访问就会失败
5.  root 目录配置中，location 匹配的 path 目录后面带不带"/"，都不会影响访问。

## UrlRewrite

```
rewrite ^/([0-9]+).html$ /index.jsp?pageNum=$1 break;
```

```js
// rewrite <regex> <replacement> [flag];
// 关键字 正则 替代内容 flag标记
```

- flag 标记说明：
  - last #本条规则匹配完成后，继续向下匹配新的 location URI 规则
  - break #本条规则匹配完成即终止，不再匹配后面的任何规则
  - redirect #返回 302 临时重定向，浏览器地址会显示跳转后的 URL 地址
  - permanent #返回 301 永久重定向，浏览器地址栏会显示跳转后的 URL 地址

## 防火墙配置

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

- 指定端口和 ip 访问

```
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.44.101" port protocol="tcp" port="8080" accept"
```

- 移除规则

```
firewall-cmd --permanent --remove-rich-rule="rule family="ipv4" source address="192.168.44.101" port port="8080" protocol="tcp" accept"
```

## 防盗链配置

第二次请求时，请求头会携带 referer 比如一些静态资源为防止其他网址引用就可开启防盗链

```
valid_referers none | blocked | server_names | strings ....;
```

- none， 检测 Referer 头域不存在的情况。
- blocked，检测 Referer 头域的值被防火墙或者代理服务器删除或伪装的情况。这种情况该头域的值不以“http://” 或 “https://” 开头。
- server_names ，设置一个或多个 URL ，检测 Referer 头域的值是否是这些 URL 中的某一个。
- 配置在需要防盗链的 location 中

```
valid_referers 192.168.44.101;
if ($invalid_referer) {
  return 403;
}
```

## 高可用配置（keepalived）

保持两台 nginx 服务器可以互相切换

- 原理是两太 nginx 服务器配置虚拟 ip，keepalived 其实监测的是 keepalived 是否有问题，监测不到 nginx 服务是否有问题，如果监测有问题，虚拟 ip 在两台服务器上互相切换，更好的方法是用脚本监测 nginx 监测 nginx 费否有问题，如果 Nginx 挂了，直接 kill keepalived 的进程，这样起到真正监测 nginx 的目的
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

## 配置 https

- 百度云申请免费证书 TrustAsia 域名型 DV 单域名测试版
- 审核通过后 - 查看证书 - 下载证书（PEM 格式）
- scp -r /Users/hexiaolong/Desktop/kobeforever24.cn.key root@47.93.125.189:/etc/pki/nginx
- 登录服务器 ssh root@47.93.125.189
- 查看 nginx 默认配置 /etc/nginx/nginx.conf
- 替换 SSL 证书
  - ssl_certificate_key "/etc/pki/nginx/private/kobeforever24.cn.key";
  - ssl_certificate "/etc/pki/nginx/kobeforever24.cn.cer";（注意有可能是.crt 文件）
- nginx -s reload
