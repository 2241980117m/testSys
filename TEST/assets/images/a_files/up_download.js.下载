
	$("#imghead").on("click",function(){
	    $("#previewImg").click();
    })

      //图片上传预览    IE是用了滤镜。
        function previewImage(file)
        {
          var MAXWIDTH  = 900; 
          var MAXHEIGHT = 900;
          var div = document.getElementById('preview');
          if (file.files && file.files[0])
          {	
              div.innerHTML ='<img id=imghead onclick=$("#previewImg").click()>';
              var img = document.getElementById('imghead');
              img.onload = function(){
                var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                img.width  =  rect.width;
                img.height =  rect.height;
                metadata();
//                 img.style.marginLeft = rect.left+'px';
                // img.style.marginTop = rect.top+'px';
              }
              var reader = new FileReader();
              reader.onload = function(evt){img.src = evt.target.result;}
              reader.readAsDataURL(file.files[0]);
          }
          else //兼容IE
          {
            var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
            file.select();
            var src = document.selection.createRange().text;
            div.innerHTML = '<img id=imghead>';
            var img = document.getElementById('imghead');
            img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
            metadata();
            div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
          }
        }

        function clacImgZoomParam( maxWidth, maxHeight, width, height ){
            var param = {top:0, left:0, width:width, height:height};
            if( width>maxWidth || height>maxHeight ){
                rateWidth = width / maxWidth;
                rateHeight = height / maxHeight;
                
                if( rateWidth > rateHeight ){
                    param.width =  maxWidth;
                    param.height = Math.round(height / rateWidth);
                }else{
                    param.width = Math.round(width / rateHeight);
                    param.height = maxHeight;
                }
            }
            param.left = Math.round((maxWidth - param.width) / 2);
            param.top = Math.round((maxHeight - param.height) / 2);
            return param;
        }

// 获取图片的分辨率
function getImageWidthAndHeight(id, callback) {
  var _URL = window.URL || window.webkitURL;
  $("#" + id).change(function (e) {
    var file, img;
    if ((file = this.files[0])) {
      img = new Image();
      img.onload = function () {
        callback && callback({"width": this.width, "height": this.height, "filesize": file.size});
      };
      img.src = _URL.createObjectURL(file);
    }
  });
}

(function () {
  //省略其他代码
  getImageWidthAndHeight('previewImg', function (obj) {
  	$(".imgSize").html("<span>原始尺寸为"+obj.width+"px</span><span>*</span><span>"+obj.height+"px</span><span class='fileSize'>约"+(obj.filesize/1024/1024).toFixed(2)+"mb</span>")
  });
})(jQuery)


// 获取图片的元属性
function metadata(){
	var demolog = $("#demo-log");
	var imghead1 = document.getElementById("imghead");
	EXIF.getData(imghead1,function(){
	EXIF.getAllTags(imghead1);
	str="设备 "+String(EXIF.getTag(this, 'Make')).replace("undefined","")+String(EXIF.getTag(this, 'Model')).replace("undefined","")+"; 快门 "+String(EXIF.getTag(this, 'ShutterSpeedValue')).replace("undefined","")+"; 光圈 "+String(EXIF.getTag(this, 'FNumber')).replace("undefined","")+"; ";
	demolog.html(str);
})
}

<!-- OSS调用 -->




//上传文件时获取文件名
function getFileName(id){
	var x0=$("#"+id).val();
	var x=$("#"+id).val().lastIndexOf("\\")+1;
	var x2=x0.substring(x);
	return x2;
}

//获取20170521格式的
function getTime(){
	var date=new Date();
	var y=date.getFullYear();
	var m=date.getMonth()+1;
	var d=date.getDate();
	if(m<10){
		m="0"+m;
	}
	if(d<10){
		d="0"+d;
	}
	var time=y+""+m+d;
	return time;
}
// 生成uuid防止重名
	function uuidfn() {
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4"; 
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  
	    s[8] = s[13] = s[18] = s[23] ;	 
	    var uuid1 = s.join("");
	    return uuid1;
	}

// OSS对象生成
    var client = new OSS.Wrapper({
      	region: 'oss-cn-hangzhou',
	    accessKeyId: 'LTAIWM44IMDuH16R',
	    accessKeySecret: 'odtZ52n9JViv4DWy9MkfRjsWpoDpmj',
	    bucket: 'ssyer'
    });

    var userId=$(".userId").text();
