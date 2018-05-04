//设置全局内容的高度
$(document).ready(function () {
    var height = $(window).height() - 88;
    $('.aside').height(height);
    $('.main-content').height(height - 20);
    $('.main-content-two').height(height - 64);
});
$(window).resize(function () {
    var height = $(window).height() - 88;
    $('.aside').height(height);
    $('.main-content').height(height - 20);
    $('.main-content-two').height(height - 64);
});
//地区选择下拉框
$('.single-dropdown').mouseenter(function () {
    $(this).children('.single-ul').slideDown(0)
});
$('.single-dropdown').mouseleave(function () {
    $(this).children('.single-ul').slideUp(0)
});


//拼接导航栏链接
$(document).ready(function () {
    // 获取当前页面地址
    let thisUrl = window.location.href;
    // let index = window.location.href.lastIndexOf(ctx);
    // let thisUrl=window.location.href.substring(index+8,window.location.href.length);
    $('.navigation-links').each(function () {
        if (this.href.indexOf('/index/backtrack?') != -1) {
            $(this).attr("href", $(this).attr("href") + thisUrl);
        }
    });
});


//header 菜单的选中状态
$(document).ready(function () {
    var url = window.location.href;
    //header 中间按钮
    if (url.indexOf('/index/loginMap') != -1) {
        $('.nav-center ul li.li-home').addClass('active');
    } else if (url.indexOf('/index/login') != -1 || url.indexOf('/residentStatistics/home?') != -1) {
        $('.nav-center ul li.li-statistics').addClass('active');
    } else {
        if (url.indexOf('/user/list') != -1 || url.indexOf('/admin/list') != -1 || url.indexOf('/index/command') != -1) {
            //
        } else {
            $('.nav-center ul li.li-wisdom').addClass('active');
        }
    }
    //header 右侧设置按钮
    if (url.indexOf('/user/list') != -1 || url.indexOf('/admin/list') != -1) {
        $('.setup').addClass('active');
    }
    //二级菜单
    if (url.indexOf('/index/login') != -1) {
        $('.two-menu ul li').eq(0).addClass('active');
    } else if (url.indexOf('/residentStatistics/home?') != -1) {
        $('.two-menu ul li').eq(1).addClass('active');
    }
});

//左侧菜单栏的打开与收起
$(document).ready(function () {
    var url = window.location.href;
    $("#nav-functions a").each(function () {
        if ($(this).attr("href") == url) {
            if (url.indexOf('/admin/coming') != -1) { //判断是否为敬请期待页-coming
                $(this).parent().addClass("active")
            } else {
                $(this).parent().addClass("active").parent().attr("style", "display: block;").parent().addClass("open");
            }
        } else if ($(this).attr("href").indexOf(url.split("back=")[1]) != -1) {
            $(this).parent().addClass("active").parent().attr("style", "display: block;").parent().addClass("open");
        } else if ($(this).attr("href").indexOf(url.split("Member")[0]) != -1) {
            $(this).parent().addClass("active").parent().attr("style", "display: block;").parent().addClass("open");
        }
    });
});

//判断是否显示返回键
$(document).ready(function () {
    var url = window.location.href;
    // var num=url.substring(url.lastIndexOf('/')+1);
    // if(!isNaN(num)){
    //    url = url.substring(0,url.lastIndexOf('/')+1)+'0';
    // }
    if (adminIsTrue) {
        $('#backjump').show();
        $('#backjump').attr('href', ctx + '/index/backtrack?back=' + url);
        console.log(ctx + '/index/backtrack?back=' + url);
        console.log($('#backjump').attr('href'));
    } else {
        $('#backjump').hide();
    }
});


//消息提示框
$(".message").mouseenter(function (event) {
    // event.stopPropagation();
    // $('.common-box').hide();
    // $(".common").removeClass('active')
    // if ($('.message').hasClass('active')) {
    //     $('.message-box').hide();
    //     $(".message").removeClass('active');
    // } else {
    $('.message-box').show();
    $(".message").addClass('active')
    // }
});

