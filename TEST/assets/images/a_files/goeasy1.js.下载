	
var goeasy = new GoEasy({
				appkey: 'BC-a8fd1e4dcc954d948f60f304fc9951bb'
		});	
			goeasy.subscribe({
				channel: 'bieyang3',
				onMessage: function(message){
					var content=message.content;
					if(content=="发布成功"){
						$(".span_tips").css({
							"display":"block"	
						})
					}else{
						if(content && content==$("#login_nickname").val()){

							$(".prompt_span_tips").css({
								"display":"inline-block"
							})
						}
					}								
				}				
			});
			//上传图片时候的红点提示
			function publishMessage(data) {
				goeasy.publish({
					channel: 'bieyang3',
					message: data,
					onFailed: function (error) {
						console.log(error.code+" : "+error.content);
					},
					onSuccess: function(){
					}
				});
			}
			
			//发表评论时候的红点提示
			function publishMessage1(data) {
				goeasy.publish({
					channel: 'bieyang3',
					message: data,
					onFailed: function (error) {
						console.log(error.code+" : "+error.content);
					},
					onSuccess: function(){				
					}
				});
			}

				
