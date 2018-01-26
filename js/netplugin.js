/*
 * @Author: Kai.Jiang 
 * @Date: 2018-01-23 20:48:16 
 * @Last Modified by: Kai.Jiang
 * @Last Modified time: 2018-01-26 14:16:17
 */

/******************************************************功能变量、方法****************************************************/
var sdk_viewer = null; // 控件（插件）对象
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
}

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

$("#playerContainer").show();

sdk_viewer = new Utils.Player(cfg); //初始化控件
var retcode = sdk_viewer.execFunction("NetSDKSetPlayWndNum", 9); //分屏
if (0 != retcode) {
    alert("实况窗口实例化失败");
}

sdk_viewer2 = new Utils.Player(cfg2); //初始化控件
var retcode2 = sdk_viewer2.execFunction("NetSDKSetPlayWndNum", 1); //分屏
if (0 != retcode2) {
    alert("实况窗口实例化失败");
}


var DeviceHandle = -1;
var CloudHandle = -1;

//			console.log(sdk_viewer)
/****************************************初始化控件end****************************************/

// 云登录
function Cloudlogin() {
    var SDKRet = -1;
    var SDKRet = sdk_viewer.execFunction("NETDEV_LoginCloud", "http://ezcloud.uniview.com/", "j00504", "fb58dc95b011a5efd7879717feff598d");
    if (-1 == SDKRet) {
        alert("云登录失败");
    } else {
        CloudHandle = SDKRet;
    }
}

function Cloudlogin2() {
    var SDKRet = -1;
    var SDKRet2 = sdk_viewer2.execFunction("NETDEV_LoginCloud", "http://ezcloud.uniview.com/", "j00504", "fb58dc95b011a5efd7879717feff598d");
    if (-1 == SDKRet2) {
        alert("云登录失败");
    } else {
        CloudHandle = SDKRet2;
    }
}


// 获取设备列表
function GetCloudDevList() {
    var SDKRet = sdk_viewer.execFunction("NETDEV_GetCloudDevList", CloudHandle);
    if (1 != SDKRet) {
        alert(SDKRet);
    } else {
        alert("设备发现失败");
    }
}

// 设备登录
function Devlogin() {
    var SDKRet = 0;
    var dataMap = {
        szDeviceName: document.getElementById("CloudDevname").value,
        szDevicePassword: document.getElementById("CloudDevPassword").value,
        dwT2UTimeout: 0
    }

    jsonStr = JSON.stringify(dataMap);
    var SDKRet = sdk_viewer.execFunction("NETDEV_LoginCloudDev", CloudHandle, jsonStr);
    if (-1 == SDKRet) {
        // alert("设备登录失败");
    } else {
        var result = JSON.parse(SDKRet);
        DeviceHandle = result.UserID;
        DevisLogin = true;

    }
}

/************************************************实况 相关**************************************************/
// 启流
function startVideo() {
    var dataMap = {
        dwChannelID: 1,
        dwStreamType: LiveStream.LIVE_STREAM_INDEX_MAIN,
        dwLinkMode: Protocal.TRANSPROTOCAL_RTPTCP,
        dwFluency: 0
    }

    jsonStr = JSON.stringify(dataMap);
    var ResourceId = sdk_viewer.execFunction("NetSDKGetFocusWnd");

    console.log(ResourceId)

    var retcode = sdk_viewer.execFunction("NETDEV_RealPlay", parseInt(ResourceId), DeviceHandle, jsonStr);
    if (0 != retcode) {
        alert("播放实况失败。");
    } else {

    }
}

// 停流
function stopVideo() {
    var ResourceId = sdk_viewer.execFunction("NetSDKGetFocusWnd");
    var retcode = sdk_viewer.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
    if (0 != retcode) {
        alert("停流失败。");
    } else {

    }
}

function getVideo() {
    Cloudlogin();
    //获取列表
    let data = [{
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }, {
        username: 'Device0002',
        password: ''
    }]

    for (let i in data) {
        // for(var i = 0;i<= data.length;i++){
        setTimeout(function () {
            // requestAnimationFrame(function () {
            // alert(i)
            let username = data[i].username;
            let password = data[i].password;
            var SDKRet = 0;
            var dataMap1 = {
                szDeviceName: username,
                szDevicePassword: password,
                dwT2UTimeout: 0
            }
            jsonStr = JSON.stringify(dataMap1);
            var SDKRet = sdk_viewer.execFunction("NETDEV_LoginCloudDev", CloudHandle, jsonStr);
            if (-1 == SDKRet) {
                console.log("设备登录失败" + i);
            } else {
                let result = JSON.parse(SDKRet);
                DeviceHandle = result.UserID;
                DevisLogin = true;
            }

            var dataMap2 = {
                dwChannelID: 1,
                dwStreamType: LiveStream.LIVE_STREAM_INDEX_MAIN,
                dwLinkMode: Protocal.TRANSPROTOCAL_RTPTCP,
                dwFluency: 0
            }

            jsonStr = JSON.stringify(dataMap2);
            var ResourceId = i;
            var retcode = sdk_viewer.execFunction("NETDEV_RealPlay", parseInt(ResourceId), DeviceHandle, jsonStr);
            if (0 != retcode) {
                console.log("播放实况失败。" + i);
            } else {

            }
        }, 0);
        // })
    }

};

Cloudlogin2();

function playVideo(username, password) {
    $('.video-box').show();
    $('.video-box').css({"width": "970px", "height": "613px"})
    setTimeout(function () {
        var SDKRet2 = 0;
        var dataMap1 = {
            szDeviceName: username,
            szDevicePassword: password,
            dwT2UTimeout: 0
        }
        jsonStr = JSON.stringify(dataMap1);
        var SDKRet2 = sdk_viewer2.execFunction("NETDEV_LoginCloudDev", CloudHandle, jsonStr);

        if (-1 == SDKRet2) {
            console.log("设备登录失败");
        } else {
            let result = JSON.parse(SDKRet2);
            DeviceHandle = result.UserID;
            DevisLogin = true;
            $('#playerContainer2').css({"width": "100%", "height": "522px"})
        }

        var dataMap2 = {
            dwChannelID: 1,
            dwStreamType: LiveStream.LIVE_STREAM_INDEX_MAIN,
            dwLinkMode: Protocal.TRANSPROTOCAL_RTPTCP,
            dwFluency: 0
        }

        jsonStr = JSON.stringify(dataMap2);
        var ResourceId = 0;
        var retcode = sdk_viewer2.execFunction("NETDEV_RealPlay", parseInt(ResourceId), DeviceHandle, jsonStr);
        if (0 != retcode) {
            console.log("播放实况失败。");
        } else {

        }

    }, 200)
}

function stopVideo1() {
    var ResourceId = 0;
    var retcode = sdk_viewer2.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
    if (0 != retcode) {
        console.log("停流失败。");
    } else {

    }
}


