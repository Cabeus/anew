//左侧菜单折叠
$('.aside ul.nav li a').not($('ul.submenu li a')).unbind('click').click(function() {

	if($(this).parent().hasClass('open')) {
		$(this).parent().removeClass('open').find('ul.submenu').slideUp({
			duration: 200
		});
	} else {
		$(this).parents('ul').find('li').removeClass('open').find('ul.submenu').css('display', 'none')

		$(this).parent().addClass('open').find('ul.submenu').slideToggle({
			duration: 200
		});
	}
});
//左侧菜单最小化
$('.mini').click(function() {
	if($('.aside').hasClass('mini-aside')) {
		$('.aside').removeClass('mini-aside');
	} else {
		$('.aside').addClass('mini-aside');
	}
});
//文件上传组件
$('.choose-btn').click(function() {
	$(this).parents('.input-group').find('.file-input').click();
});
$('.file-input').change(function() {
	$(this).parent().find('.file-cover').val($(this).val());
})
//换肤
$('#change-theme').click(function() {
	console.log('ddd');
	if($('body').hasClass('dark')) {
		$('body').removeClass('dark');
	} else {
		$('body').addClass('dark');
	}
})

$('.aside ul li a').mouseenter(function() {
	if($(this).parents('.aside').hasClass('mini-aside')) {
		$('.arrow_box').remove()
		var top = $(this).offset().top
		var left = $(this).offset().left
		var text = $(this).find('span').text();
		var html = "<div class='arrow_box'>" + text + "</div>"
		$('body').append(html)
		$('.arrow_box').css('top', top)
		$('.arrow_box').css('left', 65)
		console.log(top, left)
	}

});
$('.aside ul li a').mouseleave(function() {
	if($(this).parents('.aside').hasClass('mini-aside')) {
		$('.arrow_box').remove()
	}
})

$('.close-dialog').click(function(event) {
	$('.dialog').hide();
});
// 二级菜单收起
// $('.saside-control').click(function() {
// 	if($('.sec-aside').hasClass('slideup')) {
// 		$('.sec-aside').removeClass('slideup')
// 	} else {
// 		$('.sec-aside').addClass('slideup')
// 	}
// })
// var permission = {
// 	getInitPermission: function(ctx, id) {
// 		$.ajax({
// 			type: "POST",
// 			url: ctx + '/permission/getInitPermission',
// 			data: {
// 				id: id
// 			},
// 			dataType: "json",
// 			success: function(data) {
// 				var a1 = $("<ul></ul>");
// 				$.each(data.data.list, function(i, v) {
// 					var a2 = $('<li><a href="' + ctx + v.content + '"><div class="nav-icon"></div><div class="nav-title">' + v.name + '</div></a></li>');
// 					a1.append(a2);
// 				});
// 				$('#initPermission').append(a1);
// 				$("#initPermission a").each(function() {
// 					if($(this).attr("href") == window.location.href) {
// 						$(this).parent().addClass("active").parent().attr("style", "display: block;").parent().addClass("open");
// 					}
// 				});
// 			}
// 		});
// 	}
// };