$(".message").mouseleave(function (event) {
    // event.stopPropagation();
    // $('.common-box').hide();
    // $(".common").removeClass('active')
    // if ($('.message').hasClass('active')) {
    $('.message-box').hide();
    $(".message").removeClass('active')
    // } else {
    // $('.message-box').show();
    // $(".message").addClass('active');
    // }
});

//清空所有消息
$(".empty-all").click(function () {
    layer.confirm('确认全部清空吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type: 'POST',
            url: ctx + '/message/delAll',
            success: function (data) {
                tmp = $('<li id="remove" style="text-align: center">暂无内容</li>');
                $('.header_message').append(tmp);
                layer.msg('消息已全部清空', {
                    time: 1000,
                    icon: 1
                });
            }
        });
        $(".header_message").empty();
        $('.header_message_num').hide();
        $(".empty-all").addClass('none').unbind('click');//灰色

    }, function () {

    });

});



/**
 * 获取消息列表
 */
function message() {
    $.ajax({
        type: 'POST',
        url: ctx + '/message/list.json',
        success: function (data) {
            $('.header_message').empty();
            var ii = 0;
            $.each(data.list, function (i, v) {
                var tmps;
                if (v.type == 1) {
                    tmps = '通知公告消息';//公告
                } else if (v.type == 2) {
                    tmps = '任务消息';//任务
                } else if (v.type == 3) {
                    tmps = '情况反映';//情况反映
                } else if (v.type == 4||v.type == 8) {
                    tmps = '求助消息';//求助
                } else if (v.type == 5) {
                    tmps = '报警消息';//报警
                } else if (v.type == 6) {
                    tmps = '居民信息更新';//居民信息更新
                } else if (v.type == 7) {
                    tmps = '居民信息上报消息';//居民信息上报
                }

                var tmp;
                if (v.type != 6 && v.type != 7) {
                    tmp = $('<li><div class="col-xs-1"><span></span></div><div class="col-xs-11" onclick="detail(' + v.type + ',' + v.entityId + ',' + v.id + ');">' +
                        '<p>系统通知：' + tmps + '<span>' + new Date(v.createdAt).Format('yyyy-MM-dd hh:mm') + '</span></p>' +
                        '<p>' + v.title + '</p>' +
                        '</div></li>');
                } else {
                    tmp = $('<li><div class="col-xs-1"><span></span></div><div class="col-xs-11" onclick="detail(' + v.type + ',' + v.entityId + ',' + v.id + ');">' +
                        '<p>系统通知：' + tmps + '<span>' + new Date(v.createdAt).Format('yyyy-MM-dd hh:mm') + '</span></p>' +
                        '<p>' + v.title + '</p>' +
                        '<p>姓名：' + v.name + '   电话：' + v.phone + '</p>' +
                        '</div></li>');
                }
                $('.header_message').append(tmp);
                ii++;
            });
            if (ii == 0) {
                $('.header_message_num').hide();
                var tmp = $('<li id="remove" style="text-align: center">暂无内容</li>');
                $('.header_message').append(tmp);
                $(".empty-all").addClass('none').unbind('click');//灰色
            } else {
                $('.header_message_num').show().html(ii);
            }

        }
    });
}

//页面加载初始化消息列表
$(document).ready(function () {
    message();
});

/**
 * 点击进入消息详情
 * @param type
 * @param entityId
 * @param id
 */
function detail(type, entityId, id) {
    var url = window.location.href;
    var tmp;
    if (type == 1) {
        tmp = ctx + '/info/informDetail/' + entityId + '?back=/info/notification';//公告
    } else if (type == 2) {
        tmp = ctx + '/task/detail/' + entityId + '?back='+url.substring(ctx.length);//任务
    } else if (type == 3) {
        tmp = ctx + '/feedback/detail/' + entityId + '?back='+url.substring(ctx.length);//线索
    } else if (type == 4||type == 8) {
        tmp = ctx + '/rescueRequest/list';//求助
        sessionStorage.setItem('key_id', entityId);
        sessionStorage.setItem('key_status', 1);
    } else if (type == 5) {
        tmp = ctx + '/benefit/web110';//报警
    } else if (type == 6) {
        tmp = ctx + '/resident/list';//居民信息上报
        $.ajax({
            type: 'POST',
            url: ctx + '/resident/detail.json',
            data: {id: entityId},
            dataType: 'JSON',
            async: false,
            success: function (data) {
                sessionStorage.identityNumber = data.object.identityNumber;//身份证号select7
            }
        });
    }
    $.ajax({
        type: 'POST',
        url: ctx + '/message/save',
        data: {id: id},
        dataType: 'JSON',
        success: function (data) {
            if (type != 7) {
                location.href = tmp;
            } else {
                location.reload();
            }
        }
    });
}






