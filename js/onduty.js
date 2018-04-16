/**
 * 值班台
 *
 */

/**
 * 区间日历方法
 * @param id
 * @param Fn
 */
function initDaterangepicker(id, Fn) {
    let rangesDaterangepicker;

    if (id == 'daterange-btn1' || id == 'daterange-btn2' || id == 'daterange-btn3' || id == 'daterange-btn4' || id == 'daterange-btn7' || id == 'daterange-btn8') {
//         本月：即统计本层级本月发出去的任务。
//         上月：即统计本层级上月发出去的任务。
//         最近三月：即统计本层级最近三个月发出去的任务
//         本年：即统计本层级本年发出去的任务。(按照自然年计算)
//         去年：即统计本层级去年发出去的任务。(按照自然年计算)
//         自定义：即根据用户自定义的时间范围统计发出去的任务。

        //汉化按钮部分
        rangesDaterangepicker = {
            // '今日': [moment(), moment()],
            '本月': [moment().startOf('month'), moment()],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            '最近三月': [moment().subtract(90, 'days'), moment()],
            '本年': [moment().subtract(0, 'years').startOf('years'), moment()],
            '去年': [moment().subtract(1, 'years').startOf('years'), moment().subtract(1, 'years').endOf('years')]
        };
        //初始化显示当前时间
        $('#' + id + ' span').html(moment().subtract(90, 'days').format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'));
        let drop = '';
        if (id == 'daterange-btn7' || id == 'daterange-btn8') {
            drop = 'up';
        }

        //日期控件初始化
        $('#' + id).daterangepicker({
                locale: localeDaterangepicker,
                ranges: rangesDaterangepicker,
                startDate: moment().subtract(90, 'days'),
                endDate: moment(),
                // parentEl: $('.daterange-box')
                drops: drop
            },
            function (start, end) {
                $('#' + id + ' span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
                //执行的事件
                console.log(start.format('YYYY-MM-DD') + " " + end.format('YYYY-MM-DD'));
                if (Fn) {
                    Fn(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                }
            }
        );

    } else if (id == 'daterange-btn5' || id == 'daterange-btn6') {
        //汉化按钮部分
        rangesDaterangepicker = {
            // '今日': [moment(), moment()],
            '昨日': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '最近7日': [moment().subtract(7, 'days'), moment()],
            '最近30日': [moment().subtract(29, 'days'), moment()],
            '本月': [moment().startOf('month'), moment()],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        };
        //初始化显示当前时间
        $('#' + id + ' span').html(moment().subtract(7, 'days').format('YYYY-MM-DD') + ' - ' + moment().subtract(1, 'days').format('YYYY-MM-DD'));
        //日期控件初始化
        $('#' + id).daterangepicker({
                locale: localeDaterangepicker,
                ranges: rangesDaterangepicker,
                startDate: moment().subtract(7, 'days'),
                endDate: moment().subtract(1, 'days'),
                // parentEl: $('.daterange-box')
            },
            function (start, end) {
                $('#' + id + ' span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
                //执行的事件
                console.log(start.format('YYYY-MM-DD') + " " + end.format('YYYY-MM-DD'));
                if (Fn) {
                    Fn(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                }
            }
        );

    }

}

// * posted    发出的任务
// * received  收到的任务
// * feedback  情况反映
// * rescue    求助
// long total;// 总任务数、线索总数、求助总数
// long first;// 进行中数、未处理数、已响应数
// long second;// 已超时数、处理中数、未响应数
// long third;// 已完成数、已处理数、已处理数
//
// long totalDay;// 今日总任务数、今日线索总数、今日求助总数
// long firstDay;// 今日进行中数、今日未处理数、今日已响应数
// long secondDay;// 今日已超时数、今日处理中数、今日未响应数
// long thirdDay;// 今日已完成数、今日已处理数、今日已处理数

$(document).ready(function () {
//日历按钮
    initDaterangepicker('daterange-btn1', timePosted);
    initDaterangepicker('daterange-btn2', timeReceived);
    initDaterangepicker('daterange-btn3', timeFeedback);
    initDaterangepicker('daterange-btn4', timeRescue);
    initDaterangepicker('daterange-btn5', initLineAccepted);
    initDaterangepicker('daterange-btn6', initLineRate);
    initDaterangepicker('daterange-btn7', initArea);
    initDaterangepicker('daterange-btn8', initType);
//初始化 发出的任务 情况反映
    dutyRoom('posted', moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    dutyRoom('feedback', moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
//初始化趋势表格
    initLineAccepted(moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD'));
    initLineRate(moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD'));

//初始化事件区域累计分布
    initArea(moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));

//初始化最新任务值班人员
    initDutyInfo();
});

/**
 * 切换按钮
 */
$('#posted-btn').click(function () {
    setTimeout(function () {
        dutyRoom('posted', moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }, 100);
});
$('#received-btn').click(function () {
    setTimeout(function () {
        dutyRoom('received', moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }, 100);
});
$('#feedback-btn').click(function () {
    setTimeout(function () {
        dutyRoom('feedback', moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }, 100);
});
$('#rescue-btn').click(function () {
    setTimeout(function () {
        dutyRoom('rescue', moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }, 100);
});

$('#initArea-btn').click(function () {
    setTimeout(function () {
        initArea(moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }, 100);
});
$('#initType-btn').click(function () {
    setTimeout(function () {
        initType(moment().subtract(90, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    }, 100);
});


function timePosted(begin, end) {
    dutyRoom('posted', begin, end)
}

function timeReceived(begin, end) {
    dutyRoom('received', begin, end)
}

function timeFeedback(begin, end) {
    dutyRoom('feedback', begin, end)
}

function timeRescue(begin, end) {
    dutyRoom('rescue', begin, end)
}

/**
 * posted    发出的任务
 * received  收到的任务
 * feedback  情况反映
 * rescue    求助
 * @param type
 * @param begin
 * @param end
 */
function dutyRoom(type, begin, end) {
    $.ajax({
        type: 'POST',
        url: ctx + '/dutyroom.json',
        data: {
            id: regionId,
            type: type,
            begin: begin,
            end: end
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data);
            let total = data.data.total;
            let first = data.data.first;
            let second = data.data.second;
            let third = data.data.third;
            let totalDay = data.data.totalDay;
            let firstDay = data.data.firstDay;
            let secondDay = data.data.secondDay;
            let thirdDay = data.data.thirdDay;

            setTimeout(function () {
                initEchart('echart-' + type, type, {
                    total: total,
                    first: first,
                    second: second,
                    third: third
                });
            }, 200);

            $('#' + type + '-num-total').empty();
            let arr = total + ''.split("");
            for (let i = 0; i < 7; i++) {
                if (arr.length > i) {
                    let n = arr.length - i - 1;
                    $('#' + type + '-num-total').prepend('<span>' + arr[n] + '</span>');
                } else {
                    $('#' + type + '-num-total').prepend('<span>0</span>\n');
                }
            }

            $('#' + type + '-num-first').empty().append(first);
            $('#' + type + '-num-second').empty().append(second);
            $('#' + type + '-num-third').empty().append(third);
            $('#' + type + '-num-totalDay').empty().append(totalDay);
            $('#' + type + '-num-firstDay').empty().append(firstDay);
            $('#' + type + '-num-secondDay').empty().append(secondDay);
            $('#' + type + '-num-thirdDay').empty().append(thirdDay);

        }
    });

}


/**
 * 饼状图
 * @param viewID
 * @param type
 * @param data
 */
function initEchart(viewID, type, data) {
    let eChart = echarts.init(document.getElementById(viewID));
    // posted    发出的任务
    // received  收到的任务
    // feedback  情况反映
    // rescue    求助
    let thisData;
    if (type == "posted" || type == "received") {
        thisData = [{
            "value": data.first,
            "name": "进行中",
            itemStyle: {
                normal: {
                    color: '#F25E4B',
                }
            }
        }, {
            "value": data.second,
            "name": "已超时",
            itemStyle: {
                normal: {
                    color: '#50E3C2',
                }
            }
        }, {
            "value": data.third,
            "name": "已完成",
            itemStyle: {
                normal: {
                    color: '#03ADEF',
                }
            }
        }];

    } else if (type == "feedback") {

        thisData = [{
            "value": data.first,
            "name": "未处理",
            itemStyle: {
                normal: {
                    color: '#F25E4B',
                }
            }
        }, {
            "value": data.second,
            "name": "处理中",
            itemStyle: {
                normal: {
                    color: '#50E3C2',
                }
            }
        }, {
            "value": data.third,
            "name": "已处理",
            itemStyle: {
                normal: {
                    color: '#03ADEF',
                }
            }
        }];

    } else if (type == "rescue") {

        thisData = [{
            "value": data.first,
            "name": "已响应",
            itemStyle: {
                normal: {
                    color: '#F25E4B',
                }
            }
        }, {
            "value": data.second,
            "name": "未响应",
            itemStyle: {
                normal: {
                    color: '#50E3C2',
                }
            }
        }, {
            "value": data.third,
            "name": "已结束",
            itemStyle: {
                normal: {
                    color: '#03ADEF',
                }
            }
        }];

    }

    // let data_name = [];
    for (let n  in thisData) {
        if (data.total == 0) {
            thisData[n]['name'] = thisData[n]['name'] + '\n0%';
            // data_name.push(thisData[n]['name'])
        } else {
            thisData[n]['name'] = thisData[n]['name'] + '\n' + Math.round(thisData[n]['value'] * 100 / data.total * 100) / 100 + '%';
            // data_name.push(thisData[n]['name'])
        }

    }
    option = {
        textStyle: {
            color: 'rgba(255, 255, 255, 1)',
            fontSize: '12',
            fontWeight: '700'
        },
        backgroundColor: "#2D323E",
        tooltip: {
            trigger: 'item',
            formatter: "{b}"
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['30%', '55%'],
                data: thisData,
                itemStyle: {
                    normal: {
                        borderColor: '#2D323E',
                        borderWidth: '4'
                    }
                }
            }
        ]
    };

    eChart.setOption(option);
}


/**
 * 事件受理趋势
 * @param begin
 * @param end
 */
function initLineAccepted(begin, end) {
    $.ajax({
        type: 'POST',
        url: ctx + '/incidentTendency.json',
        data: {id: regionId, begin: begin, end: end},
        dataType: 'json',
        success: function (data) {
            // var data = {
            //     date: ["2018-03-22", "2018-03-23", "2018-03-24", "2018-03-25", "2018-03-26", "2018-03-27", "2018-03-28"],
            //     feedback: [0, 3, 0, 0, 0, 0, 0],
            //     rescue: [0, 0, 0, 0, 0, 0, 0],
            //     task: [0, 1, 0, 0, 0, 0, 0]
            // };

            let eChartTrend1 = echarts.init(document.getElementById('echart-trend1'));
            let eChartTrend1Option = {
                legend: {
                    top: '15px',
                    data: [{name: '任务', icon: 'circle', textStyle: {color: '#fff'}},
                        {name: '情况反映', icon: 'circle', textStyle: {color: '#fff'}},
                        {name: '求助', icon: 'circle', textStyle: {color: '#fff'}}]
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.data.date,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        },
                        // symbol: ['none', 'arrow'],//箭头
                        // symbolSize: [10, 15],//箭头大小
                        // symbolOffset :100
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        },
                        // symbol: ['none', 'arrow'],//箭头
                        // symbolSize: [10, 15],//箭头大小
                        // symbolOffset :100
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                series: [
                    {
                        name: '任务',
                        type: 'line',
                        smooth: true,
                        data: data.data.task,
                        itemStyle: {
                            normal: {
                                color: '#F25E4B'
                            }
                        }
                    },
                    {
                        name: '情况反映',
                        type: 'line',
                        smooth: true,
                        data: data.data.feedback,
                        itemStyle: {
                            normal: {
                                color: '#B280FF'
                            }
                        }
                    },
                    {
                        name: '求助',
                        type: 'line',
                        smooth: true,
                        data: data.data.rescue,
                        itemStyle: {
                            normal: {
                                color: '#F8E71C'
                            }
                        }
                    }
                ]
            };

            eChartTrend1.setOption(eChartTrend1Option);

        }
    });
}

/**
 * 事件完成率趋势
 * @param begin
 * @param end
 */
function initLineRate(begin, end) {
    $.ajax({
        type: 'POST',
        url: ctx + '/residentStatistics/ratioData.json',
        data: {id: regionId, begin: begin, end: end},
        dataType: 'json',
        success: function (data) {
            let eChartTrend2 = echarts.init(document.getElementById('echart-trend2'));
            let eChartTrend2Option = {
                legend: {
                    top: '15px',
                    data: [{
                        name: '任务',
                        icon: 'circle',
                        textStyle:
                            {
                                color: '#fff'
                            }
                    }, {
                        name: '情况反映',
                        icon: 'circle',
                        textStyle: {
                            color: '#fff'
                        }
                    }, {
                        name: '求助',
                        icon: 'circle',
                        textStyle: {
                            color: '#fff'
                        }
                    }]
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.data.date,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(99,95,119)'
                        }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                series: [
                    {
                        name: '任务',
                        type: 'line',
                        smooth: true,
                        data: data.data.task,
                        itemStyle: {
                            normal: {
                                color: '#F25E4B'
                            }
                        }
                    },
                    {
                        name: '情况反映',
                        type: 'line',
                        smooth: true,
                        data: data.data.feedback,
                        itemStyle: {
                            normal: {
                                color: '#B280FF'
                            }
                        }
                    },
                    {
                        name: '求助',
                        type: 'line',
                        smooth: true,
                        data: data.data.rescue,
                        itemStyle: {
                            normal: {
                                color: '#F8E71C'
                            }
                        }
                    }
                ]
            };

            eChartTrend2.setOption(eChartTrend2Option);
        }
    });
}


/**
 * 事件区域累计分布
 * @param begin
 * @param end
 */
function initArea(begin, end) {
    $.ajax({
        type: 'POST',
        url: ctx + '/incidentRegion.json',
        data: {
            id: regionId,
            begin: begin,
            end: end
        },
        dataType: 'json',
        success: function (data) {
            console.log(data)

            // let data = {
            //     feedbacks:[6, 0, 8, 0, 0, 0, 69, 0, 0, 0, 1, 0],
            //     regionName: ["网格一", "网格二", "网格三", "网格四", "网格五", "网格六", "网格七", "网格八", "网格十", "网格九", "网格十一", "十二网格"],
            //     rescues: [2, 0, 11, 0, 2, 0, 2, 0, 0, 1, 6, 0],
            //     tasks: [47, 0, 0, 0, 0, 0, 51, 0, 0, 0, 0, 0],
            // };

            //事件区域累计分布
            let eChartcumulative1 = echarts.init(document.getElementById('echart-cumulative1'));
            let eChartcumulative1Option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    top: '15px',
                    left: '25%',
                    selectedMode:false,
                    // orient:'horizontal',
                    // itemWidth:'25',
                    // itemHeight:'14',
                    // align:'left',
                    // padding:'5',
                    data: [{
                        name: '任务',
                        textStyle: {
                            color: '#fff'
                        }
                    }, {
                        name: '情况反映',
                        textStyle: {
                            color: '#fff'
                        }
                    }, {
                        name: '求助',
                        textStyle: {
                            color: '#fff'
                        }
                    }]
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    top: '30%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontZize: '12px'
                            },
                            interval: 0,
                            rotate: -30,
                            shadowOffsetX: -10
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgb(99,95,119)'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: 'rgb(99,95,119)'
                            }
                        },
                        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        data: data.data.regionName
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgb(99,95,119)'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgb(99,95,119)'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '任务',
                        type: 'bar',
                        stack: '综合',
                        data: data.data.tasks,
                        itemStyle: {
                            normal: {
                                color: '#025ABB'
                            }
                        },
                        barWidth: '12px',
                    },
                    {
                        name: '情况反映',
                        type: 'bar',
                        stack: '综合',
                        data: data.data.feedbacks,
                        itemStyle: {
                            normal: {
                                color: '#1B9AFF'
                            }
                        }
                    },
                    {
                        name: '求助',
                        type: 'bar',
                        stack: '综合',
                        data: data.data.rescues,
                        itemStyle: {
                            normal: {
                                color: '#74C7FF'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: function (params) {//格式化柱状图显示label
                                    let a = data.data.tasks[params.dataIndex];
                                    let b = data.data.feedbacks[params.dataIndex];
                                    let c = data.data.rescues[params.dataIndex];
                                    return a + b + c;
                                }
                            }
                        },
                    }
                ]
            };
            eChartcumulative1.setOption(eChartcumulative1Option);
        }
    });

}

/**
 * 事件类型累计分布
 * @param begin
 * @param end
 */
function initType(begin, end) {
    $.ajax({
        type: 'POST',
        url: ctx + '/incidentType.json',
        data: {
            id: regionId,
            begin: begin,
            end: end
        },
        dataType: 'json',
        success: function (data) {
            console.log(data)
            //事件区域累计分布
            let eChartcumulative2 = echarts.init(document.getElementById('echart-cumulative2'));
            let eChartcumulative2Option = {
                color: ['#FF906C'],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    top: "25%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.data.type,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            },
                            interval: 0,
                            rotate: -30
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgb(99,95,119)'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgb(99,95,119)'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '20%',
                        data: data.data.nums
                    }
                ]
            };
            eChartcumulative2.setOption(eChartcumulative2Option);
        }
    });
}


/**
 *（最新事件 & 值班表）
 * @returns
 */
function initDutyInfo() {
    $.ajax({
        type: "post",
        url: ctx + '/residentStatistics/dutyInfo.json',
        dataType: "json",
        success: function (result) {
            let events = result.events;
            let schedules = result.schedules;

            $('.form-list1-table').empty();
            $('.form-list2-table').empty();

            for (let i in events) {
                let e = events[i];
                let c = e.category;
                let title = '';
                let href = '';

                if (c == 'task') {
                    let taskTitle = (e.title == '') ? '语音任务，请点击查看' : e.title;
                    title = '【任务】' + taskTitle;
                    href = ctx + '/task/detail/' + e.id + "?back=/index/login";
                } else if (c == 'feedback') {
                    title = '【情况反映】' + e.title;
                    href = ctx + '/feedback/detail/' + e.id + "?back=/index/login";
                } else if (c == 'notice') {
                    title = '【通知】' + e.title;
                    href = ctx + '/info/informDetail/' + e.id + '?back=/index/login';
                }

                let html = '<div class="list-item">' +
                    '<span>' + e.createdAt + '</span>' +
                    '<a href="' + href + '" title="' + title + '">' + title + '</a>' +
                    '</div>';
                $('.form-list1-table').append(html);

            }

            for (let i in schedules) {
                let e = schedules[i];
                let dayNight = "";
                if (e.dayNight == 1) {
                    dayNight = "白班";
                } else if (e.dayNight == 2) {
                    dayNight = "夜班";
                } else if (e.dayNight == 3) {
                    dayNight = "白班、夜班";
                }

                let html = '<div class="list-item">' +
                    '<div>' + e.name + '</div>' +
                    '<div>' + e.phone + '</div>' +
                    '<div>' + dayNight + '</div>' +
                    '</div>';


                $('.form-list2-table').append(html);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}