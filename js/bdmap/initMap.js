

/*
 * 地图初始化
 */

/**
 * 涉及API
 * http://lbsyun.baidu.com/index.php?title=jspopular/guide/tool
 * http://api.map.baidu.com/library/DrawingManager/1.4/docs/symbols/BMapLib.DrawingManager.html#event:polygoncomplete
 * http://developer.baidu.com/map/reference/index.php?title=Class:%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB/PolylineOptions
 */


/**
 * 初始化地图
 * @param selector
 * @param bmapConfig
 */
function initMap(selector, bmapConfig) {

    //添加style
    $('#' + selector).css({'position': 'relative', 'overflow': 'hidden'});
    //添加地图div
    $('#' + selector).append('<div id="' + selector + 'map" style="width: 100%;height: 100%"></div>');

    let selectorBox = $('#' + selector)[0];
    let selectorMap = $('#' + selector + 'map')[0];

    //  地图初始化配置
    let config = {
        centerPoint: {lng: 87.543446, lat: 43.921639}, // 初始化中心点
        mapZoom: 12,	     // 地图初始层级
        mapType: 'weixing',  // 初始地图类型 卫星  地图
        hasMapType: true,	 // 是否有地图类型切换
        isShowRoad: false,	 // 地图类型切换到卫星模式下，是否显示道路
        hasSearch: true,	 // 是否有搜索功能
        hasNControl: true,  // 是否显示缩放平移控件
    };
    if (bmapConfig) {
        for (var key in bmapConfig) {
            config[key] = bmapConfig[key];
        }
    }
    let map = null;

    map = new BMap.Map(selectorMap, {enableMapClick: false});	//初始化地图，禁止默认点击事件
    let poi = new BMap.Point(config.centerPoint.lng, config.centerPoint.lat); //设置中心点
    map.centerAndZoom(poi, config.mapZoom);   //设置地图展示层级
    map.enableScrollWheelZoom();	//允许滚轮缩放

    //是否左上角，添加默认缩放平移控件
    if (config.hasNControl) {
        map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
    }

    //初始显示地图类型   卫星：weixin  普通：ditu
    if (config.mapType == 'weixing') {
        map.setMapType(BMAP_SATELLITE_MAP);  // 使用卫星地图
    } else if (config.mapType == 'ditu') {
        map.setMapType(BMAP_NORMAL_MAP);     //使用普通地图
    } else {
        map.setMapType(BMAP_NORMAL_MAP);     //普通
    }


    //是否显示地图类型切换按钮
    if (config.hasMapType) {
        //判断地图类型
        if (config.mapType == 'weixing') {
            let MapTypeHtml = '<!-- 地图类型控制 -->' +
                '<div class="map-type">' +
                '<ul>' +
                '<li id="ditu"><span><i class="fa fa-map"></i>&nbsp;地图</span></li>' +
                '<li id="weixing" class="active"><span><i class="fa fa-globe"></i>&nbsp;卫星</span></li>' +
                '</ul>' +
                '</div>';
            $('#' + selector).append(MapTypeHtml);
        } else if (config.mapType == 'ditu') {
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
                    if (config.isShowRoad) {
                        map.setMapType(BMAP_HYBRID_MAP)
                    } else {
                        map.setMapType(BMAP_SATELLITE_MAP)
                    }
                }
            }
        });
    }

    // 是否有搜索功能
    if (config.hasSearch) {
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

    /**
     * 设置中心点
     * @param lng
     * @param lat
     * @param zoom
     */
    this.setCenter = function (lng, lat, zoom) {
        map.centerAndZoom(new BMap.Point(lng, lat), zoom)
    };

    /**
     * 展示普通点
     * @param lng
     * @param lat
     */
    this.showMarker = function (lng, lat) {
        let point = new BMap.Point(lng, lat);
        let marker;  //点
        marker = new BMap.Marker(point);
        map.addOverlay(marker);
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    };

    /**
     * 展示跳动点
     * @param lng
     * @param lat
     */
    this.showMarkerAnimantion = function (lng, lat) {
        let point = new BMap.Point(lng, lat);
        let marker;  //点
        marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    };

    /**
     * 展示带点标签
     * @param lng
     * @param lat
     * @param title
     * @param id
     * @param bool  识别行政 还是 区域
     */
    this.showLabelMarker = function (lng, lat, title, id, bool) {
        let point = new BMap.Point(lng, lat);

        let marker;  //点
        let label;   //标签
        //判断普通点   行政点
        if (bool) {
            marker = new BMap.Marker(point);
            let labelHtml = '<div class="" title="' + title + '" aid="' + id + '">' +
                '<p class="">' + title + '</p>' +
                '</div>';
            label = new BMap.Label(labelHtml, {offset: new BMap.Size(-25, -50)});
            label.setStyle({
                border: '1px',
                borderColor: '#438eb9',
                borderStyle: 'solid',
                fontSize: '18px',
                height: '38px',
                // lineHeight:'38px',
                borderRadius: "5px",
                padding: '5px'
            });
        } else {
            let adIcon = new BMap.Icon("location_centre.png", new BMap.Size(22, 33));
            marker = new BMap.Marker(point, {icon: adIcon});
            let labelHtml = '<div class="" title="' + title + '" aid="' + id + '">' +
                '<p class=""><i class="fa fa-flag"></i>' + title + '</p>' +
                '</div>';
            label = new BMap.Label(labelHtml, {offset: new BMap.Size(-45, -50)});
            label.setStyle({
                border: '1px',
                borderColor: '#cecece',
                borderStyle: 'solid',
                boxShadow: '2px 3px 6px #999',
                fontSize: '14px',
                background: '#fff',
                height: '35px',
                lineHeight: '24px'
            });
        }
        //
        marker.setLabel(label);
        map.addOverlay(marker);
    };


    /**
     * 添加 点击点  网格长联防队员警务站等
     * @param point
     */
    this.showIconMarker = function (point) {
        let pt = new BMap.Point(point.poi.lng, point.poi.lat);
        let myIcon = new BMap.Icon(point.icon, new BMap.Size(40, 40), {
            imageSize: new BMap.Size(32, 41)
        });
        let marker = new BMap.Marker(pt, {icon: myIcon});  // 创建标注

        marker.data = point.data;   //附带信息

        map.addOverlay(marker);  //添加到地图

        marker.addEventListener("click", function () {   //绑定点击事件
            this.openInfoWindow(addinfoWindow(point));
            console.log('绑定点击事件，打开infoWindow');
        });
    };


    /**
     * 添加maeker点的信息框
     * @param {Object} point
     */
    function addinfoWindow(point){

        let hContent = '';
        if( point.data.tag === 'police' ){
            hContent = '<p>警务站: '+point.data.name+'&nbsp;&nbsp;&nbsp;&nbsp;接警电话: '+point.data.phone+'</p>';
        }else if( point.data.tag === 'person' ){
            hContent = '<p>网格长: '+point.data.userName+'&nbsp;&nbsp;&nbsp;&nbsp;联系电话: '+point.data.telePhone+'</p>';
        }else if( point.data.tag === 'guard' ){
            hContent = '<p>联防队员: '+point.data.userName+'&nbsp;&nbsp;&nbsp;&nbsp;联系电话: '+point.data.telePhone+'</p>';
        }

        let sContent =
            '<div class="map-info-window" id="'+ point.data.id +'">'+
                '<div class="window-top">'+
                hContent+
                '</div>'+
                '<div class="window-con" id="message'+ point.data.id + '">'+

                '</div>'+
                '<div class="window-bot">'+
                    '<textarea autofocus rows="4"></textarea>'+
                    '<button>发送</button>'+
                '</div>'+
            '</div>';

        let infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        infoWindow.disableCloseOnClick();   // 点击地图关闭信息弹窗
        // 设置聊天窗口size
        infoWindow.setWidth(300);
        infoWindow.setHeight(500);
        infoWindow.data = point.data;

        infoWindow.addEventListener('open', function(){  // open
            console.log("open InfoWindow");
            console.log(this.data);

            let toid = this.data.id;


            $('#'+ point.data.id + ' button').click(function () {
                console.log("点击消息发送按钮");
                let messageCon = $('#'+ point.data.id + ' textarea').val();
                if(messageCon != ''){
                    console.log(messageCon);
                    sendMessage(toid,messageCon);
                    $('#'+ point.data.id + ' textarea').val('');
                    messageCon = '';
                }
            });

        } ,false);
        infoWindow.addEventListener('close', function(){    // close
            console.log("close infoWindow");
            $('#'+ point.data.id + ' textarea').val('');
            messageCon = '';
        }, false);
        return infoWindow;
    }












    /**
     * 建立多边形覆盖
     * @param points
     * @param color
     */
    this.showPolygon = function (points, color) {
        let pointArr = points.map(function (item) {
            let lng = item.lng;
            let lat = item.lat;
            lng = Number(lng);
            lat = Number(lat);
            return new BMap.Point(lng, lat)
        });
        let polygon = new BMap.Polygon(pointArr, {
            strokeStyle: 'dashed',	//边界线样式 solid/dashed
            strokeWeight: 1, 		//边框宽度
            strokeColor: color ? color : '#00FFFF',	    //边框色值
            strokeOpacity: 0.8,		//边框透明度
            fillColor: color ? color : '#00FFFF',	    //覆盖物颜色
            fillOpacity: 0.5	    //覆盖物透明度
        });
        map.addOverlay(polygon);
    };



    /**
     * 用于存放 画点 画线的数据
     */
    let roadPoints    = [];  // 路线数据
    let locPoints     = [];  // 位置数据


    let styleOptions = {
        strokeColor:"blue",    //边线颜色。
        // fillColor:"red",    //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed', //边线的样式，solid或dashed。
        enableEditing : true   //编辑模式
    };

    /**
     * 启用画点画线功能
     * @param type
     * @constructor
     */
    this.DrawingManager = function (type) {
        //http://api.map.baidu.com/library/DrawingManager/1.4/docs/symbols/BMapLib.DrawingManager.html

        let MapTypeHtml = '<!-- 绘制工具操作 -->\n' +
            '<div class="drawing-manager">\n' +
            // '<a class="map-opt-center"><i class="fa fa-dot-circle-o" aria-hidden="true"></i><span>中心</span></a>\n' +
            '<a class="map-opt-point"><i class="fa fa-location-arrow" aria-hidden="true"></i><span>单点</span></a>\n' +
            '<a class="map-opt-region"><i class="fa fa-lemon-o" aria-hidden="true"></i><span>区域</span></a>\n' +
            '<a class="map-opt-clear"><i class="fa fa-trash" aria-hidden="true"></i><span>清除</span></a>\n' +
            '</div>';
        $('#' + selector).append(MapTypeHtml);


        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });

        $('#' + selector + ' .map-opt-center').click(function () {
            // 画点
            specialPointMode = true;
            drawingManager.open();
            drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
        });

        $('#' + selector + ' .map-opt-point').click(function () {
            // 画点
            specialPointMode = false;
            drawingManager.open();
            drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
        });

        $('#' + selector + ' .map-opt-region').click(function () {
            //画线
            drawingManager.open();
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
        });
        $('#' + selector + ' .map-opt-clear').click(function () {
            // 清空
            map.clearOverlays();
            if(drawingManager) {
                drawingManager.close();
            }
            roadPoints = [];  // 路线数据，二位数组，子数组为点数组roadPoints[i] 为路线
            locPoints  = [];  // 位置数据，点数组
        });

        //监听绘制点事件
        drawingManager.addEventListener("markercomplete", function(e, overlay) {
            // console.log(overlay);
            roadPoints.push(overlay);
        });

        //监听绘制多边形事件
        drawingManager.addEventListener("polylinecomplete", function(e, overlay) {
            // console.log(overlay);
            locPoints.push(overlay);
        });
    };

    /**
     * 画点画线返回数据
     * @constructor
     */
    this.DrawingManagerData = function () {
        console.log(roadPoints);
        console.log(locPoints);
    };

    /**
     * 将画点数据展示在地图上  与画点画线功能无关
     * @param data
     */
    this.showDrawMarker = function(data) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let point = new BMap.Point(item.lng, item.lat);
            let marker = new BMap.Marker(point);
            map.addOverlay(marker);
            locPoints.push(point);
        }
    };

    /**
     * 将画线数据展示在地图上  与画点画线功能无关
     * @param data
     */
    this.showDrawLines = function(data) {
        let points = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let point = new BMap.Point(item.lng, item.lat);
            points.push(point);
        }
        let polyline = new BMap.Polyline(points, styleOptions);
        map.addOverlay(polyline);
        let index = roadPoints.length;
        roadPoints.push(polyline.getPath());
        polyline.addEventListener('lineupdate', function(event) {
            roadPoints[index] = event.target.ia;
        });
    };

    /**
     *
     */
}

