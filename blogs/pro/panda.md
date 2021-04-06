---
title: panda
date: 2019-10-12
sidebar: 'auto'
categories:
 - pro
isShowComments: false
---

##  概述

- 熊猫养成是一个宠物养成类的成长项目，涉及熊猫的领养，做任务获得食物，不断升级的一个过程
- 涉及到的状态有 普通、喂食、互动、睡觉、饥饿、出走
- 不同的等级可以对应不同的形象，不同的形象又可以解锁不同的互动动作

##  技术难点

- 静态资源过多，包括图片、lottie动画文件等
- 所有静态资源都统一放在一个assets.js文件中，所有资源全部都先上传cdn
- 打包项目前先将所有资源下载下来，创建一个zip压缩包

```js
// 下载所有url
for (let i in assets){
  execSync('curl -O ' + assets[i].url)
}
// 把所有下载下来的文件组合成只有文件名的字符串参数
let fileNameArr = []
for (let i in assets){
  fileNameArr.push(assets[i].url.substr(assets[i].url.lastIndexOf('/') + 1))
}
let fileString = Array.from(new Set(fileNameArr)).join(' ')
// 把下载下来的资源压缩成zip包
let timeStr = new Date().getTime()
execSync(`zip panda${timeStr}.zip ${fileString}`)
```

- loading页加载的时候先解压，然后将所有的url创建一个blob链接

```js
import zip from 'jszip'
import utils from 'jszip-utils'

loadFiles(){
  // 获取文件
  request.get('/h5-game/version.txt',{
    responseType: 'json'
  }).then(res => {
    let url = res.data.data.url
    let reg = url.match(/panda\w{0,13}\.\w{0,3}/)[0].replace('7z','zip')

    // 获取zip包并解压
    let zipFile = new zip.external.Promise((resolve, reject) => {
      utils.getBinaryContent(`/h5-game/${reg}`, (err,data) => {
        resolve(data)
      })
    }).then(res => {
      return zip.loadAsync(res)
    })

    //获取解压后的流
    zipFile.then(async res => {
      let AsyncFiles = {}
      // 将解压后的流转化为可以使用的blob流
      for(let i in res.files){
        // 获取后缀名 创建对应后缀名字典
        let fileName = res.files[i].name
        let suffix = fileName.match(/\.\w{0,4}/)[0].replace('.','')
        let suffixMap = {
          'png': 'image/png',
          'json': 'application/json'
        }
        let MimeType = suffixMap[suffix]
        let blob = await res.files[i].async('blob')
        AsyncFiles[fileName] = {
          url: URL.createObjectURL(new Blob([blob],{type: MimeType}))
        }
      }
      // 将转化后的blob流组装位项目所需要的blob json
      let finalFiles = {}
      for(let i in assets){
        let blobAddr = Object.assign({},AsyncFiles[assets[i].url.match(/\w{32}.(\w{3,4})/)[0]])
        let url = assets[i].url
        finalFiles[i] = {
          url,
          blob: blobAddr.url
        }
      }
      // 提交到vuex，然后跳转
      this.$store.commit('reset_assets',finalFiles)
      this.setRouter()
    })
  })
},
```

- 不同形象对应的资源先依赖当前熊猫的形象等级来匹配，首先先判断当前熊猫的等级，形象等级，判断当前的状态，首先是如果上一次喂食时间超过7天就是出走，超过3天就是饥饿，然后就是按照当前时间，判断是睡觉还是正常状态，直接对应接下来的动作，不同形象的动作位置大小也是不同的，也是提前分形象创建各自的位置文件，直接匹配

```js
matchAppearanceGrade(key) {
  switch (key) {
    case 0:
      zero.food[0][0].afterDestroy = () => {
        this.isShowBeginnerGuidance = true;
      }
      this.currentConfigAssets = zero;
      this.bubbleStyle.bottom = this.isIpad ? '2.3rem' : '2.62rem';
      return
    case 1:
      this.currentConfigAssets = one;
      this.bubbleStyle.bottom = this.isIpad ? '2.12rem' : '2.52rem';
      return 
    case 2:
      this.currentConfigAssets = two;
      this.bubbleStyle.bottom = this.isIpad ? '2.28rem' : '2.68rem';
      return
    case 3:
      this.currentConfigAssets = three;
      this.bubbleStyle.bottom = this.isIpad ? '2.45rem' : '2.85rem';
      return
    case 4:
      this.currentConfigAssets = four;
      this.bubbleStyle.bottom = this.isIpad ? '2.95rem' : '3.35rem';
      return
    case 5:
      this.currentConfigAssets = five;
      this.bubbleStyle.bottom = this.isIpad ? '3.3rem' : '3.77rem';
      return
    case 6:
      this.currentConfigAssets = six;
      this.bubbleStyle.bottom = this.isIpad ? '3.45rem' : '4.16rem';
      return
    case 7:
      this.currentConfigAssets = seven;
      this.bubbleStyle.bottom = this.isIpad ? '3.45rem' : '4.16rem';
      return
  }
},
```

- 喂食的逻辑,先判断下一次喂食是否会升级，升级会有升级弹窗，领取奖励，改变当前状态为喂食，判断当前所处的状态分别处理，互动同样，核心就是将不同的行为动作抽离成不同的函数，与熊猫等级没有关系，等级只是一上来确定好，然后匹配不同的资源，位置配置文件等等，后续如果要扩展行为动作，直接重新新加就可以，如果要改变某一个形象对应的动作或者是形象位置直接更改配置文件就可以了

```js
// 判断是否升级
async confirmPandaUpgrade() {
  // 已经喂食数
  const current = this.eatNumber;
  // 升级总需食物数
  const total = this.levelNumber;
  if(total - current === 1) { //下次喂食升级
    // 播放喂食动画
    this.setPandaDomStyle('food');
    this.currentConfigAssets.upgrade[0][0].afterDestroy = () => {
      // 动画结束后 获取最新食物数
      // this.$store.dispatch('getFood');
      // 展示升级弹窗
      this.isShowUpgrade = true;
      // 吃完回到默认状态
      this.eatToNormalcy();
    }
    this.animationActuator(this.currentConfigAssets.upgrade[0], this.currentConfigAssets.upgrade[1]);
  }else {
    // 下次喂食不升级
    this.status = 'food';
    this.setPandaDomStyle('food');
    this.animationActuator(this.currentConfigAssets.food[0], this.currentConfigAssets.food[1]);
    this.newLottie.ani.addEventListener('destroy', this.eatToNormalcy);
  }
},
```

- ui组件全部抽离，依赖vuex获得熊猫具体信息，任务奖励、档案、等级进度、云雾转场、气泡提示等等
