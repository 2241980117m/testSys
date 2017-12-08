window.onload=function(){
	  
    const URL = "http://192.168.1.240";
    console.log("url:"+URL);
    var pageIndex = 1;
    const pageSize = 1;
    var count = 1;     //记录当前的数据数
    var current;   //当前的数据
    const selectCount = 8;   //题目总数
    let beFlag = 0;   //是否被动提交
    /*const easy_num = 2;
    const middle_num = 1;
    const diff_num = 1;*/
    const num = [2,1,1,1,1,1,1];  //记录每种类型的题目的数目

    const easyRandomArray = new Array();    //存储随机数的数组，为了防止选取同样的数
    const middleRandomArray = new Array();
    const diffRandomArray = new Array();
    const diff_5RandomArray = new Array(),
          diff_6RandomArray = new Array(),
          diff_7RandomArray = new Array(),
          diff_8RandomArray = new Array(),
          randomArray = new Array();



    var easyContent = new Array();        //存储随机选取出来的题
    var middleContent = new Array();
    var diffContent = new Array();

    const diff_5Content = new Array(),
          diff_6Content = new Array(),
          diff_7Content = new Array(),
          diff_8Content = new Array();

    var succ;
    var answerArray = new Array();
    var answerObj={data:''};
    var ideaArray = new Array();
    var ideaObj = {'data':''};
    var count = 0;
    var time;  //定时器
    var converyObj ={
    	answer:'',
    	question:'',
    	//options:'',
    	isChecked:'',
      idea:''
    	//isCorrect:''
    };  //传入后台的对象
    var correctArr = new Array();
    var questionArr = new Array();
    var selectArr = new Array();
    var w;   //定义web worker
/*===============================================================================================
=====================================================================================================*/


    var ocontain = document.getElementsByClassName("content")[0];
    //启动定时器
      
    timer();
    getCon();
    foreSee();
   // foreSee    ();
	//请求后台数据
	function getCon(){
		$.ajax({
			url:'fill1.json',
			type:'GET',
			dataType:'json',
			success:function(data){
        
       //  let db = JSON.stringify(data);
       //  let da = JSON.parse(db);
       //  console.log("data:"+typeof(da));
        /*  console.log("type:"+typeof(data));*/
				 successAction(data);
			},
			error:function(jq,text,err){
         alert("请求出错了！！"+text+" "+err.message);
			}
		});
	}

      //自动提交数据
      function getGrade(){
        	sumQuestion();
        	if(localStorage.fill){
        		converyObj.answer = JSON.parse(localStorage.fill).data;   //答案
        	}
          if(localStorage.idea){
            converyObj.idea = JSON.parse(localStorage.idea).data;      //想法
          }
        	//converyObj.isCorrect = correctArr;
        	//converyObj.options = selectArr;
        	converyObj.question = JSON.parse(localStorage.content).data;  //得到随机选择的问题
        	//converyObj.name = "mxh";
        	console.log(converyObj);
           if(beFlag == 1){
               beConvery(converyObj);
           }else{
              convery(converyObj);
           }
       

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
				 
          //将题目随机选取  并存入数组
				  if(!localStorage.content){
                 const easy = obj.easy,
                       midd = obj.middle, 
                       diff = obj.difficult,
                       diff_5 = obj.diff_5,
                       diff_6 = obj.diff_6,
                       diff_7 = obj.diff_7,
                       diff_8 = obj.diff_8;
                  console.log("easy:"+easy);
					     //   [easyRandomArray,easyContent] =
                  getRandomContent({obj:easy,randomArray:easyRandomArray,content:easyContent,num:num[0]});
              //    [middleRandomArray,middleContent] = 
                  getRandomContent({obj:midd,randomArray:middleRandomArray,content:middleContent,num:num[1]});
	           //     [diff_5RandomArray,diff_5Content] =
                  getRandomContent({obj:diff_5,randomArray:diff_5RandomArray,content:diff_5Content,num:num[3]});
             //     [diffRandomArray,diffContent] =
                  getRandomContent({obj:diff,randomArray:diffRandomArray,content:diffContent,num:num[2]});
            //      [diff_6RandomArray,diff_6Content] =
                  getRandomContent({obj:diff_6,randomArray:diff_6RandomArray,content:diff_6Content,num:num[4]});
           //       [diff_7RandomArray,diff_7Content] =
                  getRandomContent({obj:diff_7,randomArray:diff_7RandomArray,content:diff_7Content,num:num[5]});
           //       [diff_8RandomArray,diff_8Content] =
                  getRandomContent({obj:diff_8,randomArray:diff_8RandomArray,content:diff_8Content,num:num[6]});

                 randomArray.concat(easyRandomArray,middleRandomArray,diffRandomArray,diff_5RandomArray,diff_6RandomArray,diff_7RandomArray,diff_8RandomArray);
                 
                 localStorage.content = JSON.stringify({'data':easyContent.concat(middleContent,diffContent,diff_5Content,diff_6Content,diff_7Content,diff_8Content)});
				         content = JSON.parse(localStorage.content).data;
                 console.log("randomArray:"+randomArray);
                 console.log("content:"+content);
          }else{
				  	 content = JSON.parse(localStorage.content).data;
				  }
         //console.log(randomArray.length);
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
      
				for(var i=index-pageSize;i<=index-1&&i<selectCount;i++){
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
                     
                    var div = document.createElement("div");
                    div.className="result"+count;

                    var span1 = document.createElement("span");
                    span1.className="please";
                    span1.innerHTML = "答案:";
                    var input = document.createElement("input");
                    boundChange(input,count,i);
                    var div1 = document.createElement("div");
                    div1.className="idea";
                    var span2 = document.createElement("span");
                    span2.className="please";
                    span2.innerHTML = "解题思路:";
                    var text = document.createElement("textarea");
                    text.className="text";
                    boundTextChange(text,count,i);
                    //创建ul.option元素
                    //var oul = document.createElement("ul");
                   // oul.className="option";
                    var temp = isFilled(i);

                    const temp2 = isTextFilled(i);
                    if(temp){
                      input.value = JSON.parse(localStorage.fill).data[i];
                    }
                    if(temp2){
                      text.value = JSON.parse(localStorage.idea).data[i];
                    }

	                   odiv.appendChild(ospan);
                     odiv.appendChild(olabel);

                     if(content[i].code){
                      var pre = document.createElement("pre");
                          pre.innerHTML = content[i].code;
                      div.appendChild(pre);
                    }
	                  
                     
                  if(content[i].select){
                      let oul = document.createElement("ul");
                      for(let j=0;j<4;j++){
                          let oli = document.createElement("li");
                          let span_se = document.createElement("span");
                          span_se.innerHTML = content[i].select[j].id;
                          let label_se = document.createElement("label");
                          label_se.innerHTML = content[i].select[j].content;
                          oli.appendChild(span_se);
                          oli.appendChild(label_se);
                          oul.appendChild(oli);
                      }
                      odiv.appendChild(oul);
                   }

                     div.appendChild(span1);
                     div.appendChild(input);
                     div1.appendChild(span2);
                     div1.appendChild(text);
                     
	                 //  odiv.appendChild(oul);
	                   ocontain.appendChild(odiv);  
                     div.appendChild(div1); 
                     ocontain.appendChild(div);
	                   count++;
				}
				//生成下一页  上一页的按钮
				if(index == 1){
          let a = document.createElement("button");
            a.href="#";
            a.className="btn btn-info pre";
            a.innerHTML = "上一页";  
            a.style.visibility="hidden";
				  var	oa = document.createElement("button");
					oa.href="#";
					oa.className="btn btn-success next";
					oa.innerHTML = "下一页";	
          ocontain.appendChild(a);
					ocontain.appendChild(oa);
				
					boundNext();
				}else if(selectCount - index*pageSize <= 0){ 
					let a = document.createElement("button");
						a.href="#";
						a.className="btn btn-info pre";
						a.innerHTML = "上一页";	
					let btn = document.createElement("button");
					    btn.className = "btn btn-warning submit";
					    btn.innerHTML = "提交";
				//	var btn = document.createElement("button");
					   // btn.className = "foresee";
					   // btn.innerHTML = "预览";
					    
						  ocontain.appendChild(a);
						  ocontain.appendChild(btn);
						//document.body.appendChild(btn);
					    boundPre();
              boundSubmit(btn);
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
             for(let i=0;i<document.getElementsByTagName("input").length;i++){
                clearEle("result"+i);
             }
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
               // clearEle("result");
               for(let i=0;i<document.getElementsByTagName("input").length;i++){
                clearEle("result"+i);
               }
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
         function boundChange(obj,count,i){
         		  obj.onchange = function(){
        	       //var temp = getSelect("select"+count);  
                 var temp = document.getElementsByClassName("result0")[0].getElementsByTagName("input")[0].value;   
        	       if(localStorage.fill){
        	         answerArray = JSON.parse(localStorage.fill).data;
        	       } 	                 	
								answerArray[i]=temp;
								answerObj.data = answerArray;
								localStorage.fill = JSON.stringify(answerObj);
								//刷新预览的内容
								/*var body = document.getElementsByClassName("body_1")[0];
								var orow = body.getElementsByClassName("row")[0];
								var col = orow.getElementsByClassName("col-md-3")[i].getElementsByClassName("sign")[0];
								col.innerHTML = temp;*/
                foreSee();
        	   }
                
         }

        //绑定textarea click事件
         function boundTextChange(obj,count,i){
              obj.onchange = function(){
                 //var temp = getSelect("select"+count);  
                 var temp = document.getElementsByClassName("result0")[0].getElementsByTagName("textarea")[0].value;   
                 if(localStorage.idea){
                   ideaArray = JSON.parse(localStorage.idea).data;
                 }                    
                ideaArray[i]=temp;
                ideaObj.data = ideaArray;
                localStorage.idea = JSON.stringify(ideaObj);
                foreSee();
             }         
         }

         //绑定提交事件
         function boundSubmit(obj){
         	  // clearTimeout(time);
             obj.onclick = getGrade;
         }

         //请求答案并进行比对
         function getAnswer(){
               /* alert("提交！！");*/
              $.ajax({
                  url:'fresult.json',
                  type:'GET',
                  dataType:'json',
                  success:function(data){
                     getGrade(data);
                  },
                  error:function(jq,err,text){
                      alert(text.message);
                  }
              });
         	   /*	$.ajax({
        				url:'fresult.json',
        				type:'GET',
        				dataType:'json',
        				success:function(data){
                  alert("货物数据成功！！");
                  console.log(data);
        					getGrade(data);
        				},
                error:function(){
                  alert("请求诗句失败！！");
                }
        			});*/
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

		//判断之前input框是否被填，若填则渲染到页面上
		function isFilled(index){
				if(localStorage.fill){
					var obj = JSON.parse(localStorage.fill).data;
					if(obj[index]){
               return obj[index];
						//ele.checked = true;
						/*switch(obj[index]){
							case 'A':return 0;
							case 'B':return 1;
							case 'C':return 2;
							case 'D':return 3;
							default:return false;
						}*/
					}
          return false;
				}
		}

    //判断之前该选项是否被选，若选择则渲染到页面上
    function isTextFilled(index){
        if(localStorage.idea){
          var obj = JSON.parse(localStorage.idea).data;
          if(obj[index]){
               return obj[index];
            //ele.checked = true;
            /*switch(obj[index]){
              case 'A':return 0;
              case 'B':return 1;
              case 'C':return 2;
              case 'D':return 3;
              default:return false;
            }*/
          }
          return false;
        }
    }


		//根据localStorage的内容，将该部分所有结果渲染到页面上

       //主动将问题，选项，答案，对应的json数据序号传入后台 
       function convery(obj){
         obj.status = true;   //记录此时为主动提交
       		$.ajax({
       			url:URL+':2000/',
       			type:'GET',
       			dataType:'jsonp',
       			data:{
       				'data':obj
       			},
       			xhrFields:{
       				withCredentials:true
       			}, 
       			jsonp:'callback',
       			jsonpCallback:'successs_handler',
       			success:successs_handler,
       			error:function(jq,err,code){     				
       				 alert("保存数据出错");      				
       			}
       		})
       }
 //被动将问题，选项，答案，对应的json数据序号传入后台 
       function beConvery(obj){
          obj.status = false;
          $.ajax({
            url:URL+':2000/',
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
          });
       }


       function sumQuestion(){
       	  //将所有的问题、选项封装起来

        	for(var n=0;n<content.length;n++){
        		questionArr.push(content[n].question);
        		selectArr.push(content[n].options);
        	}
       }

       function successs_handler(data){
         /* alert("进入存储");*/
       	  if(data.code == 2){
       	  	 alert("提交数据成功");
       	  	 // clearInterval(Time);
       	  	//  w.terminate();
       	  	  localStorage.clear();
       	  	 document.getElementsByClassName("submit")[0].disabled=true;
             window.location.replace("./test3.html");
       	  }else if(data.code == 1){
       	  	 alert("数据已经提交过，不能再次提交！");
       	  	 document.getElementsByClassName("submit").disabled=true;
       	  	 localStorage.clear();     	  	
       	  }else if(data.code == 0){
             alert("请先登录个人信息");
          }else{
       	  	 alert("存入数据出错!");
       	  }
       }
           //被动提交数据
             
          function handler(data){
            if(data.code == 2){
               alert("提交数据成功");
               //w.terminate();
               localStorage.clear();
              // window.location.replace("./index.html");
               window.location.href="./index.html";
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

       //倒计时
       function timer(){
       	  //将时间在localStorage中存储
		   if(!localStorage.hour&&!localStorage.minute&&!localStorage.second){
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
                        beFlag = 1;
                        getGrade();     	 			          	                   	             
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

      	if(localStorage.fill!=undefined||localStorage.idea!=undefined){

      		if(localStorage.fill){
            var obj = JSON.parse(localStorage.fill).data;
          }

           if(localStorage.idea){
             var obj1 = JSON.parse(localStorage.idea).data;
           }

      		for(var i=0;(obj&&i<obj.length)||(obj1&&i<obj1.length);i++){
      			if((obj&&obj[i])||(obj1&&obj1[i])){
          			   //刷新预览的内容
    				   let body = document.getElementsByClassName("body_1")[0];
    				   let orow = body.getElementsByClassName("row")[0];
    				   let col = orow.getElementsByClassName("sign")[i];
               console.log("第"+i+"个改变颜色");
    				   col.style.backgroundColor = "#FF9800";
			       }else{
                let body = document.getElementsByClassName("body_1")[0];
                let orow = body.getElementsByClassName("row")[0];
                let col = orow.getElementsByClassName("sign")[i];
                col.style.backgroundColor = "white";
             }
      		}
      	}
      }

      //设置答题的总时间
       function setTime(){
            // const now = new Date();   //得到开始登陆的时间
            // const end = now+45*60*1000;
       	     localStorage.hour = 0;
       	  	 localStorage.minute =45;
       	  	 localStorage.second =00;
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



}