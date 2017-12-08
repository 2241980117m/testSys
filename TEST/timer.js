var hour,min,sec,time;
onmessage=function(event){

	console.log("接收数据！！");
	     hour = parseInt(event.data.hour);
       	 min =  parseInt(event.data.min);
       	 sec = parseInt(event.data.sec);
       time = setInterval(function(){
       		 getTime();
       	},1000);
}

function getTime(){
	console.log("得到数据！！");
	const now = new Date();
	if(min==0&&sec==0&&hour==0){
		if(time){
			clearTimeout(time);
		}
		return;
	}
	if(hour!=0&&sec==0&&min==0){
        hour--;
        min=60;
	}
	if(sec==0){
		min--;
		sec = 60;
	}	
	sec--;
	postMessage({"hour":hour,"min":min,"sec":sec});

	
}

