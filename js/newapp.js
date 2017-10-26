//设置内容的高度
$(document).ready(function() {
	var height = $(window).height() - 76;
	$('.aside').height(height);
	$('.main-content').height(height);
});
$(window).resize(function() {
	var height = $(window).height() - 76;
	$('.aside').height(height);
	$('.main-content').height(height);
})

//消息提示下拉框
$(".message").click(function(event) {
	event.stopPropagation();
	$('.common-box').hide();
	$(".common").removeClass('active')
	if($('.message').hasClass('active')) {
		$('.message-box').hide();
		$(".message").removeClass('active')
	} else {
		$('.message-box').show();
		$(".message").addClass('active')
	}
})
$('.message-box').click(function(event) {
	event.stopPropagation();
})
//常用功能框
$(".common").click(function(event) {
	event.stopPropagation();
	$('.message-box').hide();
	$(".message").removeClass('active')
	if($('.common').hasClass('active')) {
		$('.common-box').hide();
		$(".common").removeClass('active')
	} else {
		$('.common-box').show();
		$(".common").addClass('active')
	}
})
$('.common-box').click(function(event) {
	event.stopPropagation();
})

//全局事件关闭其他窗口
$(document).click(function() {
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

	if(original == '') {
		alert('请填写原密码');
		return;
	}
	if(newPassword == '') {
		alert('请填写新密码');
		return;
	}
	if(repeat == '') {
		alert('请再次填写新密码');
		return;
	}

	if(original == newPassword) {
		alert('新密码与原密码一致，请重新填写');
		return;
	}
	if(repeat != newPassword) {
		alert('两次输入的新密码不一致，请重新填写');
		return;
	}

	if(confirm("确认变更吗？")) {
		var postBody = $("#form-change-password").serialize();
		$.ajax({
			type: 'POST',
			url: ctxjs + '/admin/changePassword',
			data: postBody,
			success: function(data) {
				if(data.msg == "success") {
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
$(document).ready(function() {
	var url = window.location.href;
	//header 中间按钮
	if(url.indexOf('/index/loginMap') != -1) {
		$('.nav-center ul li').eq(0).addClass('active');
	} else if(url.indexOf('/index/login/') != -1 || url.indexOf('/residentStatistics/home/') != -1) {
		$('.nav-center ul li').eq(2).addClass('active');
	} else {
		if (url.indexOf('/user/list') != -1 || url.indexOf('/admin/list') != -1 || url.indexOf('/index/command') != -1 ) {
			//
		} else{
			$('.nav-center ul li').eq(3).addClass('active');
		}
	}
	//header 右侧设置按钮
	if(url.indexOf('/user/list') != -1 || url.indexOf('/admin/list') != -1) {
		$('.setup').addClass('active');
	}
	//二级菜单
	if(url.indexOf('/index/login/') != -1) {
		$('.two-menu ul li').eq(0).addClass('active');
	} else if(url.indexOf('/residentStatistics/home/') != -1) {
		$('.two-menu ul li').eq(1).addClass('active');
	}
})

//左侧菜单栏的打开与收起
$(document).ready(function() {
	var url = window.location.href;
	$("#nav-functions a").each(function() {
		if($(this).attr("href") == url) {
			if(url.indexOf('/admin/coming') != -1) { //判断是否为敬请期待页-coming
				$(this).parent().addClass("active")
			} else {
				$(this).parent().addClass("active").parent().attr("style", "display: block;").parent().addClass("open");
			}

		}
	});
})

//判断是否显示返回键
$(document).ready(function() {
	var url = window.location.href;
    var num=url.substring(url.lastIndexOf('/')+1);
    if(!isNaN(num)){
        url = url.substring(0,url.lastIndexOf('/')+1)+'0';
    	console.log(url);
	}
	if(adminIsTrue) {
		$('#backjump').show();
		$('#backjump').attr('href', ctx + '/index/backtrack?back=' + url);
	} else {
		$('#backjump').hide();
	}
});