// $('.message-box').click(function (event) {
// event.stopPropagation();
// })

//常用功能框
$(".common").mouseenter(function (event) {
    // event.stopPropagation();
// $('.message-box').hide();
// $(".message").removeClass('active')
// if ($('.common').hasClass('active')) {
//     $('.common-box').hide();
//     $(".common").removeClass('active')
// } else {
    $('.common-box').show();
    $(".common").addClass('active')
// }
});
$(".common").mouseleave(function (event) {
    // event.stopPropagation();
// $('.message-box').hide();
// $(".message").removeClass('active')
// if ($('.common').hasClass('active')) {
    $('.common-box').hide();
    $(".common").removeClass('active');
// } else {
//     $('.common-box').show();
//     $(".common").addClass('active')
// }
});

// $('.common-box').click(function (event) {
// event.stopPropagation();
// })

//全局事件关闭其他窗口
// $(document).click(function () {
//     $('.message-box').hide();
//     $(".message").removeClass('active');
//     $('.common-box').hide();
//     $(".common").removeClass('active');
// })


/**
 * 地区无数据时弹出框
 */
function noDataAlert() {
    layer.msg('该区域暂无数据', {
        time: 2000,
        icon: 0
    }, function () {

    });
}



/**
 * 变更密码初始化
 */
function changeNewPassword() {
    $('#modal-change-password').modal('toggle');
    $('#form-change-password input').val('');
}

/**
 * 修改密码
 */
function changeMyPassword() {
    var original = $("#form-change-password input[name='original']").val();
    var newPassword = $("#form-change-password input[name='newPassword']").val();
    var repeat = $("#form-change-password input[name='repeat']").val();

    if (original == '') {
        layer.msg('请填写原密码', {
            time: 1500,
            icon: 0
        }, function () {

        });
        return;
    }
    if (newPassword == '') {
        layer.msg('请填写新密码', {
            time: 1500,
            icon: 0
        }, function () {

        });
        return;
    }
    if (repeat == '') {
        layer.msg('请再次填写新密码', {
            time: 1500,
            icon: 0
        }, function () {

        });
        return;
    }

    if (original == newPassword) {
        layer.msg('新密码与原密码一致，请重新填写', {
            time: 1500,
            icon: 0
        }, function () {

        });
        return;
    }
    if (repeat != newPassword) {
        layer.msg('两次输入的新密码不一致，请重新填写', {
            time: 1500,
            icon: 0
        }, function () {

        });
        return;
    }

    layer.confirm('确认变更吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var postBody = $("#form-change-password").serialize();
        $.ajax({
            type: 'POST',
            url: ctx + '/admin/changePassword',
            data: postBody,
            success: function (data) {
                if (data.msg == "success") {
                    layer.msg('变更成功', {
                        time: 1000,
                        icon: 1
                    }, function () {
                        $('#modal-change-password').modal('toggle');
                    });
                } else {
                    layer.msg(data.msg, {
                        time: 1500,
                        icon: 0
                    }, function () {

                    });
                }
            }
        });
    }, function () {

    });

}

//区间时间选取控件的初始化，汉化
//定义locale汉化插件
var localeDaterangepicker = {
    "format": 'YYYY-MM-DD',
    "separator": " -222 ",
    "applyLabel": "确定",
    "cancelLabel": "取消",
    "fromLabel": "起始时间",
    "toLabel": "结束时间'",
    "customRangeLabel": "自定义",
    "weekLabel": "W",
    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    "firstDay": 1
};


