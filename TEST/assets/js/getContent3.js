window.onload=function(){

	const URL = "http://192.168.1.240";	
    var pageIndex = 1;
    var pageSize = 2;
    var count = 1;     //记录当前的数据数
    var current;   //当前的数据
    var answerCount = 2;   //题总数
    var randomArray = new Array();    //存储随机数的数组，为了防止选取同样的数
    var content = new Array();        //存储随机选取出来的题
    var succ;
    var answerArray = new Array();
    var answerObj={data:''};
    var count = 0;
    let beFlag = 0;   //是否被动提交的标志
    var time;  //定时器
    var converyObj ={
    	question:''
    };  //传入后台的对象
 
    var questionArr = new Array();
    var codeArr = new Array();
 
    var codeObj={'data':''};
    var w;   //定义web worker
    var ocontain = document.getElementsByClassName("content")[0];
   
     if(localStorage.hour&&localStorage.minute&&localStorage.second){
			    getCon();
  				timer();
    			foreSee();
	 }
		//请求后台数据
	function getCon(){

		$.ajax({
			url:'instrest.json',
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

		function successAction(obj){
				 var oa,a;
				 console.log("请求成功！！");

				 
                //将选择题随机选取  并存入数组
				  if(!localStorage.content){
					  	for(var i=0;i<answerCount;i++){
						console.log("i:"+i);
						//遍历一下是否重复
						if(randomArray.length){
							while(1){
								var random = getRandom(0,obj.instrest.length-1);
								for(var j=0;j<randomArray.length;j++){
									if(random == randomArray[j]) break;
								}
								if(j == randomArray.length) break;
							}
						}else{
							var random = getRandom(0,obj.instrest.length-1);
						}
						console.log("random:"+random);
	                    randomArray.push(random);
	                    content.push(obj.instrest[random]);
	                }
	                localStorage.content = JSON.stringify({'data':content});
				  }else{
				  	content = JSON.parse(localStorage.content).data;
				  }
                 //  console.log(randomArray.length);
                   console.log("content::"+content[0].question);
	               //将第一个页面渲染出来
	               preContent(1);
		   }

    			function preContent(index){
				//渲染一页的内容
				//console.log("content::"+content.data);
				count = 0;
				for(var i=2*index-pageSize;i<=2*index-1&&i<answerCount;i++){
					 //创建div.select
                    var odiv = document.createElement("div");
                    odiv.className="col-md-12 col-sm-12";
                    //创建span
                    var div1 = document.createElement("div");
                    div1.className="question";

                    var ospan = document.createElement("span");
                    ospan.innerHTML = i+1+'.';
                    ospan.className="num";
                    //创建label元素
                    var olabel = document.createElement("label");
                    olabel.className="question_content"; //class="question_content"
                    olabel.innerHTML = content[i].question;
	                    var col = document.createElement("div");
	                    col.className="col-md-12";
	                    //var col1= document.createElement("div");
	                   // col1.className="col-md-8 col-sm-8";
	                    var span1 = document.createElement("span");
	                    span1.innerHTML="你的答案:";
	                    var text = document.createElement("textarea");
	                    text.className="code_content";
	                   // var col2= document.createElement("div");
	                  //  col2.className="col-md-4 col-sm-4";
	                  //  var span2 = document.createElement("span2");
	                  //  span2.innerHTML="思路";
	                 //   var text1 = document.createElement("textarea");
	                 //   text1.className="idea_content";
	                    //if(localStorage.content)
	                  /*  if(localStorage.idea){
	                    	 var obj = JSON.parse(localStorage.idea).data;
	                    	 if(obj[i]){
	                    	 	text1.value = obj[i];
	                    	 }
	                    }*/
	                    if(localStorage.code){
	                    	var obj = JSON.parse(localStorage.code).data;
	                    	if(obj[i]){
	                    		text.innerHTML = obj[i];
	                    	}
	                    }

	                    

	                    col.appendChild(span1);
	                    col.appendChild(text);
	                //    col2.appendChild(span2);
	                 //   col2.appendChild(text1);
	                 //   col.appendChild(col1);
	                  //  col.appendChild(col2);

                       odiv.appendChild(div1);
	                   odiv.appendChild(ospan);
	                   odiv.appendChild(olabel);
	               
	                   ocontain.appendChild(odiv);  
	                   ocontain.appendChild(col); 
	                   codeOnchange(text,i);
	                //   ideaOnchange(text1,i);
	                   count++;
	                 
				}
				  let div = document.createElement("div");
	                   let button = document.createElement("button");
					   button.className = "btn btn-warning submit";
					   button.innerHTML = "提交";
					   boundSubmit(button);
					   div.appendChild(button);
					   ocontain.appendChild(div);
				

			}
	   //绑定pre事件
		function boundPre(){
		   document.getElementsByClassName("pre")[0].onclick = function(){
					   pageIndex--;
					   clearEle("col-md-12");
					   clearEle("col-sm-12");
					  /* clearEle("pre");
					   clearEle("next");
					   clearEle("submit");*/
					   preContent(pageIndex);

			}
		}	
		//绑定next事件
		function boundNext(){
		         document.getElementsByClassName("next")[0].onclick = function(){
		         	      // storeAnswer(pageIndex);
						   	pageIndex++;
						    clearEle("col-md-12");
					        clearEle("col-sm-12");
							/*clearEle("pre");
							clearEle("next");
							clearEle("submit");*/
						    preContent(pageIndex);	
						}
		}

	       //倒计时
       function timer(){
       	  //将时间在localStorage中存储
		
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
                   	  beFlag = 1;
       	 			  getAll();  
       	 			  document.getElementsByClassName("submit")[0].disabled=true;    	                   	             
       	 		   }
       	 		}
       	   }else{
       	 	  alert("本浏览器不支持web worker!!");
       	   }
       	 }
       	        	

       }

       function getRandom(num1,num2){
	       var range = num2 - num1;
	       var random = num1 + Math.random()*range;
	       return Math.round(random);
	  }

	  //根据class,清除元素
			function clearEle(cla){				
                var ele = document.getElementsByClassName(cla);
                console.log("清除元素的个数是:"+ele.length);
                while(ele.length){
                	ocontain.removeChild(ele[0]);
                }
			}

			function boundSubmit(obj){
         	 
         	   obj.onclick = getAll;
           }

           function getAll(){
           	  /*if(localStorage.content){
        		
        	  }*/
        	  //  console.log(content[0].question);
        	    sumQuestion();
        	    console.log(questionArr);
	        //	converyObj.idea = ideaArr;
	           if(localStorage.content){
	           	 converyObj.answer = JSON.parse(localStorage.content).data;
	           }
	           if(localStorage.code){
	           	 converyObj.code = JSON.parse(localStorage.code).data;
	           }
	        	
	        	converyObj.question = questionArr;
	        	console.log(converyObj);
	        	console.log("beFlag:"+beFlag);
	        	if(beFlag){
	        		beConvery(converyObj);
	        	}else{
	        		convery(converyObj);
	        	}
           }

           //将所有的问题、选项封装起来
           function sumQuestion(){
        	for(var n=0;n<content.length;n++){
        		questionArr.push(content[n].question);
        	}
          }

            function convery(obj){
            	obj.status = true;  //记录此时为主动提交
	       		$.ajax({
	       			url:URL+':2000/instrest',
	       			type:'GET',
	       			dataType:'jsonp',
	       			data:{
	       				'data':obj
	       			},
	       			xhrFields:{
	       				withCredentials:true
	       			}, 
	       			jsonp:'callback',
	       			jsonpCallback:'success_handler',
	       			success:success_handler,
	       			error:function(jq,err,code){     				
	       				 alert("保存数据出错");
	       				
	       			}
	       		})
            }

             //提交成功以后执行的函数
             function success_handler(data){
	       	  if(data.code == 2){
	       	  	 alert("提交数据成功");
	       	  	// w.terminate();
	       	  	 localStorage.clear();	       	  	
	       	  	window.location.replace("./test2.html");
	       	  }else if(data.code == 1){
	       	  	 alert("数据已经提交过，不能再次提交！");
	       	  	 document.getElementsByClassName("submit")[0].disabled=true;
	       	  	// w.terminate();
	       	  	 localStorage.clear();	
	       	  	// window.location.href="./test2.html";       	  	
	       	  }else if(data.code == 0){
	       	  		alert("请先登录个人信息");
	       	  }else{
	       	  	 alert("存入数据出错!");
	       	  }
            }

			function beConvery(obj){
				obj.status = false;    //记录此时为被动提交
	       		$.ajax({
	       			url:URL+':2000/instrest',
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
	       				 alert("保存数据出错");
	       				
	       			}
	       		})
            }

             //提交成功以后执行的函数
             function handler(data){
	       	  if(data.code == 2){
	       	  	 alert("提交数据成功");
	       	  	// w.terminate();
	       	  	 localStorage.clear();
	       	  	window.location.replace("./index.html");
	       	  }else if(data.code == 1){
	       	  	 alert("数据已经提交过，不能再次提交！");
	       	  	 document.getElementsByClassName("submit")[0].disabled=true;
	       	  	// w.terminate();
	       	  	 localStorage.clear();	
	       	  	// window.location.href="./test2.html";       	  	
	       	  }else if(data.code == 0){
	       	  		alert("请先登录个人信息");
	       	  }else{
	       	  	 alert("存入数据出错!");
	       	  }
            }
             //设置答题的总时间
      /* function setTime(){
       	     localStorage.hour = 0;
       	  	 localStorage.minute =00;
       	  	 localStorage.second =40;
       }*/

        function timeSwitch(data){
          if(data<10){
          	return '0'+data;
          }else{
          	return data;
          }
       }

       function codeOnchange(obj,i){
       	  obj.onchange = function(){
       	  	  var code = document.getElementsByClassName("code_content")[i].value;
       	 
	       	  codeArr[i] = code;
	       	  
	       	  codeObj.data = codeArr;
	       	  
	       	  localStorage.code = JSON.stringify(codeObj);
	       	  foreSee();
       	  }
       }

       /* function ideaOnchange(obj,i){
       	  obj.onchange = function(){
       	  	 var idea = document.getElementsByClassName("idea_content")[0].value;
       	  	  	 ideaArr[i] = idea;
       	  	     ideaObj.data = ideaArr;
       	  	     localStorage.idea = JSON.stringify(ideaObj);
       	  	     foreSee();
       	  }
       }*/
       function foreSee(){
      	if(localStorage.code){
      	  var obj = JSON.parse(localStorage.code).data;
         // var obj1 = JSON.parse(localStorage.idea).data;
      		for(var i=0;i<obj.length;i++){
	            console.log("obj::"+obj[i]);
      			if(obj[i]){
          			   //刷新预览的内容
    				   /*let body = document.getElementsByClassName("body_1")[0];
    				   let orow = body.getElementsByClassName("row")[0];*/
    				   let col = document.getElementsByClassName("sign")[i+2];
    				   col.style.backgroundColor = "#FF9800";
			    }else{
			    	let col = document.getElementsByClassName("sign")[i+2];
    				col.style.backgroundColor = "white";
			    }
      		}
      	}
      }

}