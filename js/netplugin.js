/*
 * @Author: Kai.Jiang 
 * @Date: 2018-01-23 20:48:16 
 * @Last Modified by: Kai.Jiang
 * @Last Modified time: 2018-01-23 20:55:27
 */

/******************************************************功能变量、方法****************************************************/
var sdk_viewer = null; // 控件（插件）对象
var isLogin = false;
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
            //alert(strAlarmInfo);
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

//流类型
var StreamType = {
    LIVE: 0, //实况流
    PICTRUE: 1, //抓拍流（jpeg）
    MJPEG: 2, //照片流
    IMAGE_TYPE_PLATE: 3, //过车图片流
    PIC_VIEW: 4 //图片查看
};

var PtzCmd = {
    TILTUP: 0x0402, // 向上
    TILTDOWN: 0x0404, // 向下
    PANRIGHT: 0x0502, // 向右
    PANLEFT: 0x0504, // 向左
    LEFTUP: 0x0702, // 左上
    LEFTDOWN: 0x0704, // 左下
    RIGHTUP: 0x0802, // 右上
    RIGHTDOWN: 0x0804, // 右下
    ALLSTOP: 0x0901 // 全停命令字
}
var PresetCmd = {
    SET_PRESET: 0, // 设置预置位
    CLE_PRESET: 1, // 清除预置位
    GOTO_PRESET: 2 // 转到预置位
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

var MediaFileFormat = {
    MEDIA_FILE_MP4: 0, // mp4格式的媒体文件
    MEDIA_FILE_TS: 1 // TS格式的媒体文件  TS media file */
}

var PictureFormat = {
    PICTURE_BMP: 0, // 图片格式为bmp格式
    PICTURE_JPG: 1 // 图片格式为jpg格式
}

var EventType = {
    ALL: 0, // 所有的存储
    MOTIONDETECTION: 4, // 运动检测事件存储
    DIGITALINPUT: 5, // 数字输入事件存储
    VIDEOLOSS: 7, // 视频丢失事件存储
    INVALID: 0xFF // 无效值
}
var PlayControl = {
    NETDEV_PLAY_CTRL_PLAY: 0,
    /* 开始播放  Play */
    NETDEV_PLAY_CTRL_PAUSE: 1,
    /* 暂停播放  Pause */
    NETDEV_PLAY_CTRL_RESUME: 2,
    /* 恢复播放  Resume */
    NETDEV_PLAY_CTRL_GETPLAYTIME: 3,
    /* 获取播放进度  Obtain playing time */
    NETDEV_PLAY_CTRL_SETPLAYTIME: 4,
    /* 设置播放进度  Configure playing time */
    NETDEV_PLAY_CTRL_GETPLAYSPEED: 5,
    /* 获取播放速度  Obtain playing speed */
    NETDEV_PLAY_CTRL_SETPLAYSPEED: 6,
    /* 设置播放速度  Configure playing speed */
    NETDEV_PLAY_CTRL_SINGLE_FRAME: 7 /* 设置单帧播放  Configure single frame playing speed */
}

/****************************************初始化控件begin****************************************/
var resultList = [];
//			cfg["stUserInfo"]["User"] = document.getElementById("userName").value; // 用户名
//			cfg["stUserInfo"]["Password"] = document.getElementById("password").value; // 密码
//			cfg["stPortInfo"]["szDeviceIp"] = document.getElementById("cameraIp").value; // 相机IP

$("#playerContainer").show();
sdk_viewer = new Utils.Player(cfg); //初始化控件
var retcode = sdk_viewer.execFunction("NetSDKSetPlayWndNum", 9); //分屏
if (0 != retcode) {
    alert("实况窗口实例化失败");
}
var DeviceHandle = -1;
var CloudHandle = -1;

//			console.log(sdk_viewer)
/****************************************初始化控件end****************************************/

// 云登录
function Cloudlogin() {
    var SDKRet = -1;
    var SDKRet = sdk_viewer.execFunction("NETDEV_LoginCloud", "http://ezcloud.uniview.com/", "j00504","fb58dc95b011a5efd7879717feff598d");
    if (-1 == SDKRet) {
        alert("云登录失败");
    } else {
        CloudHandle = SDKRet;
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
        alert("设备登录失败");
    } else {
        var result = JSON.parse(SDKRet);
        DeviceHandle = result.UserID;
        document.getElementById("start").disabled = false;

        //					$("#playerContainer").css("height", "400px");

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
        document.getElementById("start").disabled = false;
        document.getElementById("stop").disabled = false;
    }
}

// 停流
function stopVideo() {
    var ResourceId = sdk_viewer.execFunction("NetSDKGetFocusWnd");
    var retcode = sdk_viewer.execFunction("NETDEV_StopRealPlay", parseInt(ResourceId)); //关闭视频流
    if (0 != retcode) {
        alert("停流失败。");
    } else {
        document.getElementById("start").disabled = false;
        document.getElementById("stop").disabled = true;

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
            alert("设备登录失败");
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
            alert("播放实况失败。");
        } else {
//						document.getElementById("start").disabled = false;
//						document.getElementById("stop").disabled = false;
        }

    }

}