//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 表单数据转对象
 * @param form
 * @returns {{}}
 */
function serializeObject(form) {
    let obj = {};
    $.each(form.serializeArray(), function (index) {
        if (obj[this['name']]) {
            obj[this['name']] = obj[this['name']] + "," + this['value'];
        } else {
            obj[this['name']] = this['value'];
        }
    });
    return obj;
}

/**
 * 设置table状态到storge
 * @param table table名
 * @param form 表单名
 * @param page 页数
 */
function setStorageTableParameter(table, form, page) {
    let url = window.location.href.split('manager')[1];
    let obj = {
        url: url,
        tableName: table,
        data: serializeObject($(form)),
        pageN: page
    };
    sessionStorage.setItem('table_parameter', JSON.stringify(obj));
}

/**
 * 设置列表返回时还原现场
 */
function setTableParameter() {
    let thisUrl = window.location.href.split('manager')[1];
    let obj = JSON.parse(sessionStorage.getItem('table_parameter'));
    //判断是否存在sessionstorage
    if (obj != undefined) {
        //判断当前页是否为储存页
        if (thisUrl != obj.url) {
            sessionStorage.removeItem('table_parameter');
        } else {

            if (obj.url == '/task/list') {
                //判断是否为任务列表页

                if (obj.tableName == '#table-task-list') {
                    console.log(obj.data)
                    $('#keyword1').val(obj.data.title);
                    selected('status1', obj.data.status);
                    $('#total-startDate').val(obj.data.startDate);
                    $('#total-endDate').val(obj.data.endDate);
                    $('.nav-tabs>li').eq(0).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(0).addClass('active').siblings('div').removeClass('active');
                    initTaskTable({table: '#table-task-list', toolbar: '#toolbar-task-list', tag: 'total'}, obj.pageN);

                } else if (obj.tableName == '#table-task-received') {
                    console.log(obj.data)
                    $('#keyword2').val(obj.data.title);
                    selected('status2', obj.data.status);
                    $('#received-startDate').val(obj.data.startDate);
                    $('#received-endDate').val(obj.data.endDate);
                    $('.nav-tabs li').eq(1).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(1).addClass('active').siblings('div').removeClass('active');
                    initTaskTable({
                        table: '#table-task-received',
                        toolbar: '#toolbar-task-received',
                        tag: 'received'
                    }, obj.pageN);

                } else if (obj.tableName == '#table-task-posted') {
                    console.log(obj.data)
                    $('#keyword3').val(obj.data.title);
                    selected('status3', obj.data.status);
                    $('#posted-startDate').val(obj.data.startDate);
                    $('#posted-endDate').val(obj.data.endDate);
                    $('.nav-tabs li').eq(2).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(2).addClass('active').siblings('div').removeClass('active');
                    initTaskTable({
                        table: '#table-task-posted',
                        toolbar: '#toolbar-task-posted',
                        tag: 'posted'
                    }, obj.pageN);
                }
            } else if (obj.url == '/info/local') {
                //判断本地宣传
                if (obj.tableName == '#table-local') {
                    console.log(obj.data)
                    $("input[name='title']").val(obj.data.title);
                    $("input[name='startDate']").val(obj.data.startDate);
                    $("input[name='endDate']").val(obj.data.endDate);
                }

            } else if (obj.url == '/info/recommend') {
                //判断时政资讯
                if (obj.tableName == '#table-recommend') {
                    console.log(obj.data);
                    $('#form_title').val(obj.data.title);
                    $('#form_startDate').val(obj.data.startDate);
                    $('#form_endDate').val(obj.data.endDate);
                }
            } else if (obj.url == '/info/database') {
                //判断综治文库
                if (obj.tableName == '##table-recommend') {
                    console.log(obj.data);
                    $('#form_title').val(obj.data.title);
                    $('#form_startDate').val(obj.data.startDate);
                    $('#form_endDate').val(obj.data.endDate);
                }
            } else if (obj.url == '/feedback/listPage') {
                //判断线索管理
                if (obj.tableName == '#table1') {
                    console.log(obj.data)
                    $("#from-query input[name='title']").val(obj.data.title);
                    $("#from-query input[name='status']").val(obj.data.status);
                    $("#from-query input[name='region']").val(obj.data.region);
                    $("#from-query input[name='startDate']").val(obj.data.startDate);
                    $("#from-query input[name='endDate']").val(obj.data.endDate);
                    $('.nav-tabs li').eq(0).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(0).addClass('active').siblings('div').removeClass('active');
                } else if (obj.tableName == '#table2') {
                    $("#from-query1 input[name='title']").val(obj.data.title);
                    $("#from-query1 input[name='status']").val(obj.data.status);
                    $("#from-query1 input[name='region']").val(obj.data.region);
                    $("#from-query1 input[name='startDate']").val(obj.data.startDate);
                    $("#from-query1 input[name='endDate']").val(obj.data.endDate);
                    $('.nav-tabs li').eq(1).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(1).addClass('active').siblings('div').removeClass('active');
                }
            } else if (obj.url == '/info/notification') {
                //通知公告
                if (obj.tableName == '#table1') {
                    console.log(obj.data)
                    $("#from-query input[name='title']").val(obj.data.title);
                    $("#from-query input[name='startDate']").val(obj.data.startDate);
                    $("#from-query input[name='endDate']").val(obj.data.endDate);
                    $('.nav-tabs li').eq(0).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(0).addClass('active').siblings('div').removeClass('active');
                } else if (obj.tableName == '#table2') {
                    $("#from-query1 input[name='title']").val(obj.data.title);
                    $("#from-query1 input[name='startDate']").val(obj.data.startDate);
                    $("#from-query1 input[name='endDate']").val(obj.data.endDate);
                    $('.nav-tabs li').eq(1).addClass('active').siblings('li').removeClass('active');
                    $('.tab-content>div').eq(1).addClass('active').siblings('div').removeClass('active');
                }
            }
        }
        setTimeout(function () {
            sessionStorage.removeItem('table_parameter');
        }, 2000);
    }
}


