/**
 * 环信视频通话
 */

var remoteVideoSrcObj;
var webVideoWin;
var webVideoWinData;

var rtcCall = new WebIM.WebRTC.Call({
    connection: conn,
    mediaStreamConstaints: {
        audio: true,
        video: true
    },
    listener: {
        onAcceptCall: function (from, options) {
            console.log('onAcceptCall::', 'from: ', from, 'options: ', options);
        },
        //通过streamType区分视频流和音频流，streamType: 'VOICE'(音频流)，'VIDEO'(视频流)
        onGotRemoteStream: function (stream, streamType) {
            console.log('onGotRemoteStream::', 'stream: ', stream, 'streamType: ', streamType);
            // var video = document.getElementById('remote-video');
            // video.srcObject = stream;
            remoteVideoSrcObj = stream;
        },
        onGotLocalStream: function (stream, streamType) {
            console.log('onGotLocalStream::', 'stream:', stream, 'streamType: ', streamType);
            var video = document.getElementById('local-video');
            video.srcObject = stream;
        },
        onRinging: function (caller) {
            console.log('onRinging::', 'caller:', caller);
            let from = caller.replace(/zxww#zxwavebesafe_/,'').replace(/@easemob.com/,'');
            ReceiveVdeo(from);
            setThirdPartyStatus(1);
        },
        onTermCall: function (reason) {
            console.log('onTermCall::');
            console.log('reason:', reason);
        },
        onIceConnectionStateChange: function (iceState) {
            console.log('onIceConnectionStateChange::', 'iceState:', iceState);


            if(iceState == 'closed'){

                setThirdPartyStatus(0);
                stopMusic();

                $('.video-yes-no').hide();
                if(webVideoWin != ''){
                    layer.close(webVideoWin);
                }
                layer.msg('通话结束',{
                    time:1500,
                    // icon:2
                },function () {

                })
            }

        },
        onError: function (e) {
            console.log(e);
            stopMusic();
            if(e.message == 'Requested device not found'){  //谷歌
                $('.web-video-win').append('<div class="video-not-found">' +
                    '<img src="'+ctx+'/static/anew/img/video-not-found.png" alt="">' +
                    '<span class="end-call-video" onclick="endCall()"></span>' +
                    '</div>')
            }else if(e.message == "The object can not be found here."){ //火狐
                $('.web-video-win').append('<div class="video-not-found">' +
                    '<img src="'+ctx+'/static/anew/img/video-not-found.png" alt="">' +
                    '<span class="end-call-video" onclick="endCall()"></span>' +
                    '</div>')
            }
        }
    }
});


// 视频呼叫对方
// var call = function () {
//     rtcCall.caller = '16058ffd24c0002';
//     rtcCall.makeVideoCall('16055fbd4480006');
// };
// 音频呼叫对方
// var call = function () {
//     rtcCall.caller = '16055fbd4480006';
//     rtcCall.makeVoiceCall('16058ffd24c0002');
// };
// 关掉/拒绝视频
var endCall = function () {

    setThirdPartyStatus(0);

    stopMusic();

    rtcCall.endCall();
    $('.video-yes-no').hide();
    if(webVideoWin != ''){
        layer.close(webVideoWin);
    }
};
// 接受对方呼叫
var acceptCall = function () {

    setThirdPartyStatus(1);

    stopMusic();

    rtcCall.acceptCall();
    $('.video-yes-no').hide();
    webVideoWin = layer.open({
        title: webVideoWinData.name,
        type: 1,
        shade: 0,
        skin: 'web-video-win', //样式类名
        area: ['538ppx', '362px'],
        closeBtn: 0, //不显示关闭按钮
        anim: 0,
        shadeClose: false, //开启遮罩关闭
        content: '<div class="video-con">' +
        '<video id="remote-video" class="user-video" autoplay></video>' +
        '<video id="local-video" class="admin-video" autoplay muted></video>' +
        '</div>' +
        '<div class="state-bar">' +
        '<span>通话时长 <span  id="talk-time">00:00</span></span>' +
        '<span class="end-call-video" onclick="endCall()"><img src="'+ ctx+ '/static/anew/img/video-no.png" alt=""></span>' +
        '</div>',
        success: function(layero, index){
            time_fun();
            var video = document.getElementById('remote-video');
            // video.srcObject = stream;
            video.srcObject = remoteVideoSrcObj;
        }
    });
};

// document.getElementById('rtCall').onclick = call;
// document.getElementById('rtEndCall').onclick = endCall;
// document.getElementById('rtAcceptCall').onclick = acceptCall;

/**
 * 有新的视频通话时
 * @param from
 * @constructor
 */
function ReceiveVdeo(from) {
    $.ajax({
        type: "POST",
        url:  ctx + '/user/getByThirdParty/' + from,
        dataType: 'json',
        data: {},
        async: false,
        success: function(data) {

            $('.chat-window').show();
            playMusic();

            let target = data.target;
            console.log(target)
            webVideoWinData = target;
            if(webVideoWinData.icon == ''){
                webVideoWinData.icon = ctx + "/static/anew/img/icon-header-head.png";
            }
            getReportAddress(webVideoWinData.longitude,webVideoWinData.latitude);
            $('.video-yes-no').show();
            $('.user-details').empty();
            $('.user-details').append('<div class="img-icon">' +
                '<img src="'+webVideoWinData.icon+'" alt="">' +
                '</div>' +
                '<div class="details-con">' +
                '<div id="details-name">报警人：'+webVideoWinData.name+'</div>' +
                '<div id="details-cellphone">联系电话：'+webVideoWinData.cellPhone+'</div>' +
                '<div id="alarm-time">报警时间：'+ getNowFormatDate() +'</div>' +
                '<div id="details-address">住址：'+webVideoWinData.address+'</div>' +
                '<div id="alarm-add">上报位置：</div>' +
                '</div>');

        }
    });

}


/**
 * 获取当前时间
 * @returns {string}
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function getReportAddress(longitude,latitude) {
    var geoc = new BMap.Geocoder();
    var pt = new BMap.Point( longitude,latitude );
    geoc.getLocation(pt, function(rs){
        var addComp = rs.addressComponents;
        address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
        console.log(address)
        $('#alarm-add').text('上报位置：'+address)
    });
}

/**
 * 计时器
 */
var timeIn;
function time_fun() {
    clearTimeout(timeIn);
    var sec=0;
    timeIn = setInterval(function () {
        sec++;
        var date = new Date(0, 0);
        date.setSeconds(sec);
        var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
        document.getElementById("talk-time").innerText = two_char(m) + ":" + two_char(s);
    }, 1000);
    function two_char(n) {
        return n >= 10 ? n : "0" + n;
    }
}

/**
 * 设置后台接听状态
 * @param status
 */
function setThirdPartyStatus(status){
    getSocketData(benefitType,status);
}


