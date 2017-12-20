//饼图
var pieChartChart = echarts.init(document.getElementById('pie-chart'));

var echartData = [{
	value: 2154,
	name: '已读'
}, {
	value: 3854,
	name: '未读'
}]

//饼图样式
var rich = {
	yellow: {
		color: "#ffc72b",
		fontSize: 25,
		padding: [5, 4],
		align: 'center'
	},
	total: {
		color: "#579bec", //中心数字
		fontSize: 30,
		align: 'center'
	},
	white: {
		//					color: "#fff",
		align: 'center',
		fontSize: 16,
		padding: [5, 0]
	},
	blue: {
		color: '#f76675',
		fontSize: 18,
		align: 'center'
	},
	hr: {
		borderColor: '#0b5263',
		width: '100%',
		borderWidth: 1,
		height: 0,
	}
}
// 指定图表的配置项和数据
var pieChartOption = {
	//				backgroundColor: '#031f2d',
	title: {
		text: '总人数',
		left: 'center',
		top: '53%',
		padding: [24, 0],
		textStyle: {
			color: '#579bec',
			fontSize: 14,
			align: 'center'
		}
	},
	legend: {
		selectedMode: false,
		formatter: function(name) {
			var total = 0; //
			var averagePercent; //
			echartData.forEach(function(value, index, array) {
				total += value.value;
			});
			return '{total|' + total + '}';
		},
		data: [echartData[0].name],
		// data: [''],
		// itemGap: 50,
		left: 'center',
		top: 'center',
		icon: 'none',
		align: 'center',
		textStyle: {
			//						color: "#fff",
			fontSize: 16,
			rich: rich
		},
	},
	series: [{
		//					name: '',
		type: 'pie',
		radius: ['42%', '60%'],
		hoverAnimation: false,
		color: ['#509af3', '#d8d8d8'],
		label: {
			normal: {
				formatter: function(params, ticket, callback) {
					var total = 0; //
					var percent = 0; //
					echartData.forEach(function(value, index, array) {
						total += value.value;
					});
					percent = ((params.value / total) * 100).toFixed(1);
					return '{white|' + params.name + '}\n{white|' + params.value + '}\n{blue|' + percent + '%}';
				},
				rich: rich
			},
		},
		labelLine: {
			normal: {
				length: 60,
				length2: 0,
				lineStyle: {
					color: '#0b5263'
				}
			}
		},
		data: echartData
	}]
};
// 使用刚指定的配置项和数据显示图表。
pieChartChart.setOption(pieChartOption);