/**
 * rtmp视频打开
 * @param username
 * @param password
 * @param id
 */
function videoFlowOpen(username, password, cameraId, videoId) {
    $('.video-flow-mar').show();
    $('.video-flow-txt').empty();

    $('#get-face').show();
    $('#stop-face').hide();

    $('.face-list-box').hide();
    $('.face-img').empty();

    let html = '<video id="video-flow" class="video-js" width="890" height="520" style="width: 890px;height: 520px">' +
        '<source src="rtmp://219.139.44.9:51554/liveonly/cam32845_url2_copy" type="rtmp/flv">' +
        '</video>';

    $('.video-flow-con').append(html);

    loggerAdd(videoId, 0);

    $.ajax({
        type: "POST",
        url: ctx + '/camera/getRTMP',
        data: {
            userAccount: username,
            userPassword: password,
            cameraId: cameraId,
            decodeType: 'copy',
            isPublic: 1,
            url: window.location.href
        },
        dataType: "json",
        success: function (data) {
            console.log(data.url);
            if (!data.url) {
                layer.msg('未获取到可用端口', {
                    time: 1000,
                    icon: 0
                }, function () {
                    // videojs('video-flow').dispose();
                    // $('.video-flow-mar').hide();
                });
            } else {

                $('.video-flow-txt').text(data.name);

                var srcUrl = data.url;

                $('#video-flow-url').val(srcUrl);

                sessionStorage.videoId = videoId;

                // $('#video-flow source').attr('src', src);
                videojs('video-flow').load();
                videojs('video-flow').src(srcUrl);
                videojs('video-flow', {
                    // fluid: true,
                    // autoplay: true,
                }, function () {
                    this.play(); // if you don't trust autoplay for some reason
                });
            }
        }
    });

}


/**
 * rtmp视频关闭
 */
function videoFlowClose() {
    loggerAdd(sessionStorage.videoId, 1);
    videojs('video-flow').dispose();
    $('.video-flow-mar').hide();
}


/**
 * NetPluginSDK视频打开
 * @param port
 * @param dwChannelID
 * @param videoId
 */
