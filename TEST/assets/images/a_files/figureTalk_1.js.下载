   var client = new OSS.Wrapper({
      	region: 'oss-cn-hangzhou',
	    accessKeyId: 'LTAIWM44IMDuH16R',
	    accessKeySecret: 'odtZ52n9JViv4DWy9MkfRjsWpoDpmj',
	    bucket: 'ssyer'
    });

$(document).ready(function(){

	    var ft_imgId = localStorage.getItem("id");
	    var aliPay = localStorage.getItem("alipay");
    	var wxPay = localStorage.getItem("wxpay");
    	if(aliPay != null || wxPay != null){
        	$(".segmentation").css("display","inline-block");
        	$(".exceptional").css("display","inline-block");
        }
//	}
//获取图片和用户信息、头像信息、加载评论	    

    $.ajax({
    	type:"post",
    	url:$('#p_s_f_website_url').val()+"/pc/order/details_text",
    	data:{"orderId":ft_imgId},
    	success:function(res){

                		$(".labelCN").text(res.data.Title);

    	},
    	error:function(){
    	}	
    });
    

//获取图片和用户信息、头像信息、加载评论结束

//图片下载效果
    $(".download").on("click",function(){
    	var imgurl = $(".img").css("backgroundImage");
    	var imgUrl = imgurl.substring(5,66);
    	window.location.href = imgUrl;
    });
//图片下载效果结束

//获取当前时间
	setInterval(function(){
		var myDate = new Date();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes(); //获取当前分钟数(0-59)
        if(h>=10&&m>=10){
        	var time = h+":"+m;//预留符号 ∶
        }else if(h>=10&&m<10){
        	var time = h+":"+"0"+m;
        }else if(h<10&&m>=10){
        	var time = "0"+h+":"+m;
        }else if(h<10&&m<10){
        	var time = "0"+h+":"+"0"+m;
        }
//	        console.log(time);
        $(".time").text(time);
        $(".tIme").text(time);
	},100);
//时间代码结束

//问候语  四个时段  动态变更四句中文
	var myDate = new Date();
	var h=myDate.getHours();
//      console.log(h);
    var morningCN = "早上好，";
    var noonCN = "中午好，";
    var afternoonCN = "下午好，";
    var nightCN = "晚上好，";
    if(h>=18||h<=4){
    	$(".greetingsCN").text(nightCN);
    }else if(h>=5 && h<=10){
    	$(".greetingsCN").text(morningCN);
    }else if(h>=11 && h<=12){
    	$(".greetingsCN").text(noonCN);
    }else{
    	$(".greetingsCN").text(afternoonCN);
    }
    var adMin = $(".admin").text();
//    console.log(adMin);
    if(adMin == ""){
    	$(".login").css({"display":"inline-block"});
    }else{
    	$(".login").css({"display":"none"});
    }
//问候语结束


    $(".login").on("click",function(e){
//    	console.log(2222);
    	$("#s2_back").css({
    		"display":"block"
    	})
    	$("#s2_log_reg_form_div").css({
    		"display":"block"
    	})
//    	console.log(3333);
    	e=event||window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble=true ;
		}
		
    })
//输入框相关效果(包括发布按钮和分享选框)
    $(".textarea").on("click",function(e){
//    	e=event||window.event;
//		if(e.stopPropagation){
//			e.stopPropagation();
//		}else{
//			e.cancelBubble=true ;
//		}
		cancelBubble(); 
	});
    setInterval(function(){
        var textArea = $(".textarea").val();
//      console.log(textArea.length);
        if(textArea.length >= 1){
        	$(".share").css({"display":"block"}).stop().animate({
        		opacity:"1",
        		filter:"alpha(opacity=100)"
        	},600);
        	$("#release").css({"display":"block"}).stop().animate({
        		opacity:"1",
        		filter:"alpha(opacity=100)"
        	},600);
        }else{
        	$(".share").stop().animate({
        		opacity:"0",
        		filter:"alpha(opacity=0)"
        	},600);
        	$("#release").stop().animate({
        		opacity:"0",
        		filter:"alpha(opacity=0"
        	},600);
        	var opaShare = $(".share").css("opacity");
        	var opaRelease = $("#release").css("opacity");
        	if(opaShare == "0" && opaRelease == "0"){
        		$(".share").css({"display":"none"});
        		$("#release").css({"display":"none"});
        	}
        }
        if(textArea.length >= 11 && textArea.length < 25){
        	$(".textarea").css({"font":"24px ''"});
        }else if(textArea.length >= 25 && textArea.length < 35){
        	$(".textarea").css({"font":"18px ''"});
        }else if(textArea.length >= 35){
        	$(".textarea").css({"font":"14px ''"});
        }else{
        	$(".textarea").css({"font":"30px ''"});
        }
//字数上限提示框        
        if(textArea.length > 120){
        	$(".upperLimit").css({"display":"block"}).stop().animate({
        		opacity:"0.8",
        		filter:"alpha(opacity=80"
        	},400)
        }else{
        	$(".upperLimit").stop().animate({
        		opacity:"0",
        		filter:"alpha(opacity=0"
        	},400);
        	var opaUpperLimit = $(".upperLimit").css("opacity");
        	if(opaUpperLimit == "0"){
        		$(".upperLimit").css({"display":"none"});
        	}
        }
    },400)
//输入框相关效果结束
        
    
//发布按钮2效果 
    $(".release_2").on("click",function(){
  	    var content = $(".textarea").val();
  	    var orderId = ft_imgId;
  	  if(content.length > 120 || content.length < 1){
	    	return false;
	    }else{
	    	var imgAuthorId
	    	$.ajax({
	    		type: "post",
	            url: $('#p_s_f_website_url').val()+"/pc/guestbook/guestbook",            
	            data: {
	            	"content":content,
	            	"orderId":ft_imgId,
	            	"orderUserId":imgAuthorId    	
	            },
	            success: function (data) {
	                if(data.data.success == true){
	                	if(data.rspCode == 0){
	                		$(".susu").css("display","block").stop().animate({
	                			opacity:"0",
	                			filter:"alpha(opacity=0)"
	                		},800);
	                		var opaSusu = $(".susu").css("opacity");
	                		if(opaSusu == "0"){
	                			$(".susu").css("display","none");
	                		};
	                		setTimeout(function(){
	                			window.location.reload();
	                		},1000);
	                	}
	                }
	            },
	            error:function(){
	            	console.log(2222);
	            }
	        })
	    }
        return false;
    });
//发布按钮2效果结束
    

//更改字体效果
    $(".fontColor").on("mouseover",function(){
    	$(".fontC").css({"display":"block"}).stop().animate({
    		bottom:"-20px",
    		opacity:"0.8",
    		filter:"alpha(opacity=80"
    	},300);
    });
    $(".fontColor").on("mouseout",function(){
    	$(".fontC").animate({
    		bottom:"-50px",
    		opacity:"0",
    		filter:"alpha(opacity=0"
    	},300);
    	var opaFont = $(".fontC").css("opacity");
//  	console.log(opaFont)
    	if(opaFont == "0.8"){
    		$(".fontC").css({"display":"none"});
    	}
    });
    
    var fontNum = 0;
    $(".fontColor").on("click",function(e){
//    	e=event||window.event;
//    	if(e.stopPropagation){
//    		e.stopPropagation();
//    	}else{
//    		e.cancelBubble=true ;
//    	}   	
    	cancelBubble();    	
    	if(fontNum == 0){
    		$(".fontColor").css({"background":"url(../../resources-1.0/images/fontColor-black.png) no-repeat center center"});
    		$(".logo").css({"color":"#000"});
	    	$(".time").css({"color":"#000"});
	    	$(".tIme").css({"color":"#000"});
	    	$(".greetingsCN").css({"color":"#000"});
            $(".admin").css({"color":"#000"});
	    	$(".labelCN").css({"color":"#000"});
	    	$("#input").css({"border-bottom":"6px solid #000","color":"#000"});
	    	$(".textarea").css({"color":"#000"});
	    	$(".shareLabel").css({"color":"#000"});
	    	fontNum++;
    	}else if(fontNum == 1){
    		$(".fontColor").css({"background":"url(../../resources-1.0/images/fontColor-white.png) no-repeat center center"});
    		$(".logo").css({"color":"#fff"});
	    	$(".time").css({"color":"#fff"});
	    	$(".tIme").css({"color":"#fff"});
	    	$(".greetingsCN").css({"color":"#fff"});
	    	$(".admin").css({"color":"#fff"});
	    	$(".labelCN").css({"color":"#fff"});
	    	$("#input").css({"border-bottom":"6px solid #fff","color":"#fff"});
	    	$(".textarea").css({"color":"#fff"});
	    	$(".shareLabel").css({"color":"#fff"});
    		fontNum--;
    	}
    	return false;
    });
//更改字体效果结束
//向下箭头指示效果 
    var downNum = 0;
    setInterval(function(){	
    	if(downNum == 0){
    		$(".down").stop().animate({
	    		top:"97vh",
	    		opacity:"1",
	    		filter:"alpha(opacity=100)"
	    	},800);
	    	downNum++;
    	}else{
    		$(".down").stop().animate({
	    		top:"93vh",
	    		opacity:"0.1",
	    		filter:"alpha(opacity=10)"
	    	},800);
	    	downNum--;
    	}
    },1000);
//向下箭头指示效果结束
    
//输入框下表效果
//    setInterval(function(){
//    	
//    },1500);
//输入框下表效果结束   
    $(".close_log_reg_form").on("click",function(){
      $("#s2_back").css({"display":"none"});
    })
//屏幕滚动效果
    var documentHeight;//滚动到底部事件
    $(window).scroll(function(){
    	documentHeight = $(document).height();
    	var targetH = $(window).height()+$(document).scrollTop();
    	var sTop = $(window).scrollTop();
//  	documentHeight == targetH  //滚动到底部的判断条件
//  	console.log(documentHeight);//2880
    	var hiddenInp = $("#hiddenInp").val();
    	if(hiddenInp == 1){ 
	    	if(documentHeight == targetH){
	//  		console.log(1);
		    		$("footer").stop().animate({
			            	bottom:"0"
			        },500);
			        $("body").css({"overflow-y":"hidden"});
			        $(".mains").css({"overflow-y":"scroll"});

		    	}else{
		    		$("footer").stop().animate({
		            	bottom:"-50px"
		            },500);
		            $(".mains").css({"overflow-y":"hidden"}); 
		    	}
    	}
//      console.log(sTop);
		if(scroll){
		    if(sTop>documentHeight*0.10&&sTop<=documentHeight*0.20){//240  360
		    	$(".laminate").css({"display":"block"});
		    	$(".laminate").stop().animate({
		    		opacity:"0.3",
		    		filter:"alpha(opacity=50)"
		    	},100)
		    }else if(sTop>documentHeight*0.20&&sTop<=documentHeight*0.30){//360 480
		    	$(".laminate").css({"display":"block"});
		    	$(".laminate").stop().animate({
		    		opacity:"0.1",
		    		filter:"alpha(opacity=20)"
		    	},100)
		    }else if(sTop>documentHeight*0.30){//480
		    	$(".laminate").stop().animate({
		    		opacity:"0",
		    		filter:"alpha(opacity=0)"
		    	},100)
		    }
		    var opaLaminate = $(".laminate").css("opacity");
		    if(opaLaminate == 0){
		    	$(".laminate").css({"display":"none"});
		    }
		}
	});
//屏幕滚动效果结束

//回到顶部按钮Top	
	$(".toTop").on("click",function(){
//		alert(1);
		timer = setInterval(function(){
	      //获取滚动条距离顶部高度
	      var osTop = document.documentElement.scrollTop || document.body.scrollTop;
	      var ispeed = Math.floor(-osTop / 7);
	      document.documentElement.scrollTop = document.body.scrollTop = osTop+ispeed;
	      //到达顶部，清除定时器
	      if (osTop == 0) {
	        clearInterval(timer);
	      };
	      isTop = true; 
	    },20);
	});
//回到顶部效果结束

//红心点赞效果
//	$(".praise").on("click",function(){
//    	var isView = $(this).attr("isView");
//    	if(isView == "true"){
//    	    console.log(isView);	
//    		$(this).css({"background":"url(./img/stx.png) no-repeat center center","background-size":"100% 100%"});
//            $(this).attr("isView","false");
//    	}else{
//    		$(this).css({"background":"url(./img/ktx.png) no-repeat center center","background-size":"100% 100%"});
//            $(this).attr("isView","true");
//    	}
//    });
//红心点赞效果结束
//操作more效果
//    $(".more").on("click",function(){
//    	alert("点击成功");
//    });
//操作more效果结束

//load加载更多评论
    var loadNum = 0;
    $(".load").on("click",function(){
    	loadNum+=10;
//    	console.log(loadNum);
    	$.ajax({
    		type:"post",
    		url:$('#p_s_f_website_url').val()+"/pc/guestbook/list",
            data:{"orderId":ft_imgId,"start":loadNum,"limit":10},
    		success:function(data){
    			var data=data.data.datas;
    			for(var i = 0; i < data.length; i++){
    				var $clone=$('.li1:hidden').clone(true);
    				var face = data[i].face;
    				if(face == null){
//    					console.log(1111);
    					face="http://ssyer.oss-cn-hangzhou.aliyuncs.com/uploads/nopic_user.jpg";
    				}
    			}
    		}
    	});
    });
//load结束

//监听鼠标滚轮
    var Height_1 = Number();
	var Height_2 = Number();
	var Height_3 = Number();
	var scrollFunc = function(e) {
		var direct = 0;
		e = e || window.event;
		var t1 = document.getElementById("wheelDelta");//IE/Opera/Chrome
		var t2 = document.getElementById("detail");//Firefox 
		Height_1+= e.deltaY;
		Height_2+= e.detail;
		Height_3+= e.wheelDelta;
		var hiddenInp = $("#hiddenInp").val();
    	if(hiddenInp == 1){ 
			if(Height_1 < Height_1*0.90 || Height_3 < Height_3*0.90){
				$("body").css({"overflow-y":"auto"});
			}
			if(Height_2 < Height_2*0.90){
				$("body").css({"overflow-y":"auto"});
			}
    	}
//		    ScrollText(direct); 
	}
	/*注册事件*/
	if(document.addEventListener){
		document.addEventListener('DOMMouseScroll', scrollFunc, false);
	} //W3C 
	window.onmousewheel = document.onmousewheel = scrollFunc; //IE/Opera/Chrome/Safari
//监听鼠标滚轮结束


//点击图说详情页的发表过评论的用户头像，进入到作者的详情页
    $(".headUl").on("click","li",function(){
        var userId = $(this).attr("data-userId");
        window.open($('#p_s_f_website_url').val()+"/pc/order/ud?ud=ssyer/cerother&id="+userId,"_self");
  		return false;
  	});
//点击头像效果结束
});
	

function getEvent(){
    if(window.event)    {return window.event;}
    func=getEvent.caller;
    while(func!=null){
        var arg0=func.arguments[0];
        if(arg0){
            if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                || arg0.constructor==KeyboardEvent)
                ||(typeof(arg0)=="object" && arg0.preventDefault
                && arg0.stopPropagation)){
                return arg0;
            }
        }
        func=func.caller;
    }
    return null;
}

function cancelBubble()
{
    var e=getEvent();
    if(window.event){
        //e.returnValue=false;//阻止自身行为
        e.cancelBubble=true;//阻止冒泡
    }else if(e.preventDefault){
        //e.preventDefault();//阻止自身行为
        e.stopPropagation();//阻止冒泡
    }
}
















