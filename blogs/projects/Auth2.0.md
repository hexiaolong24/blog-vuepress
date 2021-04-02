---
title: Auth2.0
date: 2019-10-12
sidebar: 'auto'
categories:
 - projects
isShowComments: false
---

##  四种方式

- 授权码（authorization-code）
- 隐藏式（implicit）
- 密码式（password）：
- 客户端凭证（client credentials）

不管哪一种授权方式，第三方应用申请令牌之前，都必须先到系统备案，说明自己的身份，然后会拿到两个身份识别码：客户端 ID（client ID）和客户端密钥（client secret）。这是为了防止令牌被滥用，没有备案过的第三方应用，是不会拿到令牌的。

##  授权码（authorization code）

授权码指的是第三方应用先申请一个授权码，然后再用该码获取令牌。

这种方式是最常用的流程，安全性也最高，它适用于那些有后端的 Web 应用。授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏。

- 第一步，A 网站提供一个链接，用户点击后就会跳转到 B 网站，授权用户数据给 A 网站使用。下面就是 A 网站跳转 B 网站的一个示意链接。

```js
/**
 * client_id 客户端id
 * redirect_uri 回跳地址
 * response_type code固定值
 * state 子系统自定义，回调时完整带回
 * 
*/
url = /oauth/authorize/?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&&response_type=code&state=’STATE’
 ```

 -  第二步，用户跳转后，B 网站会要求用户登录，然后询问是否同意给予 A 网站授权。用户表示同意，这时 B 网站就会跳回redirect_uri参数指定的网址。跳转时，会传回一个授权码，就像下面这样。

 ```js
 https://a.com/callback?code=AUTHORIZATION_CODE
 ```

 -  第三步，A 网站拿到授权码以后，就可以在后端，向 B 网站请求令牌。

 ```js
"client_id": "CLIENT_ID",
"client_secret": "CLIENT_SECRET",
"grant_type": "authorization_code",
"code": "xxxxxx",
"redirect_uri": "redirect_uri"
/**
 * client_id 客户端id
 * client_secret 客户端秘钥
 * redirect_uri 回跳地址
 * grant_type authorization_code固定值
 * code code第二步返回的code
 * redirect_uri 验证使用
*/
```

- 第四步，返回access_token

##  旧版本

- 步骤

1.  每新开一个后台系统，该系统域名就要去sso注册登记，申请client_id和client_secert，client_id保存在前端，client_secert保存在后端
2.  每次登陆的时候，前端用client_id去sso换回code
3.  再将code发送给后端，后端用client_id和client_secert code去sso换回token，接着用token换取userInfo，因为sso返回的token有效期很短，只适用于马上获得用户信息，然后用jwt生成新的user_token返回给前端，设置有效期
4.  之后前端将user_token放在header中的authorization字段中，用于后续通信

- 缺点

1.  每新增一个后台就要申请client_id client_secert 
2.  重复上述步骤，完成前端、sso、后端交互
3.  重写前端登录页面

##  新版本

- 步骤

1.  封装前端登录组件，点击登录，调用node服务接口信息，传参redirect_uri（真正的回跳地址，ac服务的地址其实是中转地址）

2.  搭建node服务ac.igetcool.com,申请注册ac.igetcool.com的client_id和client_secert,都保存在node端，前端不再关心client_id

3.  node服务记录子系统传来的redirect_uri，从sso换取code，因为换取code的时候redirect_uri只能是注册client_id时的域名，所以为了解决多个系统对应多套id的问题直接回传ac.igetcool.com/api/code

```js
public async login() {
  const { ctx, config} = this;
  let uri:string = ctx.query.refererUrl;
  if(!uri) {
    uri = ctx.request.header.referer;
  }
  const logUrl = ctx.lofInfo(`refererUrl ----> ${uri}`, BASE + 10);
  ctx.logger.info(logUrl);
  const refererUrl = encodeURIComponent(uri);
  ctx.redirect(`${config.ADHOST}/oauth/authorize?client_id=${config.SSO.CLIENT_ID}&redirect_uri=${config.SSO.REDIRECT_URL}&response_type=code&state=${refererUrl}`);
  const msg = ctx.lofInfo('跳转sso成功', BASE + 14);
  ctx.logger.info(msg);
}
```
4.  正常情况下应该是返回前端路由，前端判断如果url中有code，则自动调后端token接口获得最终的用户token，但是现在返回的是node服务，路由对应前端是页面，对于后端来说就是一个接口，所以，node层的api/code接口的作用就是返回到前端页面，继续模拟之前的逻辑，只是做了一层转发
> 误区：当时以为获得了code，不用再返给前端，正好可以直接继续调sso的接口获取最终的token和userinfo，但是突然发现无法返回给前端了...

