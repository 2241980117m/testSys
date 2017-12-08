window.onload=function(){
	//筛选出数据库状态为3且count值最小的姓名，学号
	//评论为空时提示，超过字数提示
  const URL = "http://192.168.1.240";
	var next = document.getElementsByClassName("submit")[0];
  var exit = document.getElementById("exit");
	var judge = document.getElementsByClassName("textarea")[0];
	var id;
  
	if(!localStorage.flag){
    getPerson();
  }else{
    let name = document.getElementsByClassName("name")[0];
     if(localStorage.name){
       name.innerHTML = localStorage.name;
     }

    if(localStorage.judge){
      document.getElementsByClassName("textarea")[0].value = localStorage.judge;
    }
  }
	next.onclick = function(){   
         updateStatus();
         document.getElementsByClassName("textarea")[0].value="";
	};
  exit.onclick=function(){
          quit();
         
  }

  document.getElementsByClassName("textarea")[0].onchange=function(){
       localStorage.judge = this.value;
  }

    function getPerson(){
    	$.ajax({
		   url:URL+':2200/interview',
		   type:'GET',
		   dataType:'jsonp',
		   jsonp:'callback',
		   jsonpCallback:'handler',
		   xhrFields:{
       			withCredentials:true
       		}, 
       crossDomain:true,
		   success:handler,		  
		   error:function(){
		   	alert("请求失败！");
		   }
		});
    }

    function updateStatus(){
    	//更改此时该学生的状态并且面试下一个学生
    	$.ajax({
           url:URL+':2200/next',
           data:{
           	  name:document.getElementsByClassName("name")[0].innerHTML,
           	  id:id,
           	  
           	  judge:judge.value
           },
           dataType:'jsonp',
           jsonp:'callback',
           jsonpCallback:'handler',
           xhrFields:{
           	  withCredentials:true
           },
           success:handler,
           error:function(){
               alert("请求失败！");
           }
    	})
    }
   function quit(){
   /* alert("请求退出");*/

      //更改此时该学生的状态并且面试下一个学生
      $.ajax({
           url:URL+':2200/exit',
           data:{
              name:document.getElementsByClassName("name")[0].innerHTML,
              id:id,            
              judge:judge.value
           },
           dataType:'jsonp',
           jsonp:'callback',
           jsonpCallback:'leave',
           xhrFields:{
              withCredentials:true
           },
           success:leave,
           error:function(){
               alert("请求失败！");
           }
      })
    }
   function leave(obj){
      console.log(obj);
     /* alert("准备退出");*/
      if(obj.code == 0){
        alert("请求失败！！");
      }else if(obj.code == 1){
        localStorage.clear();
        window.location.href="./interViewerSign.html";
      }
   }
    function handler(obj){
    	console.log(obj);
    	if(obj.code == 0){
    		alert("你们组已经面试完毕！！请等待下轮面试");
        localStorage.clear();
       // window.location.href="./interViewerSign.html";
    	}else if(obj.code ==1){
    		var name = document.getElementsByClassName("name")[0];
    		var load = document.getElementsByClassName("load")[0];
    		//load.href=obj.href;
	        name.innerHTML = obj.name;
          localStorage.name = obj.name;

	        id=obj.id;
          localStorage.flag = 1;
    	}else{
          alert("请先登录！！");
       } 
      }
}