//设置内容的高度
$(document).ready(function () {
    var height = $(window).height() - 88;
    $('.aside').height(height);
    $('.main-content').height(height -20);
    $('.main-content-two').height(height - 64);
});
$(window).resize(function () {
    var height = $(window).height() - 88;
    $('.aside').height(height);
    $('.main-content').height(height -20);
    $('.main-content-two').height(height - 64);
});
//地区选择下拉框
$('.single-dropdown').mouseenter(function () {
    $(this).children('.single-ul').slideDown(0)
});
$('.single-dropdown').mouseleave(function () {
    $(this).children('.single-ul').slideUp(0)
});

//地区无数据时弹出框
function noDataAlert() {
    alert('该区域暂无数据');
}

//拼接导航栏链接
$(document).ready(function () {
    // 获取当前页面地址
    let thisUrl = window.location.href;
    // let index = window.location.href.lastIndexOf(ctx);
    // let thisUrl=window.location.href.substring(index+8,window.location.href.length);
    $('.navigation-links').each(function () {
        if(this.href.indexOf('/index/backtrack?')!= -1){
            $(this).attr("href",$(this).attr("href")+thisUrl);
        }
    });
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
    if (confirm("确认全部清空吗？")) {
        $.ajax({
            type: 'POST',
            url: ctx + '/message/delAll',
            success: function (data) {
                tmp = $('<li id="remove" style="text-align: center">暂无内容</li>');
                $('.header_message').append(tmp);
                // if(data.msg == "success") {
                //     alert("消息全部清空了");
                // } else {
                //     alert(data.msg);
                // }
            }
        });
        $(".header_message").empty();
        $('.header_message_num').hide();
        $(".empty-all").addClass('none').unbind('click');//灰色
    }
});



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

//修改密码
function changeMyPassword() {
    var original = $("#form-change-password input[name='original']").val();
    var newPassword = $("#form-change-password input[name='newPassword']").val();
    var repeat = $("#form-change-password input[name='repeat']").val();

    if (original == '') {
        alert('请填写原密码');
        return;
    }
    if (newPassword == '') {
        alert('请填写新密码');
        return;
    }
    if (repeat == '') {
        alert('请再次填写新密码');
        return;
    }

    if (original == newPassword) {
        alert('新密码与原密码一致，请重新填写');
        return;
    }
    if (repeat != newPassword) {
        alert('两次输入的新密码不一致，请重新填写');
        return;
    }

    if (confirm("确认变更吗？")) {
        var postBody = $("#form-change-password").serialize();
        $.ajax({
            type: 'POST',
            url: ctx + '/admin/changePassword',
            data: postBody,
            success: function (data) {
                if (data.msg == "success") {
                    alert("变更成功");
                    $('#modal-change-password').modal('toggle');
                } else {
                    alert(data.msg);
                }
            }
        });
    }
}

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
})

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

        }
    });
})

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
                }else if(obj.tableName == '#table2'){
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
                }else if(obj.tableName == '#table2'){
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
        },2000);
    }
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