function videoNetPluginSDKOpen(port, dwChannelID, videoId) {

    loggerAdd(videoId, 0);

    if (videoFlagTag == port) {
        playVideo(dwChannelID);
    } else {
        layer.msg('加载视频中，请稍等...', {
            time: 2000,
            icon: 0
        }, function () {

        });
        setTimeout(function () {
            localLogin2(port);
            videoFlagTag = port;
            playVideo(dwChannelID);
        }, 200);
    }
}


/**
 * NetPluginSDK视频关闭
 */
function videoNetPluginSDKClose() {
    loggerAdd(sessionStorage.videoId, 1);
    $('.video-box').css({"width": "0px", "height": "0px"});
    $('#playerContainer2').css({"width": "1px", "height": "1px"});
    //NetPluginSDK_Win32视频停流
    stopVideo1();
}

/**
 * 上传查看视频日志
 * @param videoId
 * @param type  0打开视频   1 关闭视频
 */
function loggerAdd(videoId, type) {
    let loggerId;
    if (type == 0) {
        loggerId = 0;
    } else if (type == 1) {
        loggerId = sessionStorage.loggerId;
    }
    $.ajax({
        type: "post",
        url: ctx + '/logger/add',
        dataType: "json",
        data: {
            videoId: videoId,
            url: window.location.href,
            loggerId: loggerId
        },
        success: function (result) {
            console.log(result.loggerId);
            sessionStorage.loggerId = result.loggerId;
        },
        error: function (e) {
            console.log(e);
        }
    })
}


/**
 * 人脸识别
 */
function getFace() {
    console.log('开始人脸识别');
    $('#get-face').hide();
    $('#stop-face').show();
    var videoFlowUrl = $('#video-flow-url').val();

    videojs('video-flow').pause();

    let animationHtml = '<div class="animation-face"></div>';
    $('.face-img').empty().append(animationHtml);

    let timeStamp1 = Date.parse(new Date());


    $.ajax({
        type: "POST",
        url: ctx + '/camera/face/detect',
        dataType: 'json',
        data: {
            rmtp: videoFlowUrl,
            videoId: sessionStorage.videoId,
            url: window.location.href
        },
        async: true,
        success: function (data) {

            let timeStamp2 = Date.parse(new Date());

            let timeStampDiff = timeStamp2 - timeStamp1;

            if (timeStampDiff > 1000) {
                timeStampDiff = 0;
            }

            setTimeout(function () {

                let faceImg = data.data.image;

                $('.face-list-box').show();

                let faceImgHtml = '<img src="' + faceImg + '">';
                $('.face-img').empty().append(faceImgHtml);

                $('.face-list-box').empty();

                let faceLists = data.data.faces;

                if (faceLists.length == 0) {
                    let noFaceHtml = '<div style="width: 100%;height: 100%;display: flex">' +
                        '<img style="display:block;margin: auto" src="' + ctx + '/static/anew/img/no-face.png">' +
                        '</div>';
                    $('.face-list-box').append(noFaceHtml);
                }

                for (let i = 0; i < faceLists.length; i++) {
                    let faceItem = faceLists[i];

                    if (faceItem.person) {
                        let faceIcon = faceItem.person.icon;
                        let faceMatchRate = faceItem.person.match_rate;
                        let faceName = faceItem.person.name;
                        let faceGender = faceItem.person.gender;
                        let faceHouseholdAddr = faceItem.person.householdAddr;

                        //右侧列表展示
                        let faceListItemHtml = '<div id = "face' + i + '" class="face-item" onClick = "clickFaceItem(this)">' +
                            '<div class="face-hicon">' +
                            '<img src="' + faceIcon + '">' +
                            '<div class="face-data-degrees">置信度' + faceMatchRate + '</div>' +
                            '</div>' +
                            '<div class="face-data">' +
                            '<div>姓名：' + faceName + '</div>' +
                            '<div>性别：' + faceGender + '</div>' +
                            '<div>户籍地：' + faceHouseholdAddr + '</div>' +
                            '</div>' +
                            '</div>';

                        $('.face-list-box').append(faceListItemHtml);

                    } else {

                        let noFaceHtml = '<div style="width: 100%;height: 100%;display: flex">' +
                            '<img style="display:block;margin: auto" src="' + ctx + '/static/anew/img/no-face.png">' +
                            '</div>';
                        $('.face-list-box').append(noFaceHtml);

                    }

                    let faceTop = faceItem.face_rectangle.top * 2;
                    let faceLeft = faceItem.face_rectangle.left * 2;
                    let faceWidth = faceItem.face_rectangle.width * 2;
                    let faceHeight = faceItem.face_rectangle.height * 2;

                    //画人脸框
                    let faceFrameHtml = '<div id="face' + i + '-frame" class="face-frame"' +
                        ' style="top:' + faceTop + 'px;left: ' + faceLeft + 'px;width: ' + faceWidth + 'px;height: ' + faceHeight + 'px;">' +
                        '<img src="' + ctx + '/static/anew/img/face-win.png">' +
                        '</div>';

                    $('.face-img').append(faceFrameHtml);

                }
            }, timeStampDiff);
        }
    });

}

