window.onload=function(){

	  const URL = "http://192.168.1.240";
	  const enter = document.getElementsByClassName("btn-warning")[0];
      const page1 = document.getElementsByClassName("page-1")[0];
      const width = document.body.clientWidth;
      let count = 0;

      console.log("width:"+width);
    
     delete_session(); 

   var obj={
   	 'checkName':function(data){
   	 	if(!/^[\u4e00-\u9fa5]+$/.test(data)){
   	 		alert("输入的姓名不正确");
   	 		return false;
   	 	}
   	 	return true;
   	 },
   	 "checkId":function(data){
         if(!/^\d{8}$/.test(data)){
         	alert("输入的学号不正确");
         	return false;
         }
         return true;
   	 }
   }
   
   //请求后台要求销毁之前的session
   function delete_session(){
   		$.ajax({
   			url:URL+':2000/del',
   			type:'GET',
   			dataType:'jsonp',
   			jsonp:'callback',
   			jsonpCallback:'del_console',
   			success:del_console,
   			error:function(){
   				console.log("销毁失败");
   			}

   		})
   }

   	 enter.onclick=()=>{
      	    page1.style.visibility = "hidden";
      		scroll();
      }	
      function del_console(obj){
      	console.log(obj);
      	 if(obj.status){
      	 	console.log("销毁成功");
      	 }else{
      	 	console.log("销毁失败");
      	 }
      	  
      }
      function scroll(){
      	  const page2 = document.getElementsByClassName("page-2")[0];
      	  const height = page2.style.height||document.body.clientHeight;
      	  console.log("height:"+height);
      	 
      	  let time = setTimeout(function(){
      	  	count=count-10;
      	  	page2.style.marginTop = count+"px"; 
      	  	console.log(page2.style.marginTop);
      	  	if((count + height)/10 <= -1 ){
      	  		 clearTimeout(time);
      	  		 page2.style.marginTop = -height+"px"; 
      	  	}
      	  	else scroll();
      	  },0.01);
     }
   document.getElementsByClassName("submit")[0].onclick=function(){
	   	var username = document.getElementsByName("user")[0].value;
	    var password = document.getElementsByName("password")[0].value;
	    var flag1,flag2;
	    console.log("姓名:"+username);
	   	flag1 = obj.checkName(username);
	    flag2 = obj.checkId(password);
	    if(flag1&&flag2){
	    	//请求后台有没有该同学的报名信息，若有，则改变该同学的状态
	    	$.ajax({
	    		url:URL+':2000/check',
	    		type:'GET',
	    		data:{
	    			name:username,
	    			pass:password
	    		},
	    		xhrFields:{
       				withCredentials:true
       			}, 
	    		dataType:'jsonp',
	    		jsonp:'callback',
	    		jsonpCallback:'handler',
	    		success:handler,
	    		error:function(jq,err,text){
	    			alert("请求数据失败");
	    		}
	    	});
	    }
   }

   function handler(obj){
   	  if(obj.status == 1){
   	  	//删除上一次机考留下的数据
    	localStorage.clear();
   	  	window.location.replace("./test.html");
   	  }else if(obj.status == 2){
   	  	alert("输入的信息不正确或已经机考过,请核对输入的信息");
   	  }else if(obj.status == 3){
         alert("数据库更新状态失败，请联系负责人员");
   	  }else if(obj.status == 0){
   	  	 alert("查找数据库失败");
   	  }
   }

}