// 上传OSS图片
	function OSSupload(e){
      	var file=$("#previewImg")[0].files[0];  //踩过的坑来了 ，这里的$("#previewImg")[0]需要有[0];
		var time=getTime();
		var uuid1=uuid();
      	var url1='user/'+userId+'/'+time+'/order/'+uuid1+getFileName("previewImg");
      	var storeAs = url1;
	      client.multipartUpload(storeAs, file).then(function (result) {
	        $.ajax({
	        	"type":"get",
	        	"url":"", //这里需要传给小海 我的数据
	        	"data":{},
	        	success:function(data){
//					console.log("ajax调用成功了..");
					
	        	},
	        	error:function(){
//					console.log("ajax调用失败了..");
	        	}
	        })
	      }).catch(function (err) {
//	        console.log(err);
	      }); 
	    return url1;
	}
	
	
	//修改头像的上传功能
	var userId=$(".userId").text();
//	s3_uC_upfile_hide  这是修改头像时候的input type为file
	function OSSupload1(e){
      	var file=$("#s3_uC_upfile_hide")[0].files[0];  //踩过的坑来了 ，这里的$("#previewImg")[0]需要有[0];
		var time=getTime();
		var uuid1=uuid();
      	var url1='user/'+userId+'/'+time+'/face/'+uuid1+getFileName("s3_uC_upfile_hide");
      	var storeAs = url1;
	      client.multipartUpload(storeAs, file).then(function (result) {
	    	  console.log(result);
	        var url4="http://photo.ssyer.com/"+result.name;
	        $("#my_headImg").attr({"src":url4});
	        $.ajax({
	        	"type":"post",
	        	"url":$('#p_s_f_website_url').val()+"/pc/userinfo/update_face",
	        	"data":{"face":url4},
	        	success:function(data){
	        		if(data.rspCode==0){
	        		
	        			reminder("头像修改成功");
	        		}
//					console.log("ajax调用成功了..");
	        	},
	        	error:function(){
//					console.log("ajax调用失败了..");
	        	}
	        })
	      }).catch(function (err) {
	      }); 
	    return url1;
	}


//	将base64格式的转化为Blob类型的
	function convertBase64UrlToBlob(urlData){  	      
	    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  	      
	    //处理异常,将ascii码小于0的转换为大于0  
	    var ab = new ArrayBuffer(bytes.length);  
	    var ia = new Uint8Array(ab);  
	    for (var i = 0; i < bytes.length; i++) {  
	        ia[i] = bytes.charCodeAt(i);  
	    }  	  
	    return new Blob( [ab] , {type : 'image/png'});  
	} 
	

	
	
	
	//修改收款码的上传功能
//	var userId=$(".userId").text();
//	s3_uC_upfile_hide  这是修改头像时候的input type为file
	function OSSupload2(e){
		console.log("上传到阿里云OSS里面");
     	var file=$("#s5_uC_upfile_hide")[0].files[0];  //踩过的坑来了 ，这里的$("#previewImg")[0]需要有[0];
//      	var file=$("#my_headImg").files;
//     	var blob = new Blob([arr],{type:type || 'image/png'})
     	var s1_url=$("#my_headImg").attr("src");
     	console.log(s1_url);
     	alert("boom");
     	
		var time=getTime();
		var uuid1=uuid();
      	var url1='user/'+userId+'/'+time+'/face/'+uuid1+getFileName("s5_uC_upfile_hide");
      	var storeAs = url1;
	      client.multipartUpload(storeAs, file).then(function (result) {
	    	  console.log(result);
	        var url4="http://photo.ssyer.com/"+result.name;
	        $("#my_headImg").attr({"src":url4});
	        $.ajax({
	        	"type":"post",
	        	"url":$('#p_s_f_website_url').val()+"/pc/userinfo/update_face",
	        	"data":{"face":url4},
	        	success:function(data){
	        		if(data.rspCode==0){
	        		
	        			reminder("收款码修改成功");
	        		}
	        	}
	        })
	      }).catch(function (err) {
	    	  console.log(err);
	      }); 
	    return url1;
	}

	
	// 这里的download换掉，
	$("#download").on("click",function(){
			url3="";//这里的值根据点击时候来获取对应图片的src作为参数传给url;这里获取到的url可能有路径的前缀后缀问题，可能需要进行字符串的截取拼接
			OSSdownload(url3);
	});
	$(".download").on("click",function(){
		alert(1)
		url3="";//这里的值根据点击时候来获取对应图片的src作为参数传给url;这里获取到的url可能有路径的前缀后缀问题，可能需要进行字符串的截取拼接
		OSSdownload(url3);
    });
	
	
	// OSS下载图片
	function OSSdownload(url){
		
      var x=url.lastIndexOf("/")+1;
      var url1=url.substring(x);
      var objectKey = url; //后期传值
      var saveAs = url1;
      var result = client.signatureUrl(objectKey, {
        expires: 3600,
        response: {
          'content-disposition': 'attachment; filename="' + saveAs + '"'
        }
      });
      window.location = result;
//      console.log(result);
	}

	

$("#s3_uC_modal_com").on("click",function(e){
	OSSupload1(e);   //修改头像完成的
})