```js
public async code() {
    const { ctx } = this;
    // sso返回的code
    const queryCode: string = ctx.query.code;
    const logCode = ctx.lofInfo(`queryCode ----> ${queryCode}`, BASE + 21);
    ctx.logger.info(logCode);
    // 保存的真实回跳地址（子系统）
    const queryState: string = ctx.query.state;
    const logState = ctx.lofInfo(`queryState ----> ${queryState}`, BASE + 24);
    ctx.logger.info(logState);
    // 返回到子系统
    ctx.redirect(`${queryState}?code=${queryCode}`);
    if(!queryCode) {
      const noCode = ctx.lofInfo('没有code', BASE + 28);
      ctx.logger.info(noCode);
    } else if(!queryState) {
      const noState = ctx.lofInfo('没有回调url', BASE + 31);
      ctx.logger.info(noState);
    } else {
      const logSuccess = ctx.lofInfo('带code回跳url成功', BASE + 34);
      ctx.logger.info(logSuccess);
    }
  }
```

5.  前端登录组件判断url中有code,则自动继续调node服务，node层继续去sso换回token和userinfo，最终返回给前端组件

```js
mounted() {
  this.getTokenByCode();
},
methods: {
  ADLogin() {
    let url = location.href;
    toLogin(url);
  },
  getTokenByCode() {
    if (this.code) {
      let params = {
        code: this.code,
      };
      reqToken(params).then((res) => {
        const { code, data, msg } = res.data;
        if (code === 10000) {
          const { access_token, token_type, info } = data;
          // 获得token之后保存在localStorage中
          localStorage.setItem('token', access_token);
          localStorage.setItem('userInfo', JSON.stringify(info));
          // 子系统使用login组件是可以指定一个获取token成功的回调
          this.$emit('getTokenSuccess', data);
        } else if (code === 30001) {
          this.$message.error(msg);
          location.href = location.href.substring(0, location.href.indexOf('?'));
        }
      })
    }
  },
}
```

6.  至此子系统已经成功登录sso，获得token和userinfo，只需交给相应后台系统即可，后台系统生成自己新的业务token即可

- 优点

1.  新的后台系统不再关注任何client_id，后端也不再关注client_secert
2.  前端只需引入组件，处理获取token之后的逻辑即可
3.  基本实现了后台登录零成本

##  jenkins部署egg项目

```shell
#!/bin/sh

# 查询有没有9101的端口的进程，如果有返回1，如果没有返回0
node_count=`netstat -anp|grep  9101 |awk '{printf $7}'|cut -d/ -f1 |wc -l`

# 查询9101的进程id
node_id=`netstat -anp|grep  9101 |awk '{printf $7}'|cut -d/ -f1`

echo "老的node id ==> "${node_id}	

# 判断如果有老的进程杀死
if [ 0 != ${node_count} ]
then
   echo "kill 老的node id ==>"${node_id}	
   kill -9 ${node_id}
fi

# Jenkins运行后台shell
BUILD_ID=dontKillMe

yarn 

# 加后面的一堆是关闭进程日志，不写启动不了···
nohup yarn run egg-start-dev >/dev/null 2>&1 & exit

echo "==========================="

```

- pm2进程守护

```shell
# run.sh
id=$(pm2 list | grep dev-gateway | awk '{print $2}')
if [ "$id" == "" ];
then
  echo "未在pm2中启动，将自动启动"
  pm2 start server.js --name dev-gateway
else
  echo "在pm2 list中存在，将自动重启"
  pm2 restart "$id"
fi
```

```js
// server.js
const egg = require('egg');
const workers = Number(process.argv[2] || require('os').cpus().length);
egg.startCluster({
  workers,
  baseDir: __dirname,
});
```