---
keys:
 - '0D12EA71FE41B6DDACD415FB55316854'	
---

```js

// react echarts 折线图
import React, { Component } from 'react'
import ECharts from 'echarts';

export default class EchartsLine extends Component {
    state = {
        colorList: ['rgb(79, 153, 247)','#EE6B09','blue','skyblue','red','pink','rgb(100, 202, 201)'],
    }

    componentDidMount () {
        this.initEchart()
    }
    componentWillUnmount () {
        // 卸载
        this.echarts && this.echarts.dispose();
    }
    componentDidUpdate () {
        this.initEchart()
    }
    initEchart = () => {
        // 从props中接收六组数据
        const { domId,data } = this.props
        // 获取元素
        let element = document.getElementById(domId)
        // 初始化
        let nameList = data.classes
        let rateList = data.rateList
        let series = data.numList.map((item,index) => {
            return {
                name: nameList[index],
                type: 'line',
                color: this.state.colorList[index],
                barMaxWidth: '15',
                // 要接收的参数
                data: item,
            }
        })
        // 折线图配置对象
        const option = {
            title: {
                // text: '时段: 一三六 18:45-19:15',
                text: `出勤人数：${data.timeName}`,
                x: 'left',
                align: 'right',
                textStyle: {
                    color: 'rgb(79, 153, 247)',
                    fontSize: '12',
                    fontWeight: 'bolder',
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    return params.map((item,index) => {
                    return `${item.seriesName}: ${item.value}, 出勤率: ${rateList[index][item.dataIndex]} <br/> `
                    }).join('')
                },
                position: ['15%', '30%']
            },
            legend: {
                // 要接受的参数
                // data: ['班级A', '班级B', '班级C', '班级D'],
                type: 'scroll',
                data: data.classes,
                icon: 'circle',
                orient: 'horizontal',
                bottom: 5,
                itemWidth: 10,
                itemHeight: 10,
                padding: [0 ,0],
                textStyle: {
                    color: '#666',
                    fontSize: 12,
                }
            },
            grid: {
                left: 30,
                right: 10,
                top: 40,
                bottom: 50,
            },
            xAxis: {
                // 要接收的参数
                // data: ["9.1", "9.2", "9.3"]
                data: data.dateList,
                axisLine: {
                    symbol:['none','arrow'],
                    symbolSize: [5,5],
                    symbolOffset: [0,5],
                    
                },
                axisTick: false,
                // 字体颜色
                axisLabel: {        
                    show: true,
                    textStyle: {
                        fontSize:8,
                    }
                },
            },
            yAxis: {
                axisLine: {
                    symbol:['none','arrow'],
                    symbolSize: [5,5],
                    symbolOffset: [0,5],
                    
                },
                axisTick: false,
                splitLine: {
                    show: true,
                    lineStyle:{
                         color: ['#eee'],
                         width: 1,
                        type: 'solid'
                    }
                },
                // 字体颜色
                axisLabel: {        
                    show: true,
                    textStyle: {
                        fontSize:8,
                    }
                },
                // 去掉0，最小值自动计算
                scale: true
            },
            series
        }
        this.echarts = ECharts.init(element,'light');
        option && this.echarts.setOption(option);
    }
    render() {
        const { domId } = this.props
        const style = {height: '4.5rem'}
        return (
            <div>
                <div id={domId} style={style}></div>
            </div>
        )
    }
}

```