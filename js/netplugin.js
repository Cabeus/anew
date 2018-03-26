
/******************************************************功能变量、方法****************************************************/
var videoFlagTag = '';




var Main = {
    EventMap: ""
};
Main.EventMap = (function () {
    var closure = {
        formatExceotionCode: function (u32ExceptionCode) {
            u32ExceptionCode = u32ExceptionCode.split(',');
            return parseInt(u32ExceptionCode, 10);
        },
        formatTaskNo: function (u32Task_No) {
            u32Task_No = u32Task_No.split(',');
            return parseInt(u32Task_No, 10);
        }
    };
    return {
        /* 告警事件上报 */
        __200: function (strAlarmInfo) {
            console.log(strAlarmInfo);
        }
    };
})();


var LiveStream = {
    LIVE_STREAM_INDEX_MAIN: 0, // 主流
    LIVE_STREAM_INDEX_AUX: 1, // 辅流
    LIVE_STREAM_INDEX_THIRD: 2 // 第三流
};

var Protocal = {
    TRANSPROTOCAL_RTPTCP: 1, //TCP
    TRANSPROTOCAL_RTPUDP: 2 // UDP
};



var sdk_viewer = null; // 控件（插件）对象

var cfg = {
    id: "player", //加载的activex控件id
    container: "playerContainer", //控件/插件的父节点
    name: "sdk_viewer", //实例对象的名称，用于设置napi上报事件的入参
    events: Main.EventMap, //控件事件map
    stPortInfo: {
        szDeviceIp: "",
        szLocalIp: "",
    }, //端口信息
    stUserInfo: { //用户登录信息
        User: "",
        Password: ""
    },
    maxWnd: 64, //控件动态创建窗格的个数，不小于最大通道路数,默认64路 (可选)
    focusColor: 'ffcc00', //窗格获得焦点时的边框颜色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    unfocusColor: '747d7d', //窗格未获得焦点时的边框颜色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    backgColor: '373737', //控件背景色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    // noCreateWnd: 'true'
};




var sdk_viewerList2 = null; // 控件（插件）对象

var cfgList2 = {
    id: "player3", //加载的activex控件id
    container: "playerContainerList2", //控件/插件的父节点
    name: "sdk_viewerList2", //实例对象的名称，用于设置napi上报事件的入参
    events: Main.EventMap, //控件事件map
    stPortInfo: {
        szDeviceIp: "",
        szLocalIp: "",
    }, //端口信息
    stUserInfo: { //用户登录信息
        User: "",
        Password: ""
    },
    maxWnd: 64, //控件动态创建窗格的个数，不小于最大通道路数,默认64路 (可选)
    focusColor: 'ffcc00', //窗格获得焦点时的边框颜色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    unfocusColor: '747d7d', //窗格未获得焦点时的边框颜色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    backgColor: '373737', //控件背景色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    // noCreateWnd: 'true'
};



var sdk_viewer2 = null; // 控件（插件）对象

var cfg2 = {
    id: "player2", //加载的activex控件id
    container: "playerContainer2", //控件/插件的父节点
    name: "sdk_viewer2", //实例对象的名称，用于设置napi上报事件的入参
    events: Main.EventMap, //控件事件map
    stPortInfo: {
        szDeviceIp: "",
        szLocalIp: "",
    }, //端口信息
    stUserInfo: { //用户登录信息
        User: "",
        Password: ""
    },
    maxWnd: 64, //控件动态创建窗格的个数，不小于最大通道路数,默认64路 (可选)
    focusColor: 'ffcc00', //窗格获得焦点时的边框颜色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    unfocusColor: '747d7d', //窗格未获得焦点时的边框颜色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    backgColor: '373737', //控件背景色，注意：参数形如'xxxxxx'，为颜色的16进制，以b g r 顺序，而不是r g b (可选)
    // noCreateWnd: 'true'
};





/****************************************初始化控件begin****************************************/


sdk_viewer = new Utils.Player(cfg); //初始化控件
var retcode = sdk_viewer.execFunction("NetSDKSetPlayWndNum", 9); //分屏
if (0 != retcode) {
    //视频窗口实例化失败
    layer.msg('视频加载失败',{
        time:2000,
        icon:2
    },function () {

    })
}



sdk_viewerList2 = new Utils.Player(cfgList2); //初始化控件
var retcodeList2 = sdk_viewerList2.execFunction("NetSDKSetPlayWndNum", 9); //分屏
if (0 != retcodeList2) {
    //视频窗口实例化失败
    layer.msg('视频加载失败',{
        time:2000,
        icon:2
    },function () {

    })
}


sdk_viewer2 = new Utils.Player(cfg2); //初始化控件
var retcode2 = sdk_viewer2.execFunction("NetSDKSetPlayWndNum", 1); //分屏
if (0 != retcode2) {
    //视频窗口实例化失败
    layer.msg('视频加载失败',{
        time:2000,
        icon:2
    },function () {

    })
}


var DeviceHandle = -1;
var CloudHandle = -1;

/****************************************初始化控件end****************************************/


