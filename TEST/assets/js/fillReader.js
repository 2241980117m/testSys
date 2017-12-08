window.onload=function(){
	let data = [];
	
	let serverUrl = "http://192.168.1.240";
	let port = 2300;

	let URL=serverUrl+"/TEST/Files/";
	let urlArr = ["fill.json","instrest.json","code.json","add.json"];    //存储考生文件的后缀名
	let correctUrl = ["fresult.json"];              //对应的每个部分的答案
	let sele = ["fill","instrest","code","add"];    //每个文件中的选择器
	let i;    //存储的是第几个学生
	//let dataObj = {};    //存储数据库返回的学生的信息

    fillInfo();
    getUrl();

    //处理错误信息
   /* if(window.addEventListener){
	    window.addEventListener('error', function (e) {
	        var error = e.error;
	        console.log(error);
	    });
	}else if(window.attachEvent){
	    window.attachEvent('onerror', function (e) {
	        var error = e.error;
	        console.log(error);
	    });
	}else{
	    window.onerror = function(e){
	        var error = e.error;
	       console.log(error.message);
	    }
	}*/

    //将每个学生的卷面展示出来
    function showItem(clas,id,name){
    	//将数据库中的方向映射到相应的文件夹的名字
       clas = changeStr(clas);
       let p3,p4;
       let p2 = getItemData(".fill_content",URL+clas+"/"+id+"/"+id+"_"+urlArr[0],0).then((d)=>{
    	   if(p2) { p3 = getItemData(".instrest_content",URL+clas+"/"+id+"/"+id+"_"+urlArr[1],1);
    	}
    	if(p3) {
    		p3.then(()=>{
    		p4 = getItemData(".code_content",URL+clas+"/"+id+"/"+id+"_"+urlArr[2],2);
    		if(p4){ p4.then(()=>{
    			getItemData(".add_content",URL+clas+"/"+id+"/"+id+"_"+urlArr[3],3);
    		});
    	}
    	})
    	}
       });
       return p2;
    }
    

	//得到每个url的数据并将其渲染到页面上
	function getItemData(selector,url,i){
		let p1 = obj.getAnswer(url);
		let pro1;
		p1.then((dataObj)=>{
			/*console.log("dataObj::"+Object.keys(dataObj));
			console.log("sele::"+sele[i]);*/
		  
			console.log("data::"+dataObj[sele[i]]);
		    pro1 = obj.getCorrectAnswer(dataObj[sele[i]],"./fresult.json");
		    pro1.then(()=>{
			    obj.success_Action(selector,dataObj[sele[i]]);					
		    });
		}).catch(function(){
			return null;
		});
		return p1;
	}
	
	//得到每个学生对应的数据
    function getUrl(){
    	EventHandler('/getItem',callback);	
    }

    function callback(obj){
    	if(obj){
    		dataObj = obj;
    	}else{
    		console.log("没有传递obj");
    		obj = dataObj;
    	}
    	console.log(obj.data);
    	console.log("length:"+obj.data.length);
    	let arr = obj.data;
    	
    	if(localStorage.index){
    		i = Number(localStorage.index);
    	}else{
    		i=0;
    		localStorage.index = i.toString();
    	}
    	if(i<obj.data.length){
    		console.log("i::"+i);	
	    	console.log(arr[i]);
	    	$(".name").text(arr[i].name);
	    	$(".id").text(arr[i].id);
	    	let p1 = showItem(Number(arr[i].direction),arr[i].id,arr[i].name);
    	}else{
    		alert("已经批改完");
    		//销毁localStorage
    		localStorage.clear();
    	}
    	
    }

    //得到每个学生的信息的函数
    function getItem(arr){
    	for(let i=0;i<arr.length;i++){
    		showItem(arr[i].direction,arr[i].id,arr[i].name);
    	}
    }

	//绑定提交事件
	$(".submit").click(function(){
	
		let total = 0;
	
		let length = $("[type='text']").length;
		console.log("length:"+length);

		for(let i=0;i<length;i++){
			let str = $("[type='text']").eq(i).val();
			if(str){
				console.log("eq(i)::"+parseFloat(str,10));
				total+=parseFloat(str,10);
			}
		}

		console.log("total:"+total);
		let obj = {
			"total":total,
			"id":$(".id").text(),
			"judger":$(".user").text(),
			"evaluation":$(".evaluation_content").val()
		};
		console.log("obj:::"+obj.id+","+obj.judger+obj.evaluation);
		//需要插入当前批改卷面的人的序号
		EventHandler('/insert',insertCallback,obj);
		
	});

	//提交成功的回调函数
	function insertCallback(obj){
			if(obj.code == 1){
				//alert("插入数据成功!!");
				$("body").html('');
				//下一个人的试卷
				i++;
				localStorage.index = i.toString();
				try{
					callback();
					if(i==dataObj.data.length){
						window.location.href="./manager_read.html";
					}else{
						window.location.href="./reader.html";
					}
					
				}catch(e){
					console.log(e.name+":"+e.message);
				}
			}

	}

	function EventHandler(query,call,obj){
		console.log(serverUrl+':'+port+query);
		$.ajax({
    		url:serverUrl+':'+port+query,
    		type:'GET',
    		dataType:'jsonp',
    		jsonp:'callback',
    		data:obj,
    		jsonpCallback:call.name,
    		success:call,
    		xhrFields:{
       			withCredentials:true
       		}, 
    		error:function(jq,err){
    			alert("请求数据失败！"+err);
    		}
    	})
	}

    //将数据库中的direction映射为对应的组名
	function changeStr(clas){
		switch(clas){
    		case 1:clas = "web";break;
    		case 2:clas = "安全";break;
    		case 3:clas = "运维";break;
    		case 4:clas = "运营";break;
    		case 5:clas = "设计";break;
    		default:console.log("没有匹配！！");
    	}
    	return clas;
	}

	//填充页面上的用户名和组名信息
	function fillInfo(){
		EventHandler('/read',infoCallback);
	}

	function infoCallback(obj){
		console.log("接收到后台传来的数据是:"+obj);
		obj = obj.data;
		let clas = changeStr(obj.class);
		$(".user").text(obj.name);		
		$(".class").text(clas);
	}
}