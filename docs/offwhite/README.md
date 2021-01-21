---
keys:
 - '0D12EA71FE41B6DDACD415FB55316854'	
---
##  乔一

```js

// react echarts 柱状图
import React, { Component } from 'react'
import ECharts from 'echarts';

export default class EchartsBar extends Component {

    componentDidMount() {
        this.initEchart()
    }
    componentDidUpdate() {
        this.initEchart()
    }
    componentWillUnmount() {
        // 卸载
        this.echarts && this.echarts.dispose();
    }
    initEchart = () => {
        // 从props中接收三组数据
        const { domId, daily } = this.props
        // 获取元素
        let element = document.getElementById(domId)
        // 整理数据
        let data1 = daily && daily.reduce((pre, cur) => {
            return [...pre, cur.date]
        }, [])
        let data2 = daily && daily.reduce((pre, cur) => {
            return [...pre, cur.presentNum]
        }, [])
        let data3 = daily && daily.reduce((pre, cur) => {
            return [...pre, cur.absentNum]
        }, [])
        // 初始化
        // 柱状图配置对象
        let option = {
            title: {
                // text: '时段: 一三六 18:45-19:15',
                text: '出勤人数',
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
                    let value = (`应出勤人数: ${params[0].value + params[1].value}<br/>
                    ${params[0].seriesName}: ${params[0].value}<br/>
                    ${params[1].seriesName}: ${params[1].value}<br/>
                    出勤率: ${(params[0].value/(params[0].value + params[1].value)*100).toFixed(2)}%
                    `)
                    return value;
                },
            },
            legend: {
                data: ['实出勤', '未出勤'],
                icon: 'rect',
                orient: 'horizontal',
                bottom: 5,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 40,
                textStyle: {
                    color: '#666',
                    fontSize: 12,
                }
            },
            grid: {
                left: 30,
                right: 10,
                top: 40,
                bottom: 55,
            },
            xAxis: {
                type: 'category',
                // 需要替换的日期时间
                // data: ["9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "9.8", "9.9", "9.10", "9.11", "9.12", "9.13", "9.14"]
                data: data1,
                axisLine: {
                    symbol: ['none', 'arrow'],
                    symbolSize: [5, 5],
                    symbolOffset: [0, 5],

                },
                axisTick: false,
                // 字体颜色
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 8,
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    symbol: ['none', 'arrow'],
                    symbolSize: [5, 5],
                    symbolOffset: [0, 5],

                },
                axisTick: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#eee'],
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 8,
                    }
                },
            },
            series: [{
                name: '实出勤',
                type: 'bar',
                color: 'rgb(100, 202, 201)',
                stack: '总量',
                barMaxWidth: '15',
                // 需要替换的出勤数据
                // data: [10, 25, 40, 13, 10, 24, 34, 10, 25, 40, 13, 10, 24, 100]
                data: data2,
            }, {
                name: '未出勤',
                type: 'bar',
                stack: '总量',
                color: '#eee',
                // 需要替换的未出勤数据
                // data: [5, 2, 3, 1, 5, 6, 4, 5, 2, 3, 1, 5, 6, 4]
                data: data3,
            }],

        }
        this.echarts = ECharts.init(element, 'light');
        option && this.echarts.setOption(option);
    }
    render() {
        const { domId } = this.props
        const style = { height: '4.5rem' }
        return (
            <div>
                <div id={domId} style={style}></div>
            </div>
        )
    }
}

```