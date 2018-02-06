/*
 * @Author: Kai.Jiang 
 * @Date: 2018-02-01 16:43:13 
 * @Last Modified by: Kai.Jiang
 * @Last Modified time: 2018-02-02 17:03:55
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


// 初始化地图
function initMap(selector, config) {

    $('#' + selector).css({'position': 'relative', 'overflow': 'hidden'});

    //  地图初始化配置
    let bmapConfig = {
        centerPoint: {lng: 87.543446, lat: 43.921639}, // 初始化中心点，当定位模式为'point'时有效
        mapZoom: 12,	// 地图初始层级
        mapType: 'weixing', //初始地图类型
        hasMapType: true,	// 是否有地图类型切换
        isShowRoad: false,	// 地图类型切换到卫星模式下，是否显示道路
        hasSearch: true,	// 是否有搜索功能
        hasNControl: true,  //是否显示缩放平移控件
    };
    let map = null;

    if (config) {
        for (var key in config) {
            bmapConfig[key] = config[key];
        }
    }
    var selectorMap = selector.split("-box").join("");
    map = new BMap.Map(selectorMap, {enableMapClick: false});	//初始化地图，禁止默认点击事件
    let poi = new BMap.Point(bmapConfig.centerPoint.lng, bmapConfig.centerPoint.lat); //设置中心点
    map.centerAndZoom(poi, bmapConfig.mapZoom);   //设置地图展示层级
    map.enableScrollWheelZoom();	//允许滚轮缩放

    //是否左上角，添加默认缩放平移控件
    if (bmapConfig.hasNControl) {
        map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
    }

    //初始显示地图类型   卫星：weixin  普通：ditu
    if (bmapConfig.mapType == 'weixing') {
        map.setMapType(BMAP_SATELLITE_MAP);  // 使用卫星地图
    } else if (bmapConfig.mapType == 'ditu') {
        map.setMapType(BMAP_NORMAL_MAP);     //使用普通地图
    } else {
        map.setMapType(BMAP_NORMAL_MAP);     //普通
    }


    //是否显示地图类型切换按钮
    if (bmapConfig.hasMapType) {
        //判断地图类型
        if (bmapConfig.mapType == 'weixing') {
            let MapTypeHtml = '<!-- 地图类型控制 -->' +
                '<div class="map-type">' +
                '<ul>' +
                '<li id="ditu"><span><i class="fa fa-map"></i>&nbsp;地图</span></li>' +
                '<li id="weixing" class="active"><span><i class="fa fa-globe"></i>&nbsp;卫星</span></li>' +
                '</ul>' +
                '</div>';
            $('#' + selector).append(MapTypeHtml);
        } else if (bmapConfig.mapType == 'ditu') {
            let MapTypeHtml = '<!-- 地图类型控制 -->' +
                '<div class="map-type">' +
                '<ul>' +
                '<li id="ditu"  class="active"><span><i class="fa fa-map"></i>&nbsp;地图</span></li>' +
                '<li id="weixing"><span><i class="fa fa-globe"></i>&nbsp;卫星</span></li>' +
                '</ul>' +
                '</div>';
            $('#' + selector).append(MapTypeHtml);
        } else {
            let MapTypeHtml = '<!-- 地图类型控制 -->' +
                '<div class="map-type">' +
                '<ul>' +
                '<li id="ditu"  class="active"><span><i class="fa fa-map"></i>&nbsp;地图</span></li>' +
                '<li id="weixing"><span><i class="fa fa-globe"></i>&nbsp;卫星</span></li>' +
                '</ul>' +
                '</div>';
            $('#' + selector).append(MapTypeHtml);
        }

        // 切换地图显示类型
        $('#' + selector + ' .map-type ul li').click(function () {
            if ($(this).hasClass('active')) {
                //
            } else {
                // $('.map-type ul li').removeClass('active');
                $(this).addClass('active').siblings('li').removeClass('active');

                var type = $(this).attr('id');
                if (type === 'ditu') {
                    map.setMapType(BMAP_NORMAL_MAP)
                } else if (type === 'weixing') {
                    if (bmapConfig.isShowRoad) {
                        map.setMapType(BMAP_HYBRID_MAP)
                    } else {
                        map.setMapType(BMAP_SATELLITE_MAP)
                    }
                }
            }
        });
    }

    // 是否有搜索功能
    if (bmapConfig.hasSearch) {
        let MapSearchHtml = '<!-- 地点搜索框 -->' +
            '<div class="map-search">' +
            '<input type="text" value="" placeholder="输入地名检索"/>' +
            '<button>搜索</button>' +
            '</div>' +
            '<!-- 搜索结果面板 -->' +
            '<div class="map-search-result">' +
            '<div class="close-result">' +
            '<i class="fa fa-close"></i>' +
            '</div>' +
            '<div id= "' + selector + 'r-result" class="r-result">' +
            '</div>' +
            '</div>';
        $('#' + selector).append(MapSearchHtml);
        // 搜索
        var local = new BMap.LocalSearch(map, {
            renderOptions: {map: map, panel: selector + "r-result"}
        });
        //按钮
        $('#' + selector + ' .map-search button').click(function () {
            if ($('#' + selector + ' .map-search input').val() != '') {
                local.search($('#' + selector + ' .map-search input').val());
                $('#' + selector + ' .map-search-result').addClass('show');
            }
        });
        //回车
        $('#' + selector + ' .map-search input').keyup(function (event) {
            if (event.keyCode == "13") {//keyCode=13是回车键
                if ($('#' + selector + ' .map-search input').val() != '') {
                    local.search($('#' + selector + ' .map-search input').val());
                    $('#' + selector + ' .map-search-result').addClass('show');
                }
            }
        });
        //关闭检索列表
        $('#' + selector + ' .close-result i').click(function () {
            $('#' + selector + ' .map-search input').val('');
            $('#' + selector + ' .map-search-result').removeClass('show');
        })
    }
    return map;
}




//
// var mapinit = function (selector) {
//     this.bmapConfig = {
//         centerPoint: {lng: 87.543446, lat: 43.921639}, // 初始化中心点，当定位模式为'point'时有效
//         mapZoom: 12,	// 地图初始层级
//         mapType:'weixing', //初始地图类型
//         hasMapType: true,	// 是否有地图类型切换
//         isShowRoad: false,	// 地图类型切换到卫星模式下，是否显示道路
//         hasSearch: true,	// 是否有搜索功能
//         hasNControl:true,  //是否显示缩放平移控件
//         selector:selector
//     };
//     this.map = function () {
//         let map = null;
//         var selectorMap =  this.bmapConfig.selector.split("-box").join("");
//         map = new BMap.Map(selectorMap, {enableMapClick: false});	//初始化地图，禁止默认点击事件
//         let poi = new BMap.Point(this.bmapConfig.centerPoint.lng, this.bmapConfig.centerPoint.lat); //设置中心点
//         map.centerAndZoom(poi, this.bmapConfig.mapZoom);   //设置地图展示层级
//         map.enableScrollWheelZoom();	//允许滚轮缩放
//         return map;
//     };
//     this.map();
// };