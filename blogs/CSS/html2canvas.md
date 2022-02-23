---
title: html2canvas截图
date: 2019-02-28
sidebar: 'auto'
categories:
 - CSS
tags:
 - CSS
---

##  通用配置

```js
// "html2canvas": "v1.0.0-alpha.12",其他版本坑较多
import html2canvas from 'html2canvas';
capture() {
  const _el = document.getElementById('top-wrap-container');
  const width = _el.offsetWidth;
  const height = _el.offsetHeight;
  const scale = 2;
  window.scrollTo(0, 0)
  html2canvas(_el, {
    dpi: window.devicePixelRatio * 2,
    scale: scale,
    width: width,
    height: height,
    imageTimeout: 0
  }).then((res) => {
    const context = res.getContext('2d');
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    const base64Img = res.toDataURL('image/png');
    this.imgUrl = base64Img;
  }).catch(err => {
    console.log(err)
  });
}
```
##  图片uri跨域处理

```js
//  封装统一处理图片地址
var capture = {
  replaceHost: function replaceHost(imgUrl) {
    // 由于 cdn 的域名和 当前项目域名存在跨域，会导图片跨域，截图在部分 ios 下失败。
    // 其中域名转发要在当前项目nginx 中配置的
    // https://coolcdn.com/p/2020/2/d08df052cf41815a699938935616ac59.jpg => ${location.origin}/coolcdn/p/2020/2/d08df052cf41815a699938935616ac59.jpg
    // nginx代理中以  coolcdn 开头再转发到  https://coolcdn.com
    var imgUrl2 = imgUrl;
    var preRE = /^((http|https):)?\/\/coolcdn\.com/i;
    imgUrl2 = imgUrl2.replace(preRE, "".concat(location.origin, "/coolcdn"));
    return imgUrl2;
  },
  replaceWxHost: function replaceWxHost(imgUrl) {
    // 替换微信host，获取微信图片返回的通用地址
    var imgUrl2 = imgUrl;
    var preRE = /^((http|https):)?\/\/thirdwx\.qlogo\.cn/i;
    imgUrl2 = imgUrl2.replace(preRE, "".concat(location.origin, "/wximg"));
    return imgUrl2;
  }
};
exports.capture = capture;
```

##  echarts 截图 绘图不完整或部分显示异常问题

思路是先将echarts组件绘制结束之后先单独截图，用图片覆盖，然后再统一截图，话不多说，直接上代码

```js
<template>
  <div>
    <img class="image" :src="imgUrl" v-if="imgUrl" alt />
    <div :id="domId" v-else style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
// 以下引用方式为部分引用
var ECharts = require('echarts/lib/echarts');
require('echarts/lib/chart/radar');
import html2canvas from 'html2canvas';

export default {
  props: {
    domId: {
      type: String,
      required: true,
      default: 'radarEcharts'
    },
    radarData: {
      type: Array,
      required: true,
      default: [0, 0, 0, 0, 0]
    },
  },
  data() {
    return {
      echarts: null,
      imgUrl: '',
    };
  },
  beforeDestroy() {
    this.echarts && this.echarts.dispose();
  },
  watch: {
    radarData() {
      this.initEchart();
    },
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      // 获取元素
      let element = document.getElementById(this.domId);
      // 初始化
      let series = [
        {
          name: 'xx',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: this.radarData,
              name: 'xxx',
              itemStyle: {
                normal: {
                  color: '#AB81FF',
                  lineStyle: {
                    width: 1,
                    color: '#AB81FF'
                  }
                }
              },
              areaStyle: {
                // 单项区域填充样式
                normal: {
                  color: 'rgba(171, 129, 255, 0.5)'
                }
              }
            }
          ]
        }
      ];
      indicator = [
        { name: 'xx', max: 10 },
        { name: 'xx', max: 10 },
        { name: 'xx', max: 20 },
        { name: 'xx', max: 40 },
        { name: 'xx', max: 20 }
      ]
      const option = {
        title: {
          show: false
        },
        tooltip: {
          show: false
        },
        legend: {
          data: ['xx'],
          show: false
        },
        radar: {
          radius: '75%', // 大小
          center: ['50%', '55%'], // 位置
          name: {
            textStyle: {
              color: '#705F91',
              fontSize: '12'
            }
          },
          indicator,
          // 设置雷达图中间射线的颜色
          axisLine: {
            lineStyle: {
              color: 'rgba(226,223,232,.4)',
              width: '1',
              type: 'dashed'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: '#fff' // 图表背景的颜色
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: 'rgba(226,223,232,1)' // 设置网格的颜色
            }
          }
        },
        series
      };
      this.echarts = ECharts.init(element, 'light');
      option && this.echarts.setOption(option);
      // 监听echarts绘制结束
      this.echarts.on('finished', () => {
        html2canvas(element, {
          dpi: window.devicePixelRatio * 3,
          scale: 3,
          width: element.offsetWidth,
          height: element.offsetHeight,
          imageTimeout: 0
        }).then((res) => {
          const context = res.getContext('2d');
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          const base64Img = res.toDataURL('image/png');
          this.imgUrl = base64Img;
          this.$nextTick(() => {
            this.$parent.getPicture();
          });
          // echarts生成图片后通知父组件开始截图
          this.$emit('captureSuccess', {
            status: 'success'
          })
        }).catch(err => {
          console.log(err)
        });
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.image{
  display: block;
  width: 100%;
}
</style>

```