

/******************************************************功能变量、方法****************************************************/
var sdk_viewer2 = null; // 控件（插件）对象

var Main = {
    EventMap: ""
}
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
}
//
var LiveStream = {
    LIVE_STREAM_INDEX_MAIN: 0, // 主流
    LIVE_STREAM_INDEX_AUX: 1, // 辅流
    LIVE_STREAM_INDEX_THIRD: 2 // 第三流
}

var Protocal = {
    TRANSPROTOCAL_RTPTCP: 1, //TCP
    TRANSPROTOCAL_RTPUDP: 2 // UDP
}

/****************************************初始化控件begin****************************************/

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

// 云登录

// function Cloudlogin2() {
//     var SDKRet = -1;
//     var SDKRet2 = sdk_viewer2.execFunction("NETDEV_LoginCloud", "http://ezcloud.uniview.com/", "j00504", "fb58dc95b011a5efd7879717feff598d");
//     if (-1 == SDKRet2) {
//         console.log("云登录失败");
//     } else {
//         CloudHandle = SDKRet2;
//     }
// }
//本地登录
function localLogin2() {
    var SDKRet = -1;
    var SDKRet2 = sdk_viewer2.execFunction("NETDEV_Login", "192.168.1.30", "80", "admin","654321");
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

setTimeout(function () {
    localLogin2();
},1500);

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
        // console.log("停流失败。");
        // layer.msg('视频停止播放失败',{
        //     time:2000,
        //     icon:2
        // },function () {
        //
        // })
    } else {

    }
}