/**
 * 点击单个人脸识别结果
 * @param data
 */
function clickFaceItem(data) {
    let id = $(data).attr("id");
    $('.face-frame').empty().append('<img src="' + ctx + '/static/anew/img/face-win.png" alt="">');
    $('#' + id + '-frame').empty().append('<img src="' + ctx + '/static/anew/img/face-win-active.png" alt="">');
}

/**
 * 取消人脸识别
 */
function stopFace() {
    // videoFlowClose();

    console.log('取消人脸识别');
    $('#get-face').show();
    $('#stop-face').hide();

    $('.face-list-box').hide();
    $('.face-img').empty();

    videojs('video-flow').play();

}

/**
 * 初始化下拉选框
 * @param id
 * @param data
 */
function selected(id, data) {
    $('option[value="' + data + '"]', $('#' + id + '')).prop('selected', true);
    $('#' + id + '').multiselect('refresh');
}


/**
 * Simple Map
 *
 * var m = new Map();
 * m.put('key','value');
 * ...
 * var s = "";
 * m.each(function(key,value,index){
 *      s += index+":"+ key+"="+value+"/n";
 * });
 * alert(s);
 *
 */
function Map() {
    /** 存放键的数组(遍历用到) */
    this.keys = new Array();
    /** 存放数据 */
    this.data = new Object();

    /**
     * 放入一个键值对
     * @param {String} key
     * @param {Object} value
     */
    this.put = function (key, value) {
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    /**
     * 获取某键对应的值
     * @param {String} key
     * @return {Object} value
     */
    this.get = function (key) {
        return this.data[key];
    };

    /**
     * 删除一个键值对
     * @param {String} key
     */
    this.remove = function (key) {
        this.keys.remove(key);
        this.data[key] = null;
    };

    /**
     * 遍历Map,执行处理函数
     *
     * @param {Function} 回调函数 function(key,value,index){..}
     */
    this.each = function (fn) {
        if (typeof fn != 'function') {
            return;
        }
        var len = this.keys.length;
        for (var i = 0; i < len; i++) {
            var k = this.keys[i];
            fn(k, this.data[k], i);
        }
    };

    /**
     * 获取键值数组(类似Java的entrySet())
     * @return 键值对象{key,value}的数组
     */
    this.entrys = function () {
        var len = this.keys.length;
        var entrys = new Array(len);
        for (var i = 0; i < len; i++) {
            entrys[i] = {
                key: this.keys[i],
                value: this.data[i]
            };
        }
        return entrys;
    };

    /**
     * 判断Map是否为空
     */
    this.isEmpty = function () {
        return this.keys.length == 0;
    };

    /**
     * 获取键值对数量
     */
    this.size = function () {
        return this.keys.length;
    };

    /**
     * 重写toString
     */
    this.toString = function () {
        var s = "{";
        for (var i = 0; i < this.keys.length; i++, s += ',') {
            var k = this.keys[i];
            s += k + "=" + this.data[k];
        }
        s += "}";
        return s;
    };
}