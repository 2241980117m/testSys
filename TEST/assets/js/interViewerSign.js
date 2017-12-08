window.onload=function(){

	const URL = "http://192.168.1.240";
	var user = document.getElementsByClassName("id")[0];
	var pass = document.getElementsByClassName("pass")[0];
    var osb = document.getElementsByClassName("submit")[0];
    osb.onclick = function(){
       $.ajax({
			url:URL+":2200/",
			type:"get",
			data:{
				user:user.value,
				pass:pass.value
			},
			dataType:'jsonp',
			jsonp:"callback",
			jsonpCallback:"handler",
			xhrFields:{
       			withCredentials:true
       		}, 
			success:handler,
			error:function(jq,err,text){
				alert(err.message+text);
			}
	  });
    }
	
	function handler(obj){
       if(obj.status == 1){
       	window.location.href="./interViewer.html";
       }else{
       	 alert("输入的用户名或者密码错误");
       }

	}
}