window.onload=function(){
	
	const URL = "http://192.168.1.240";	
    var pageIndex = 1;
    var pageSize = 1;
    var count = 1;     //记录当前的数据数
    var current;   //当前的数据
    var answerCount = 2;   //题总数
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


    const easyRandomArray = new Array();    //存储随机数的数组，为了防止选取同样的数
    const middleRandomArray = new Array();


    var easyContent = new Array();        //存储随机选取出来的题
    var middleContent = new Array();


    const num = [1,1];     //存储选取的各种类型题目的数目

    var ideaArr = new Array();
    var questionArr = new Array();
    var codeArr = new Array();
    var ideaObj={'data':''};
    var codeObj={'data':''};
    var w;   //定义web worker
    var ocontain = document.getElementsByClassName("content")[0];

       if(localStorage.hour&&localStorage.minute&&localStorage.second){
			   //  document.getElementsByClassName("submit")[0].disabled=true;
			    getCon();
  				timer();
    			foreSee();
	   }
		//请求后台数据
	function getCon(){

		$.ajax({
			url:'code.json',
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
				 console.log(obj);
				 
                //将选择题随机选取  并存入数组
				 if(!localStorage.content){
                 const easy = obj.easy
                 const midd = obj.middle; 
 //[easyRandomArray,easyContent] =
                  getRandomContent({obj:easy,randomArray:easyRandomArray,content:easyContent,num:num[0]});
                 // [middleRandomArray,middleContent] = 
                  getRandomContent({obj:midd,randomArray:middleRandomArray,content:middleContent,num:num[1]});
	 
                

                 randomArray.concat(easyRandomArray,middleRandomArray);
                 
                 localStorage.content = JSON.stringify({'data':easyContent.concat(middleContent)});
				         content = JSON.parse(localStorage.content).data;
          }else{
				  	 content = JSON.parse(localStorage.content).data;
		 }
                   console.log(randomArray.length);
	               //将第一个页面渲染出来
	               preContent(1);
		   }


//================================================================================================//
//=============================主动提交=============================================================//
           function getAll(){
        	    sumQuestion();
	        	converyObj.idea = ideaArr;
	        	converyObj.code = codeArr;
	        	converyObj.answer = JSON.parse(localStorage.content).data;
	        	console.log(converyObj);
	        	convery(converyObj);
           }
                      //主动提交
            function convery(obj){
	       		$.ajax({
	       			url:URL+':2000/store',
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


            //主动提交成功以后执行的函数
            function success_handler(data){
	       	  if(data.code == 2){
	       	  	 alert("提交数据成功");
	       	  	 //w.terminate();
	       	  	 localStorage.clear();
	       	  	 	let ele= "<div class='modal1'></div><div class='modal_content'><div class='modal_header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true' class='option'>&times;</span></button><h4 class='modal-title' id='myModalLabel'>网协机考系统</h4></div><div class='modal_body'>恭喜你，已经完成了前三部分的机试内容。现在这里还有两道附加题，要去试试嘛？</div>"+
					      "<div class='modal_footer'>"+
					        "<button type='button' class='btn btn-default' >"+
					        	"<a href='./index.html' class='reject'>拒绝</a>"+
					        "</button>"+
					        "<button type='button' class='btn btn-info'>"+
					        	"<a href='./add.html' class='try'>去试试</a>"+
					        "</button>"+
					      "</div>"+ "</div>";
			     document.body.innerHTML = ele+document.body.innerHTML;
			     let modal = document.getElementsByClassName("modal1");
	         	  modal[0].className = "modal1 modal2";
	       	  }else if(data.code == 1){
	       	  	 alert("数据已经提交过，不能再次提交！");
	       	  	 document.getElementsByClassName("submit").disabled=true;
	       	  	 w.terminate();
	       	  	 localStorage.clear();	  
	       	  	    	  	
	       	  }else if(data.code == 0){
	       	  		alert("请先登录个人信息");
	       	  }else{
	       	  	 alert("存入数据出错!");
	       	  }
            }
/*===============================================================================================
=================================被动提交========================================================*/

           //被动提交数据的主函数
           function getAll_1(){
        	    sumQuestion();
	        	converyObj.idea = ideaArr;
	        	converyObj.code = codeArr;
	        	converyObj.answer = JSON.parse(localStorage.content).data;
	        	console.log(converyObj);
	        	beConvery(converyObj);
           }
                       //时间到了被动提交
            function beConvery(obj){
	       		$.ajax({
	       			url:URL+':2000/store',
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

             //被动提交成功以后执行的函数
            function handler(data){
	       	  if(data.code == 2){
	       	  	 alert("提交数据成功");
	       	  	 //w.terminate();
	       	  	 localStorage.clear();
	       	  	window.location.replace("./index.html");
	       	  }else if(data.code == 1){
	       	  	 alert("数据已经提交过，不能再次提交！");
	       	  	 document.getElementsByClassName("submit").disabled=true;
	       	  	 w.terminate();
	       	  	 localStorage.clear();	  
	       	  	 //window.location.href="./test3.html";     	  	
	       	  }else if(data.code == 0){
	       	  		alert("请先登录个人信息");
	       	  }else{
	       	  	 alert("存入数据出错!");
	       	  }
            }

/*===================================================各个功能函数===================================
====================================================================================================*/

           //将所有的问题、选项封装起来
           function sumQuestion(){
        	for(var n=0;n<content.length;n++){
        		questionArr.push(content[n].question);
        	}
        	converyObj.question = questionArr;
        	console.log("question:"+questionArr);
          }



             //设置答题的总时间
       /*function setTime(){
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
       	  	  var code = document.getElementsByClassName("code_content")[0].value;
       	 
	       	  codeArr[i] = code;
	       	  
	       	  codeObj.data = codeArr;
	       	  
	       	  localStorage.code = JSON.stringify(codeObj);
	       	  foreSee();
       	  }
       }

        function ideaOnchange(obj,i){
       	  obj.onchange = function(){
       	  	 var idea = document.getElementsByClassName("idea_content")[0].value;
       	  	  	 ideaArr[i] = idea;
       	  	     ideaObj.data = ideaArr;
       	  	     localStorage.idea = JSON.stringify(ideaObj);
       	  	     foreSee();
       	  }
       }

        //生成内容及题目随机数
       function getRandomContent({obj={},randomArray=[],content=[],num=0}){
        console.log("接收到的num是:"+num);
         console.log("接收到的obj是:"+obj.length);
         for(let i=0;i<num;i++){
            console.log("i:"+i);
            let random;
            //遍历一下是否重复
            if(randomArray.length){
              while(1){
                    random = getRandom(0,obj.length-1);
                  for(var j=0;j<randomArray.length;j++){
                    if(random == randomArray[j]) break;
                  }
                  if(j == randomArray.length) break;
              }
            }else{
                random = getRandom(0,obj.length-1);
            }
            console.log("random:"+randomArray);
            randomArray.push(random);
            content.push(obj[random]);
           
          }
           console.log("random:"+randomArray);
           console.log("content:"+content);
           return [randomArray,content];
       }

        function foreSee(){
      	if(localStorage.code || localStorage.idea){
      		if(localStorage.code){
      			var obj = JSON.parse(localStorage.code).data;
      		}
      		if(localStorage.idea){
      			var obj1 = JSON.parse(localStorage.idea).data;
      		}
           
      	for(var i=0;(obj&&i<obj.length)||(obj1&&i<obj1.length);i++){
           /* console.log("obj::"+obj[i]);
            console.log("obj1："+obj1[i]);*/

      		  if((obj&&obj[i])||(obj1&&obj1[i])){
          			   //刷新预览的内容
    				   let col = document.getElementsByClassName("sign")[i+2];
    				   col.style.backgroundColor = "#FF9800";
			  }else{
             	 let col = document.getElementsByClassName("sign")[i+2];
                 col.style.backgroundColor = "white";
             }
      		}
      	}
      }


    			function preContent(index){
				//渲染一页的内容
				//console.log("content::"+content.data);
				count = 0;
				for(var i=index-pageSize;i<=index-1&&i<answerCount;i++){
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
	                    var col1= document.createElement("div");
	                    col1.className="col-md-8 col-sm-8";
	                    var span1 = document.createElement("span");
	                    span1.innerHTML="代码:";
	                    var text = document.createElement("textarea");
	                    text.className="code_content";
	                    var col2= document.createElement("div");
	                    col2.className="col-md-4 col-sm-4";
	                    var span2 = document.createElement("span");
	                    span2.innerHTML="思路";
	                    var text1 = document.createElement("textarea");
	                    text1.className="idea_content";
	                    //if(localStorage.content)
	                    if(localStorage.idea){
	                    	 var obj = JSON.parse(localStorage.idea).data;
	                    	 if(obj[i]){
	                    	 	text1.value = obj[i];
	                    	 }
	                    }
	                    if(localStorage.code){
	                    	var obj = JSON.parse(localStorage.code).data;
	                    	if(obj[i]){
	                    		text.innerHTML = obj[i];
	                    	}
	                    }

	                    

	                    col1.appendChild(span1);
	                    col1.appendChild(text);
	                    col2.appendChild(span2);
	                    col2.appendChild(text1);
	                    col.appendChild(col1);
	                    col.appendChild(col2);

                       odiv.appendChild(div1);
	                   odiv.appendChild(ospan);
	                   odiv.appendChild(olabel);
	               
	                   ocontain.appendChild(odiv);  
	                   ocontain.appendChild(col); 
	                   codeOnchange(text,i);
	                   ideaOnchange(text1,i);
	                   count++;
				}
				//生成下一页  上一页的按钮
				if(index == 1){
					var div = document.createElement("div");
					//div.className="col-md-12";
				    var	oa = document.createElement("button");
					oa.href="#";
					oa.className="btn btn-success next";
					oa.innerHTML = "下一页";	
					div.appendChild(oa);
					
					ocontain.appendChild(div);
					boundNext();
				}else if(answerCount - index*pageSize <= 0){
					var div = document.createElement("div");
					//div.className="col-md-12";

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
						div.appendChild(a);
						div.appendChild(button);
						ocontain.appendChild(div);
						//document.body.appendChild(btn);
					    boundPre();
					    //当时间为0时禁止提交
					   // alert(localStorage.hour+":"+localStorage.minute+":"+localStorage.second);

					    if(localStorage.hour==0&&localStorage.minute==0&&localStorage.second==0){
				       	 	 document.getElementsByClassName("submit")[0].disabled=true; 
       	 				}			
				}else{
						var div = document.createElement("div");
						//div.className="col-md-12";
					   var oa = document.createElement("button");
						oa.href="#";
						oa.className="btn btn-info pre";
						oa.innerHTML = "上一页";

						var a = document.createElement("button");
						a.href="#";
						a.className="btn btn-success next";
						a.innerHTML = "下一页";	
						div.appendChild(oa);
						div.appendChild(a);
						ocontain.appendChild(div);
						//给pre绑定事件
					 boundPre();
					 boundNext();
				}


			}
	   //绑定pre事件
		function boundPre(){
		   document.getElementsByClassName("pre")[0].onclick = function(){
					   pageIndex--;
					   clearEle("col-md-12");
					   clearEle("col-sm-12");
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
						    clearEle("col-md-12");
					        clearEle("col-sm-12");
							clearEle("pre");
							clearEle("next");
							clearEle("submit");
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
       	 			  //getAnswer();  
       	 			  getAll_1();
       	 			 // document.getElementsByClassName("submit")[0].disabled=true;    	                   	             
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
                	ele[0].parentNode.removeChild(ele[0]);
                }
			}

			function boundSubmit(obj){
         	 
         	   obj.onclick = function fun(){
         	   	getAll();    	
         	   }
           }

}