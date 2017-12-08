window.onload=function(){
	//绑定提交事件
	const URL='http://192.168.1.240';

	let obj={
		  check(obj){
			$.ajax({
				url:URL+':2300/check',
				type:'GET',
				data:obj,
				dataType:'jsonp',
				jsonp:'callback',
				xhrFields:{
       				withCredentials:true
       			}, 
				jsonpCallback:this.isCorrect.name,
				success:this.isCorrect,
				error:function(){
					alert("请求数据失败");
				}
			})
		 },
		 isCorrect(obj){
			if(obj.code == 1){
				window.location.href="./reader.html";
			}else{
				alert("数据输入错误!!");
			}
		}
	};

	$(".submit").click(()=>{
		let info={};
		info.user = $("[type='text']").val();
		info.pass = $("[type='password']").val();
		console.log("此时的用户名和密码是:"+info.user);
		//return info;
		obj.check(info);
	});

	
}