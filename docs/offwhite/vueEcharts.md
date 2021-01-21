---
keys:
 - '0D12EA71FE41B6DDACD415FB55316854'	
---

##  vue echarts html2canvas

```js
<template>
  <div>
    <img class="image" :src="imgUrl" v-if="imgUrl" alt />
    <div :id="domId" v-else style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
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

    // 阅读材料数量
    detailsCount: {
      type: [String, Number],
      required: true,
      default: '1'
    }

  },
  data() {
    return {
      echarts: null,
      imgUrl: '',
    };
  },
  beforeDestroy() {

    // 卸载
    this.echarts && this.echarts.dispose();
  },
  watch: {
    radarData() {
      this.initEchart();
    },
    detailsCount() {
      this.initEchart();
    }
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
          name: '测评结果',
          type: 'radar',

          // areaStyle: {normal: {}},
          data: [
            {
              value: this.radarData,
              name: '测评结果',
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
      let indicator = []
      if (this.detailsCount == '1') {
        indicator = [
          { name: '自主阅读', max: 10 },
          { name: '阅读速度', max: 10 },
          { name: '信息推断', max: 20 },
          { name: '综合阅读理解', max: 40 },
          { name: '信息提取', max: 20 }
        ]
      }
      if (this.detailsCount == '2') {
        indicator = [
          { name: '信息提取', max: 20 },
          { name: '推测判断', max: 20 },
          { name: '评价鉴赏', max: 20 },
          { name: '联结运用', max: 20 },
          { name: '整体感知', max: 20 },
        ]
      }
      const option = {
        title: {
          show: false
        },
        tooltip: {
          show: false
        },
        legend: {

          // 要接受的参数
          data: ['测评结果'],
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
```