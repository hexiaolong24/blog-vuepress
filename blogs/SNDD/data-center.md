---
title: data-center
date: 2019-10-12
sidebar: 'auto'
categories:
 - SNDD
isShowComments: false
keys:
 - '1360d01f3f0d562dc30b433a62443dcd'
---

##  数据格式

```js
// 用户token
'hexiaolong': userToken

// 生成用户token时的信息
{
  data: 'hexiaolong',
  exp: '有效期'
}
```
##  概述

- 数据中心是内嵌在企业微信中的一个h5项目，各个维度的数据报表
- node服务打通企业微信登录
- 首先是用corp_id和corp_secret获取企业token，有效期是两个小时，获取回来之后存在redis中


```js
public async token() {// 获取企业微信token
  const { config, ctx } = this;
  
  const res:any = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.WEIXIN.corpid}&corpsecret=${config.WEIXIN.corpsecret}`, {
    dataType: 'json',
    method: 'GET',
  });
  console.log('企业微信api/gettoken', res)

  if(res.data.errcode !== 0) {
    const msg = ctx.lofInfo('获取token失败', BASE + 17);
    ctx.logger.info(msg);
    return '';
  }else if(res.data.errcode === 0) {
    let val = {
      creatTime: Date.now(),
      access_token: res.data.access_token
    }
    let jsonVal = JSON.stringify(val);
    let result = await this.app.redis.set('access_token', jsonVal); // 保存到redis
    console.log('保存到redis_result', result)
    if(result == 'OK') {
      const msg = ctx.lofInfo('Redis缓存企业微信token成功', BASE + 30);
      ctx.logger.info(msg);
    }else {
      const msg = ctx.lofInfo('Redis缓存企业微信token失败', BASE + 33);
      ctx.logger.info(msg);
    }
    return res.data.access_token;
  }
}
```

- 当正常调用其他接口的时候都用走中间件，检查用户登录状态,检查登录的逻辑是，从header中获取 authorization 字段的值，这个字段的值就是用户token，如果有值，则继续检验这个值，
- 用到的jsonwebtoken
- 解密的时候先判断是否过了有效期，如果没有过期，返回用户名，如果过期了直接返回空，返回用户名之后，在从redis中通过用户名找到对应的用户token，比较是否一样，如果一致，则验证通过

```js
router.js
// h5留言相关接口
const jwt = app.middleware.jwt();
router.post('/api/weixin/transmit', jwt, controller.weixin.transmit);
```

- 中间件

```js
const jwt = require('jsonwebtoken');
const BASE = 'iwt.ts - ';
import { Context } from 'egg';
module.exports = () => {
  return async(ctx:Context, next: () => Promise<any>) => {
    const authToken = ctx.header.authorization // 获取header里的authorization
    console.log('authToken', authToken)
    if(authToken) {
      const res_userid = verifyToken(authToken) // 解密获取的Token
      console.log('用户res_userid', res_userid)
      if(res_userid) {
        const redis_token = await ctx.app.redis.get(res_userid) // 获取保存的token
        console.log('redis_token', redis_token)
        if(redis_token === authToken) {
          await next()
        }else {
          const msg = ctx.lofInfo('身份验证失败', BASE + 17);
          ctx.logger.info(msg);
          ctx.body = ctx.helper.getResObject(2, null, '身份验证失败，请重新登录')
        }
      }else {
        const msg = ctx.lofInfo('登录状态已失效', BASE + 22);
        ctx.logger.info(msg);
        ctx.body = ctx.helper.getResObject(2, null, '登录状态已失效，请重新登录')
      }
    }else {
      const msg = ctx.lofInfo('header中没有authorization', BASE + 27);
      ctx.logger.info(msg);
      ctx.body = ctx.helper.getResObject(2, null, '身份验证失败，请重新登录');
    }
  };
}

// 解密，验证
function verifyToken(token) {
  let res = ''
  try {
    // 解密的时候先判断是否过了有效期，如果没有过期，返回用户名，如果过期了直接返回空
    const result = jwt.verify(token, 'acusertoken') || {}
    console.log('result',result)
    const { exp } = result,
    current = Math.floor(Date.now() / 1000)
    if(current <= exp) {
      res = result.data || {}
    }
  } catch (e) {
    console.log(e)
  }
  return res
}
```

- 如果登录通过，正常走下面的业务逻辑

- 如果没有通过，则返回继续登录，前端给node服务传一个code,node用这个code和第一步获得的企业token换取企业员工信息
- 每次获取用户信息的接口都需要先看一下企业token是否过期，可以启动定时任务，每接近两个小时的时候就跑一次，但是这样比较耗性能，采用的方案是每次用到的时候从redis中读取一下，然后判断当前时间和存进去的时候是否已经过了有效期，如果过了有效期，继续重新获取，
- 如果企业token没有过期，那么就用企业token和code获取企业员工信息，获取成功之后生成每个用户的token，存在redis中，数据格式是

```js
'hexiaolong': userToken
```

```js
// 通过用户userid(name) 生成user_token
{
  data: 'hexiaolong',
  exp: '有效期'
}
loginToken( userId:String, expires = 3600 * 24 * 14) {
  // 有效期
  const exp = Math.floor(Date.now() / 1000) + expires; 
  // acusertoken 密码
  const token = jwt.sign({ data: userId, exp }, 'acusertoken');
  console.log('bbb',token)
  return token
}
```