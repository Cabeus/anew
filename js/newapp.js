//设置内容的高度
$(document).ready(function () {
    var height = $(window).height() - 76;
    $('.aside').height(height);
    $('.main-content').height(height);
});
$(window).resize(function () {
    var height = $(window).height() - 76;
    $('.aside').height(height);
    $('.main-content').height(height);
})

//消息提示框
$(".message").click(function (event) {
    event.stopPropagation();
    $('.common-box').hide();
    $(".common").removeClass('active')
    if ($('.message').hasClass('active')) {
        $('.message-box').hide();
        $(".message").removeClass('active')
    } else {
        $('.message-box').show();
        $(".message").addClass('active')
    }
});
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

$('.message-box').click(function (event) {
    event.stopPropagation();
})
//常用功能框
$(".common").click(function (event) {
    event.stopPropagation();
    $('.message-box').hide();
    $(".message").removeClass('active')
    if ($('.common').hasClass('active')) {
        $('.common-box').hide();
        $(".common").removeClass('active')
    } else {
        $('.common-box').show();
        $(".common").addClass('active')
    }
})
$('.common-box').click(function (event) {
    event.stopPropagation();
})

//全局事件关闭其他窗口
$(document).click(function () {
    $('.message-box').hide();
    $(".message").removeClass('active');
    $('.common-box').hide();
    $(".common").removeClass('active');
})

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
    // console.log(url);
    // }
    if (adminIsTrue) {
        $('#backjump').show();
        $('#backjump').attr('href', ctx + '/index/backtrack?back=' + url);
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


/**
 * Simple Map
 *
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