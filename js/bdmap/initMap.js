/*
 * @Author: Kai.Jiang 
 * @Date: 2018-02-01 16:43:13 
 * @Last Modified by: Kai.Jiang
 * @Last Modified time: 2018-02-01 16:47:51
 */

/*
 * 地图初始化
 */

/**
 * 涉及API
 * http://lbsyun.baidu.com/index.php?title=jspopular/guide/tool
 * http://api.map.baidu.com/library/DrawingManager/1.4/docs/symbols/BMapLib.DrawingManager.html#event:polygoncomplete
 * http://developer.baidu.com/map/reference/index.php?title=Class:%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB/PolylineOptions
 */


//  地图初始化配置
var bmapConfig = {
    centerMode: 'point', // 定位方式: 'locate':自动定位; 'point':指定中心点
    locateMode: 'ip',	// 定位模式: 'ip':ip定位, 'browser':'浏览器定位'
    centerPoint: {lng: 87.543446, lat: 43.921639}, // 初始化中心点，当定位模式为'point'时有效
    mapZoom: 12,	// 地图初始层级
    isShowRoad: false,	// 地图类型切换到卫星模式下，是否显示道路
    // hasSearch: true,	// 是否有搜索功能
    hasMapType: true,	// 是否有地图类型切换
    //hasMarkerType: true, // 是否有不同类型覆盖物的切换
    // divWidth: 300,	// 标记点上方自定义div的宽高
    // divHeight: 150,	// 标记点上方自定义div高度
    // divEdgeOnly:false,	// 只画边界
    //colorArray: ['#00e676', '#ba68c8', '#ff3d00', '#4dd0e1', 'blueviolet']	//绘制网格区块色值数组
    // colorArray: ['#00e676', '#ba68c8', '#ff3d00', '#4dd0e1', 'blueviolet','#ff1744', '#f06292', '#d500f9', '#7e57c2', '#3d5afe', '#42a5f5', '#00b0ff', '#26c6da', '#1de9b6', '#66bb6a', '#76ff03', '#d4e157', '#ffea00', '#ffca28', '#ff9100', '#ff7043', '#4e342e', '#bdbdbd', '#37474f']
};

// 初始化地图
function initMap(selector, config){
	var map = null;

	if(config) {
		for(var key in config) {
			bmapConfig[key] = config[key];
		}
	}
	
	var selector = String(selector);
	if( bmapConfig && bmapConfig.centerMode ){
		if( bmapConfig.centerMode === 'locate' ){
			map = new BMap.Map(selector, {enableMapClick: false});	//初始化地图，禁止默认点击事件
			var poi = new BMap.Point(bmapConfig.centerPoint.lng, bmapConfig.centerPoint.lat);
			map.centerAndZoom(poi, bmapConfig.mapZoom);
			map.enableScrollWheelZoom();	//允许滚轮缩放
			
			if( bmapConfig.locateMode === 'ip' ){	// ip定位
				function getLocate(result){
					var cityName = result.name;
					console.log(cityName)
					map.setCenter(cityName);
				}
				var myCity = new BMap.LocalCity();
				myCity.get(getLocate);
			}else if( bmapConfig.locateMode === 'browser' ){	// 浏览器定位
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						map.centerAndZoom(r.point, bmapConfig.mapZoom);
						//var mk = new BMap.Marker(r.point);
						//map.addOverlay(mk);
						map.panTo(r.point);
					}
					else {
						bmapConfig.centerMode = 'point';
						initMap()
					}        
				},{enableHighAccuracy: true})
			}
			
		}
		else if( bmapConfig.centerMode === 'point' && bmapConfig.centerPoint ){
			map = new BMap.Map(selector, {enableMapClick: false});
			var poi = new BMap.Point(bmapConfig.centerPoint.lng, bmapConfig.centerPoint.lat);
			map.centerAndZoom(poi, bmapConfig.mapZoom);
			map.enableScrollWheelZoom();	//允许滚轮缩放
		}
	}

	if( bmapConfig.hasMapType ){
		// 切换地图显示类型
		$('.maptype ul li span').click(function(){
			if( $(this).parent().hasClass('active') ){
				//
			}else{
				$('.maptype ul li').removeClass('active');
				$(this).parent().addClass('active');

				var type = $(this).attr('id');
				if( type === 'ditu' ){
					map.setMapType(BMAP_NORMAL_MAP)
				}else if( type === 'weixing' ){
					if( bmapConfig.isShowRoad ){
						map.setMapType(BMAP_HYBRID_MAP)
					}else{
						map.setMapType(BMAP_SATELLITE_MAP)
					}
				}
			}
		})

		$('#maptype button').click(function(){
			if( $(this).hasClass('btn_selected_orange') ){
				//
			}else{
				$('#maptype button').removeClass('btn_selected_orange');
				$(this).addClass('btn_selected_orange');

				var type = $(this).attr('id');
				if( type === 'ditu' ){
					map.setMapType(BMAP_NORMAL_MAP)
				}else if( type === 'weixing' ){
					if( bmapConfig.isShowRoad ){
						map.setMapType(BMAP_HYBRID_MAP)
					}else{
						map.setMapType(BMAP_SATELLITE_MAP)
					}
				}
			}
		})		
		
	}

	// 是否有搜索功能
	if( bmapConfig.hasSearch ){
		// 搜索
		var local = new BMap.LocalSearch(map, {
			renderOptions: {map: map, panel: "r-result"}
		});
		$('#dosearch').click(function(){
			if( $('#suggestId').val()!='' ){
				local.search( $('#suggestId').val() );
				$('.search-result').addClass('show');
			}
		});
		$('.close-result i').click(function(){
			$('#suggestId').val('');
			$('.search-result').removeClass('show');
		})
	}

	return map;
}