//本地设备登录
function localLoginList1() {
    var SDKRet = -1;
    var SDKRet = sdk_viewer.execFunction("NETDEV_Login", "117.190.234.42", "39998", "admin","123456ABCabc");
    if (-1 == SDKRet) {
        //本地登录失败
        layer.msg('视频获取失败',{
            time:2000,
            icon:2
        },function () {

        })
    } else {
        // CloudHandle = SDKRet;
        var result = JSON.parse(SDKRet);
        DeviceHandle = result.UserID;
    }
}



//本地设备登录
function localLoginList2() {
    var SDKRetList2 = -1;
    var SDKRetList2 = sdk_viewerList2.execFunction("NETDEV_Login", "117.190.234.42", "39998", "admin","123456ABCabc");
    if (-1 == SDKRetList2) {
        //本地登录失败
        layer.msg('视频获取失败',{
            time:2000,
            icon:2
        },function () {

        })
    } else {
        // CloudHandle = SDKRet;
        var result = JSON.parse(SDKRetList2);
        DeviceHandle = result.UserID;
    }
}


function localLogin2(port) {
    var SDKRet2 = -1;
    var SDKRet2 = sdk_viewer2.execFunction("NETDEV_Login", "117.190.234.42", port, "admin","123456ABCabc");
    if (-1 == SDKRet2) {
        //本地登录失败
        layer.msg('视频获取失败',{
            time:2000,
            icon:2
        },function () {

        })
    } else {
        // CloudHandle = SDKRet2;
        var result = JSON.parse(SDKRet2);
        DeviceHandle = result.UserID;
    }
}

/************************************************实况 相关**************************************************/
// 启流
function startVideoList1() {
    for(let i = 0; i<9; i++){
        setTimeout(function () {
            var dataMap = {
                dwChannelID: i+1,
                dwStreamType: LiveStream.LIVE_STREAM_INDEX_AUX,
                dwLinkMode: Protocal.TRANSPROTOCAL_RTPTCP,
                dwFluency: 1
            }

            jsonStr = JSON.stringify(dataMap);
            var ResourceId = i;

            var retcode = sdk_viewer.execFunction("NETDEV_RealPlay", parseInt(ResourceId), DeviceHandle, jsonStr);
            if (0 != retcode) {
                // 视频播放失败
                layer.msg('视频播放失败',{
                    time:2000,
                    icon:2
                },function () {

                })
            } else {
                console.log('视频播放成功')
            }
        },100)
    }
}


function startVideoList2() {
    for(let i = 0; i<9; i++){
        setTimeout(function () {
            var dataMap = {
                dwChannelID: i+1,
                dwStreamType: LiveStream.LIVE_STREAM_INDEX_AUX,
                dwLinkMode: Protocal.TRANSPROTOCAL_RTPTCP,
                dwFluency: 1
            };

            jsonStr = JSON.stringify(dataMap);
            var ResourceId = i;

            var retcode = sdk_viewerList2.execFunction("NETDEV_RealPlay", parseInt(ResourceId), DeviceHandle, jsonStr);
            if (0 != retcode) {
                // 视频播放失败
                layer.msg('视频播放失败',{
                    time:2000,
                    icon:2
                },function () {

                })
            } else {

            }
        },100)
    }
}


// 停流
function stopVideo() {
    var ResourceId = sdk_viewer.execFunction("NetSDKGetFocusWnd");
    var retcode = sdk_viewer.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
    if (0 != retcode) {

    } else {

    }
}

function stopVideoList1() {
    for(let i = 0; i<8; i++){
        setTimeout(function () {
            var ResourceId = i;
            var retcode = sdk_viewerList2.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
            if (0 != retcode) {

            } else {

            }
        },50)
    }
}

function stopVideoList2() {
    for(let i = 0; i<8; i++){
        setTimeout(function () {
            var ResourceId = i;
            var retcode = sdk_viewerList2.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
            if (0 != retcode) {

            } else {

            }
        },50)
    }
}

function getVideoList1() {
    // stopVideoList2();
    setTimeout(function () {
        localLoginList1();
        startVideoList1();
    },200);
}

// function getVideoList2() {
//     stopVideoList1();
//     setTimeout(function () {
//         localLoginList2();
//         startVideoList2();
//     },1000);
// }

// setTimeout(function () {
//     localLogin2();
// },1500);



function playVideo(dwChannelID) {
    $('.video-box').show();
    $('.video-box').css({"width": "970px", "height": "613px"})
    setTimeout(function () {
        var SDKRet2 = 0;
        $('#playerContainer2').css({"width": "100%", "height": "522px"})

        var dataMap2 = {
            dwChannelID: dwChannelID,
            dwStreamType: LiveStream.LIVE_STREAM_INDEX_AUX,
            dwLinkMode: Protocal.TRANSPROTOCAL_RTPTCP,
            dwFluency: 1
        }

        jsonStr = JSON.stringify(dataMap2);
        var ResourceId = 0;
        var retcode = sdk_viewer2.execFunction("NETDEV_RealPlay", parseInt(ResourceId), DeviceHandle, jsonStr);
        if (0 != retcode) {
            // 视频播放失败
            layer.msg('视频播放失败',{
                time:2000,
                icon:2
            },function () {

            })
        } else {

        }

    }, 200)
}
//
function stopVideo1() {
    var ResourceId = 0;
    var retcode = sdk_viewer2.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
    if (0 != retcode) {


    } else {

    }
}


