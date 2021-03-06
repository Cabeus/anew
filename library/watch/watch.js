(function(){
	var calendarDate = {};
	var riliHtml = '';
	calendarDate.today = new Date();
	calendarDate.year = calendarDate.today.getFullYear();//当前年
	calendarDate.month = calendarDate.today.getMonth()+1;//当前月
	calendarDate.date = calendarDate.today.getDate();//当前日
	calendarDate.day = calendarDate.today.getDay();//当前周几
	
	
	//绘制
	function getIndexDay(){
		isLeapYear();
    	getDays();
    	riliHtml = '';
    	//本月一号周几
    	calendarDate.monthStart = new Date(calendarDate.year+"/"+calendarDate.month+"/1").getDay();
		//上个月所占空格数
		console.log(calendarDate)
		if( calendarDate.monthStart == 0 ){//独占一行
			calendarDate.monthStart = 7;
		}
		//上月数据
		for( var i = calendarDate.monthStart;i>0;i-- ){
			var dataDateStr = calendarDate.lastYear + "-" + calendarDate.lastMonth + "-" + (calendarDate.lastDays - i + 1);
			riliHtml += '<div class="ht-rili-td ht-rili-td-disabled" data-date="'+ dataDateStr +'"><span class="ht-rili-day">'+ (calendarDate.lastDays - i + 1) +'</span><span class="ht-rili-money"></span></div>'
		}
		//本月数据
		for( var k = 0;k<calendarDate.days;k++ ){
			var flag
			var dataDateStr = calendarDate.year + "-" + calendarDate.month + "-" + ( k + 1  );
			if(calendarDate.opt!= undefined){
				for( var d in calendarDate.opt.data ){
					var nowDate = dataDateStr;
					var dataDate = calendarDate.opt.data[d].date;
					flag = checkDate(nowDate,dataDate);
					if( flag ){
						var htmm="";
						$.each(calendarDate.opt.data[d].data,function (i,v) {
							htmm+=v.name+'  '
						});
						riliHtml += '<div class="ht-rili-td ht-rili-onclick" data-date="'+ dataDateStr +'"><span class="ht-rili-day">'+ (k + 1) +'</span><span class="ht-rili-money"><br>'+htmm+'</span></div>';
						break;
					}
				}
			}

			if( !flag ){
				riliHtml += '<div class="ht-rili-td ht-rili-onclick" data-date="'+ dataDateStr +'"><span class="ht-rili-day">'+ (k + 1) +'</span><span class="ht-rili-money"></span></div>';	
			}
		}
		//下月数据
		if ((calendarDate.days + calendarDate.monthStart) >= 35){
			for( var j = 0;j<(42 - calendarDate.days - calendarDate.monthStart);j++ ){//42-已占用表格数=剩余表格数
				var dataDateStr = calendarDate.nextYear + "-" + calendarDate.nextMonth + "-" + (j + 1);
				riliHtml += '<div class="ht-rili-td ht-rili-td-disabled" data-date="'+ dataDateStr +'"><span class="ht-rili-day">'+ (j + 1) +'</span><span class="ht-rili-money"></span></div>';
			}
		}else{
			for( var j = 0;j<(35 - calendarDate.days - calendarDate.monthStart);j++ ){//36-已占用表格数=剩余表格数
				var dataDateStr = calendarDate.nextYear + "-" + calendarDate.nextMonth + "-" + (j + 1);
				riliHtml += '<div class="ht-rili-td ht-rili-td-disabled" data-date="'+ dataDateStr +'"><span class="ht-rili-day">'+ (j + 1) +'</span><span class="ht-rili-money"></span></div>';
			}
		}
		$('.ht-rili-body').append(riliHtml);
		$('.ht-rili-onclick').on('click',function(){
			dateClick(this);
		})
		
	}
	//是否是闰年
	function isLeapYear(){
		if( (calendarDate.year % 4 == 0) && (calendarDate.year % 100 != 0 || calendarDate.year % 400 == 0) ){
			calendarDate.isLeapYear = true;
		}else{
			calendarDate.isLeapYear = false;
		}
	}
	//日期点击事件
	function dateClick(obj){
		$(obj).siblings().each(function(){
			$(this).removeClass('ht-rili-td-active');
		});
		$(obj).addClass('ht-rili-td-active');
		console.log(obj);
		var data = $('.calendar-box').calendarGetActive();
		findOne(data.date);
	}
	//获取上个月份，本月，下个月份信息
	function getDays(){
		//上月天数
        if(  parseInt(calendarDate.month) == 1 ){
        	calendarDate.lastDays = new Date(calendarDate.year-1,12, 0).getDate();
        	calendarDate.lastMonth = new Date(calendarDate.year-1,12, 0).getMonth()+1;
        	calendarDate.lastYear = new Date(calendarDate.year-1,12, 0).getFullYear();
        }else{
            calendarDate.lastDays = new Date(calendarDate.year,calendarDate.month-1, 0).getDate();
            calendarDate.lastMonth = new Date(calendarDate.year,calendarDate.month-1, 0).getMonth()+1;
            calendarDate.lastYear = new Date(calendarDate.year,calendarDate.month-1, 0).getFullYear();
        }
        //下个月天数
        if( parseInt(calendarDate.month) == 12 ){
            calendarDate.nextDays  = new Date(calendarDate.year+1,1, 0).getDate();
            calendarDate.nextMonth  = new Date(calendarDate.year+1,1, 0).getMonth()+1;
            calendarDate.nextYear  = new Date(calendarDate.year+1,1, 0).getFullYear();
        }else{
            calendarDate.nextDays  = new Date(calendarDate.year,calendarDate.month+1, 0).getDate();
            calendarDate.nextMonth  = new Date(calendarDate.year,calendarDate.month+1, 0).getMonth()+1;
            calendarDate.nextYear  = new Date(calendarDate.year,calendarDate.month+1, 0).getFullYear();
        }
        //本月天数
		calendarDate.days = new Date(calendarDate.year,calendarDate.month, 0).getDate();
	}
	//检测时间是否一致
	function checkDate( dateStr1, dateStr2 ){
		var date1 = dateStr1.split("-"); //[0]year,[1]month,[2]date;
		var date2 = dateStr2.split("-"); //[0]year,[1]month,[2]date;
		if( date1[1] < 10 && date1[1].length < 2){
			date1[1] = "0"+date1[1];
		}
		if( date1[2] < 10 && date1[2].length < 2){
			date1[2] = "0"+date1[2];
		}
		if( date2[1] < 10 && date2[1].length < 2){
			date2[1] = "0"+date2[1];
		}
		if( date2[2] < 10 && date2[2].length < 2){
			date2[2] = "0"+date2[2];
		}
		date1 = date1.join("-");
		date2 = date2.join("-");
		return date1 == date2;
	}
	
	$.fn.extend({
	    calendar:function(opt){
	        if( (opt.beginDate != undefined && opt.endDate != undefined )||( opt.data.length > 0 ) ){
	        	
	        	//获取当前的时间
	        	function show() {
					var mydate = new Date();
					var str = "" + mydate.getFullYear() + "-";
					str += (mydate.getMonth() + 1) + "-";
					str += mydate.getDate();
					return str;
				}
	        	
	        	//将当前的时间赋给展示月份
	        	var beginDate = show();
	        	
	        	var endDate = opt.data[opt.data.length-1].date;
	        	calendarDate.beginYear = parseInt(beginDate.split('-')[0]);//起始年
				calendarDate.beginMonth = parseInt(beginDate.split('-')[1]);//起始月
				calendarDate.beginDate = parseInt(beginDate.split('-')[2]);//起始日
	        	
	        	calendarDate.endYear = parseInt(endDate.split('-')[0]);//结束年
				calendarDate.endMonth = parseInt(endDate.split('-')[1]);//结束月
				calendarDate.endDate = parseInt(endDate.split('-')[2]);//结束日
				
				calendarDate.year = parseInt(beginDate.split('-')[0]);//设置起始日期为当前日期
				calendarDate.month = parseInt(beginDate.split('-')[1]);//设置起始日期为当前日期
				calendarDate.date = parseInt(beginDate.split('-')[2]);//设置起始日期为当前日期
	        	calendarDate.opt = opt;
	        	console.log(beginDate);
	        	console.log(endDate)
	        	
	        }else{
	        	console.log('未传入beginDate或endDate！');
	        }
	        //加载容器
	    	calendarDate.container = '<div class="ht-rili-querybox"><strong class="ht-rili-title">'+ opt.title +'</strong><div><div class="ht-rili-datebox"><span class="ht-rili-leftyear">&lt;</span><span class="ht-rili-dateyear"></span><span class="ht-rili-rightyear">&gt;</span></div><div class="ht-rili-datebox"><span class="ht-rili-leftarr">&lt;</span><span class="ht-rili-date"></span><span class="ht-rili-rightarr">&gt;</span></div></div></div><div class="ht-rili-head"><div class="ht-rili-th">周日</div><div class="ht-rili-th">周一</div><div class="ht-rili-th">周二</div><div class="ht-rili-th">周三</div><div class="ht-rili-th">周四</div><div class="ht-rili-th">周五</div><div class="ht-rili-th">周六</div></div><div class="ht-rili-body"><!--<div class="ht-rili-td"><span class="ht-rili-day">1</span><span class="ht-rili-money">&yen;100</span></div>--></div>'
			//初始化加载翻页数据
	    	$(opt.ele).append(calendarDate.container);
	    	$('.ht-rili-dateyear').html(calendarDate.year+'年');
	        $('.ht-rili-date').html(calendarDate.month+'月');
	        
	    	getIndexDay();
	    	//翻页点击
	    	
	    		//年
	    	$('.ht-rili-leftyear').on('click',function(){
	    		$('.ht-rili-body').html('');
	    		calendarDate.year -= 1;
	    		$('.ht-rili-dateyear').html(calendarDate.year+'年');
	    		getIndexDay();
	    	})
	    	$('.ht-rili-rightyear').on('click',function(){
	    		$('.ht-rili-body').html('');
	    		calendarDate.year += 1;
	    		$('.ht-rili-dateyear').html(calendarDate.year+'年');
	    		getIndexDay();
	    	})
	    		
	    		//月
	    	$('.ht-rili-leftarr').on('click',function(){
	    		$('.ht-rili-body').html('');
	    		if( calendarDate.month == 1 ){
	    			calendarDate.year -= 1;
	    			calendarDate.month = 12;
	    		}else{
	    			calendarDate.month -=1;
	    		}
	    		$('.ht-rili-dateyear').html(calendarDate.year+'年');
	    		$('.ht-rili-date').html(calendarDate.month+'月');
	    		getIndexDay();
	    	})
	    	$('.ht-rili-rightarr').on('click',function(){
	    		$('.ht-rili-body').html('');
	    		if( calendarDate.month == 12 ){
	    			calendarDate.year += 1;
	    			calendarDate.month = 1;
	    		}else{
	    			calendarDate.month +=1;
	    		}
	    		$('.ht-rili-dateyear').html(calendarDate.year+'年');
	    		$('.ht-rili-date').html(calendarDate.month+'月');
	    		getIndexDay();
	    	})
	    },
	    calendarGetActive: function(){//获取当前选中日期的值
	    	//未选中时返回undefined
	    	var activeEle = $(this).find(".ht-rili-td-active");
	    	var date = activeEle.attr("data-date");
	    	var money = activeEle.children(".ht-rili-money").attr("data-money");
	    	return data = {
	    		date : date,
	    		money : money
	    	}
	    }
	});
})(jQuery)