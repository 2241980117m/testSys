  let obj={
		getContent(ur){
			var pri = new Promise((resolve,reject)=>{
				$.ajax({
				url:ur,
				type:'get',
				dataType:'JSON',
				success:function(obj){
					resolve(obj);
				},
				error:function(jq,text,err){
/*					alert(text+err.message);
					alert(jq.responseText);*/
					reject("请求失败");
					 //alert("请求失败");
				}
			   });

			});
			return pri;
		},
		getAnswer(url1){
			return this.getContent(url1);
		},
		getCorrectAnswer(obj,url2){
			console.log("接收到的obj::"+obj);
			let pri = this.getContent(url2);
			let correctArr = []; 
			pri.then(function(correctObj){
			
				console.log("type:"+typeof correctObj);
				if(correctObj.diff){			//处理填空题
					//correctArr = correctObj.easy.concat(correctObj.middle,correctObj.difficult,correctObj.diff_5,correctObj.diff_6,correctObj.diff_7,correct.diff_8);
					correctArr = correctObj.easy.concat(correctObj.middle,correctObj.diff);
				}else if(correctObj.middle){
					correctArr = correctObj.easy.concat(correctObj.middle);	//处理编程题
				}else if(correctObj.short_answer){
					correctArr = correctObj.short_answer;     //处理附加题
				}else{
					correctArr = correctObj.instrest;		//处理脑洞题
				}
				console.log("correctArr-length:"+correctArr.length);
				console.log("obj-length:"+obj.length);
				for(let i=0;obj&&i<obj.length;i++){

					 for(let j=0;j<correctArr.length;j++){
					 	if(obj[i].id == correctArr[j].id){
					 		console.log("obj[i].id:"+obj[i].id);
					 		console.log("correctArr[j].id:"+correctArr[j].id);
					 		obj[i].correct = correctArr[j].result;
					 		console.log("obj[i].correct:"+obj[i].correct);
					 	}
					 }
				}
			});
			console.log(obj);
			return pri;
		},
		success_Action(selector,arr){
			//生成对应的块
			console.log("接收到的arr是:"+arr);
			for(let i=0;arr&&i<arr.length;i++){
				console.log(arr[i]);
				let obj = arr[i];
				let ele;
				if(obj.code){
			    	 ele = "<div class='section'>"+
						"<div><span class='num'>"+obj.num+".</span>"+
						"<span name='' id='' cols='30' rows='10' class='question'>"+obj.question+"</span><pre>"+obj.code+"</pre></div>";
			    }else{
			    	 ele = "<div class='section'>"+
						"<div><span class='num'>"+obj.num+".</span>"+
						"<span name='' id='' cols='30' rows='10' class='question'>"+obj.question+"</span></div>";
			    }
				if(obj.status){
					ele+="\n"+obj.status;
				}

				if(obj.select){
					ele+="<ul class='select'>";
					for(let j=0;j<obj.select.length;j++){
						ele+="<li><span class='selectId'>"+obj.select[j].id+"</span>";
						ele+="<span class='selectItem'>"+obj.select[j].content+"</span></li>";
					}
					ele+="</ul>";
				}
			
			    if(obj.idea){
			    	ele+="<div class='ideaItem'><span class='ideaText'>思路:</span><textarea name='' id='' cols='30' rows='10' class='idea' readonly='readonly'>"+obj.idea+"</textarea></div>";
			    }
			    
			    if(obj.answer){
			    	ele+="<div class='answerItem'><span class='answerText'>答案:</span><textarea name='' id='' cols='30' rows='10' class='answer' readonly='readonly'>"+obj.answer+"</textarea></div>";
			    }
				
				ele+="<div class='correctItem'><span class='correctText'>正确答案:</span><textarea name='' id='' cols='30' rows='10' class='correct' readonly='readonly'>"+obj.correct+"</textarea></div>"+
				"<label>分数:</label>"+
				"<input type='text' class='grade'>";
				
				$(selector).append(ele);

			}

						
		}
	}



	