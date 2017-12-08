window.onload=function(){
	const URL = "http://192.168.1.240";
	var deep = 1;   //第一场机试
  	var colorArr = ['info','warning','danger','success'];
  	var text = ["机考中","待面试","面试中","面试结束"];

  //客户端websocket连接
  	var socket = io.connect(URL+":8080/");
 	socket.on('system',function(arr){	
 		for(var i=0;i<arr.length;i++){
 			updateStatus(arr[i]);
 		}
 	});

//定义各个函数
/*--------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------*/
	//将后台返回的每个学生的状态渲染到界面上
	function updateStatus(obj){
		console.log(obj);
		//判断数据是否存在于页面上
		var nameArr = document.getElementsByClassName("name");
		for(var j=0;j<nameArr.length;j++){
			if(nameArr[j].innerHTML == obj.name){
				//更新页面内容
                var pro = document.getElementsByClassName("progress")[j];
                pro.innerHTML = "";
                pro.innerHTML = Process(obj.status);
                if(obj.status == 4){
	              var span = document.getElementsByClassName("sign")[j];
	         
	              span.innerHTML = "请到"+obj.interviewer+"号面试地点面试";
	            
		    	}
                if(obj.status == 5){
			       var span = document.getElementsByClassName("sign")[j];			
			       span.innerHTML = "";
			       
		    	}

                break;
			}
		}
	   if(j == nameArr.length){
		   	var row = document.getElementsByClassName("row")[0];
			var col_12 = document.createElement("div");
			col_12.className="col-md-12";
			var ospan = document.createElement("span");
			ospan.className="name";
			ospan.innerHTML = obj.name;
		    var oprocess = document.createElement("div");
		    oprocess.className = "progress";
		    var ele = Process(obj.status);
		    oprocess.innerHTML=ele;
		    var span = document.createElement("span");
	        span.className = "sign";

		    col_12.appendChild(ospan);
		    col_12.appendChild(oprocess);
		    col_12.appendChild(span);
		    row.appendChild(col_12);
	   }	
	}
	function Process(data){
	    //2,3,4,5
	    var data = data - 2;
	    var ele="";
	   for(var i=0;i<=data;i++){
	   	  ele += "<div class='progress-bar progress-bar-"+colorArr[i]+"'  role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: 25%;'>"+
	   	   "<span>"+text[i]+"</span></div>";
	   }

	   return ele;
	}
}