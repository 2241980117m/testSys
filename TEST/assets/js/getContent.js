window.onload=function(){
	   getCon();
    var pageIndex = 1;
    var pageSize = 2;
    var count = 1;     //记录当前的数据数
    var current;   //当前的数据
    var selectCount = 7;   //选择题总数
    var randomArray = new Array();    //存储随机数的数组，为了防止选取同样的数
    var content = new Array();        //存储随机选取出来的题
    var succ;
    var answerArray = new Array();
    var answerObj={data:''};
    var count = 0;
    var time;  //定时器
    var converyObj ={
    	answer:'',
    	question:'',
    	options:'',
    	isChecked:'',
    	isCorrect:''
    };  //传入后台的对象
    var correctArr = new Array();
    var questionArr = new Array();
    var selectArr = new Array();
    var w;   //定义web worker
    var ocontain = document.getElementsByClassName("content")[0];
    //启动定时器
 
    	timer();
  
    foreSee();
	//请求后台数据
	function getCon(){
		$.ajax({
			url:'content.json',
			type:'GET',
			dataType:'json',
			success:function(data){
				 successAction(data);
			},
			error:function(){
               alert("请求出错了！！");
			}
		});
	}

        //进行答案比对
        function getGrade(data){
        	var obj = data.answer;
        	var count = 0; 
        	correctArr = new Array();
        	selectArr = new Array();
        	questionArr = new Array();

        	for(var i=0;i<content.length;i++){      		
        		for(var m=0;m<obj.length;m++){
        			var result = obj[m].result;
        			if(content[i].id == obj[m].id&&localStorage.select){
        				 if(result == JSON.parse(localStorage.select).data[i]){
        				 	count++;
        				 	correctArr.push("对");
        				    break;
        				 	//correctArr.push(true);
        				 }
        				 
        			}
        		}
        		if(m == obj.length){
        			correctArr.push("错");
        		}
        		
        	}
        	/*alert("共答对了"+count+"道题");*/
        	sumQuestion();
        	if(localStorage.select){
        		converyObj.answer = JSON.parse(localStorage.select).data;
        	}
        	converyObj.isCorrect = correctArr;
        	converyObj.options = selectArr;
        	converyObj.question = questionArr;
        	//converyObj.name = "mxh";
        	console.log(converyObj);
        	convery(converyObj);
        }
	function getRandom(num1,num2){
       var range = num2 - num1;
       var random = num1 + Math.random()*range;
       return Math.round(random);
	}

	function successAction(obj){
				 var oa,a;
				 console.log("请求成功！！");
				 console.log(obj);
				 
                //将选择题随机选取  并存入数组
				  if(!localStorage.content){
					  	for(var i=0;i<selectCount;i++){
						console.log("i:"+i);
						//遍历一下是否重复
						if(randomArray.length){
							while(1){
								var random = getRandom(0,obj.content.length-1);
								for(var j=0;j<randomArray.length;j++){
									if(random == randomArray[j]) break;
								}
								if(j == randomArray.length) break;
							}
						}else{
							var random = getRandom(0,obj.content.length-1);
						}
						console.log("random:"+random);
	                    randomArray.push(random);
	                    content.push(obj.content[random]);
	                }
	                localStorage.content = JSON.stringify({'data':content});
				  }else{
				  	content = JSON.parse(localStorage.content).data;
				  }
                   console.log(randomArray.length);
	               //将第一个页面渲染出来
	               preContent(1);
		}

			//根据class,清除元素
			function clearEle(cla){				
                var ele = document.getElementsByClassName(cla);
                console.log("清除元素的个数是:"+ele.length);
                while(ele.length){
                	ocontain.removeChild(ele[0]);
                }
			}

			function preContent(index){
				//渲染一页的内容
				count = 0;
				for(var i=2*index-pageSize;i<=2*index-1&&i<selectCount;i++){
					 //创建div.select
                    var odiv = document.createElement("div");
                    odiv.className="select";
                    //创建span
                    var ospan = document.createElement("span");
                    ospan.innerHTML = i+1+'.';
                    ospan.className="num";
                    //创建label元素
                    var olabel = document.createElement("label");
                    olabel.innerHTML = content[i].question;

                    //创建ul.option元素
                    var oul = document.createElement("ul");
                    oul.className="option";
                    var temp = isChecked(i);
                    for(j=0;j<Object.keys(content[i].options).length;j++){
	                   	  var oli = document.createElement("li");
	                   	  var oinput = document.createElement("input");
	                   	  oinput.type="radio";
	                   	  oinput.name = "select"+count;
	                   	  //oinput.value = Object.values(content[i].options[j])[0];
	                   	  oinput.value = Object.keys(content[i].options)[j];
	                   	  
	                   	  if(temp==j){
	                   	   	oinput.checked = true;
	                   	  }

	                   	  boundClick(oinput,count,i);

	                   	  
	                   	  var span = document.createElement("span");
	                   	  span.innerHTML = Object.keys(content[i].options)[j];
	                   	  var label = document.createElement("label");
	                   	  label.innerHTML = Object.values(content[i].options)[j];
	                   	 // oli.innerHTML = obj.content[random].options[j];
	                   	  oli.appendChild(oinput);
	                   	  oli.appendChild(span);
	                   	  oli.appendChild(label);
	                   	  oul.appendChild(oli);
                   }
	                   odiv.appendChild(ospan);
	                   odiv.appendChild(olabel);
	                   odiv.appendChild(oul);
	                   ocontain.appendChild(odiv);   
	                   count++;
				}
				//生成下一页  上一页的按钮
				if(index == 1){

				    var	oa = document.createElement("button");
					oa.href="#";
					oa.className="btn btn-success next";
					oa.innerHTML = "下一页";	
					ocontain.appendChild(oa);
					ocontain.appendChild(oa);
					boundNext();
				}else if(selectCount - index*pageSize <= 0){
					var a = document.createElement("button");
						a.href="#";
						a.className="btn btn-info pre";
						a.innerHTML = "上一页";	
					var button = document.createElement("button");
					    button.className = "btn btn-warning submit";
					    button.innerHTML = "提交";
					var btn = document.createElement("button");
					   // btn.className = "foresee";
					   // btn.innerHTML = "预览";
					    boundSubmit(button);
						ocontain.appendChild(a);
						ocontain.appendChild(button);
						//document.body.appendChild(btn);
					    boundPre();
					    //当时间为0时禁止提交
					   // alert(localStorage.hour+":"+localStorage.minute+":"+localStorage.second);

					    if(localStorage.hour==0&&localStorage.minute==0&&localStorage.second==0){
				       	 	 document.getElementsByClassName("submit")[0].disabled=true; 
       	 				}			
				}else{
					   var oa = document.createElement("button");
						oa.href="#";
						oa.className="btn btn-info pre";
						oa.innerHTML = "上一页";

						var a = document.createElement("button");
						a.href="#";
						a.className="btn btn-success next";
						a.innerHTML = "下一页";	
						ocontain.appendChild(oa);
						ocontain.appendChild(a);
						//给pre绑定事件
					 boundPre();
					 boundNext();
				}


			}
	   //绑定pre事件
		function boundPre(){
		   document.getElementsByClassName("pre")[0].onclick = function(){
					   pageIndex--;
					   clearEle("select");
					   clearEle("pre");
					   clearEle("next");
					   clearEle("submit");
					   preContent(pageIndex);

			}
		}	
		//绑定next事件
		function boundNext(){
		         document.getElementsByClassName("next")[0].onclick = function(){
		         	      // storeAnswer(pageIndex);
						   	pageIndex++;
						    clearEle("select");
							clearEle("pre");
							clearEle("next");
							clearEle("submit");
						    preContent(pageIndex);	

						}
		}
/*<div class="col-md-2">
        		<p>1</p>
        			<div class="col-md-12">
        				<div class="sign"></div>
        			</div>    		
        	</div>*/

         //绑定input click事件
         function boundClick(obj,count,i){
         		  obj.onclick = function(){
        	                 	var temp = getSelect("select"+count);     
        	                 	if(localStorage.select){
        	                 		answerArray = JSON.parse(localStorage.select).data;
        	                 	} 	                 	
								answerArray[i]=temp;
								answerObj.data = answerArray;
								localStorage.select = JSON.stringify(answerObj);
								//刷新预览的内容
								var body = document.getElementsByClassName("body_1")[0];
								var orow = body.getElementsByClassName("row")[0];
								var col = orow.getElementsByClassName("col-md-3")[i].getElementsByClassName("sign")[0];
								col.innerHTML = temp;
        	       }
                
         }
         //绑定提交事件
         function boundSubmit(obj){
         	  // clearTimeout(time);
         	   obj.onclick = getAnswer;
         }

         //请求答案并进行比对
         function getAnswer(){
         	   	   $.ajax({
        				'url':'./answer.json',
        				type:'GET',
        				dataType:'json',
        				success:function(data){
        					getGrade(data);
        				}
        			});
          }
     //     foresee();

		//得到选取的选项
		function getSelect(name){
			//alert(name);
			var answer = document.getElementsByName(name);
				for(var j=0;j<answer.length;j++){
					if(answer[j].checked){
						var temp = answer[j].value;
						console.log(answer[j].value);
					}
			 }
			return temp;
		}

		//判断之前该选项是否被选，若选择则渲染到页面上
		function isChecked(index){
				if(localStorage.select){
					var obj = JSON.parse(localStorage.select).data;
					if(obj[index]){
						//ele.checked = true;
						switch(obj[index]){
							case 'A':return 0;
							case 'B':return 1;
							case 'C':return 2;
							case 'D':return 3;
							default:return false;
						}
					}
				}
		}
		//根据localStorage的内容，将该部分所有结果渲染到页面上

       //将问题，选项，答案，对错传入后台 
       function convery(obj){
       		$.ajax({
       			url:'http://192.168.1.240:2000/',
       			type:'GET',
       			dataType:'jsonp',
       			data:{
       				'data':obj
       			},
       			xhrFields:{
       				withCredentials:true
       			}, 
       			jsonp:'callback',
       			jsonpCallback:'handler',
       			success:handler,
       			error:function(jq,err,code){     				
       				 alert(err.message);
       				
       			}
       		})
       }

       function sumQuestion(){
       	  //将所有的问题、选项封装起来

        	for(var n=0;n<content.length;n++){
        		questionArr.push(content[n].question);
        		selectArr.push(content[n].options);
        	}
       }

       function handler(data){
       	  if(data.code == 2){
       	  	 alert("提交数据成功");
       	  	 // clearInterval(Time);
       	  	 w.terminate();
       	  	 localStorage.clear();
       	  	
       	  	window.location.href="./test2.html";
       	  }else if(data.code == 1){
       	  	 alert("数据已经提交过，不能再次提交！");
       	  	 document.getElementsByClassName("submit").disabled=true
       	  	//  clearInterval(Time);
       	  	 w.terminate();
       	  	 localStorage.clear();
       	  	
       	  }else{
       	  	 alert("存入数据出错!");
       	  }
       }

       //倒计时
       function timer(){
       	  //将时间在localStorage中存储
		   if(!localStorage.hour){
			   setTime();
		   }
   		 var hour = parseInt(localStorage.hour);
       	 var minute =  parseInt(localStorage.minute);
       	 var sec = parseInt(localStorage.second);
       	 if(hour==0&&minute==0&&sec==0){
       	 	 document.getElementsByClassName("hour")[0].innerHTML = "00";
             document.getElementsByClassName("minute")[0].innerHTML = "00";
             document.getElementsByClassName("second")[0].innerHTML = "00";
       	 	
       	 }else{
       	 	if(typeof("Worker")!="undefined"){
       	 		if(typeof("w")!="undefined"){
       	 		    w = new Worker("./timer.js");
       	 			
       	 		}
       	 			w.postMessage({"hour":hour,"min":minute,"sec":sec});
       	 	
       	 		w.onmessage=function(event){
       	 		   localStorage.hour=event.data.hour;
       	 		   localStorage.minute=event.data.min;
       	 		   localStorage.second=event.data.sec;	
                   document.getElementsByClassName("hour")[0].innerHTML = timeSwitch(event.data.hour);
                   document.getElementsByClassName("minute")[0].innerHTML = timeSwitch(event.data.min);
                   document.getElementsByClassName("second")[0].innerHTML = timeSwitch(event.data.sec);
                   if(parseInt(event.data.min)==0&&parseInt(event.data.hour)==0&&parseInt(event.data.sec)==0){
                   	  //alert("进入自动提交");
       	 			  getAnswer();  
       	 			  document.getElementsByClassName("submit")[0].disabled=true;    	                   	             
       	 		   }
       	 		}
       	   }else{
       	 	  alert("本浏览器不支持web worker!!");
       	   }
       	 }
       	        	

       }

       function timeSwitch(data){
          if(data<10){
          	return '0'+data;
          }else{
          	return data;
          }
       }

      function foreSee(){
      	if(localStorage.select){
      		var obj = JSON.parse(localStorage.select).data;
      		for(var i=0;i<obj.length;i++){	
      			if(obj[i]){
      			   //刷新预览的内容
				   var body = document.getElementsByClassName("body_1")[0];
				   var orow = body.getElementsByClassName("row")[0];
				   var col = orow.getElementsByClassName("col-md-3")[i].getElementsByClassName("sign")[0];
				   col.innerHTML = obj[i];
			   }
      		}
      	}
      }
      //设置答题的总时间
       function setTime(){
       	     localStorage.hour = 0;
       	  	 localStorage.minute =10;
       	  	 localStorage.second =10;
       }

}