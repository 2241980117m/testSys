var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mysql = require("mysql");

var app = express();

//code:0表示存数据失败,code:1表示数据已经存在于后台,code:2表示数据存入成功

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
//设置session
app.use(cookieParser());
app.use(session({
    secret: '123',
    cookie: {
        maxAge: 60000 * 60 * 2,
        secure: false
    }, //设置有效时间是2小时
    resave: false,
    saveUninitialized: false
}));

var ele={
	code:0   
};
var max = 0;
var obj={
	status:0
}
//单纯的链接数据库的函数
function DB(){
	var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	return conn;
}
//根据方向对应到相应的文件
function changeStr(clas){

		switch(clas){
    		case 1:return "web";break;
    		case 2:return "安全";break;
    		case 3:return "运维";break;
    		case 4:return "运营";break;
    		case 5:return "设计";break;
    		default:console.log("没有匹配！！");
    	}
    	//return clas;
}
function getInfo(req){
	 //查询此时的学号，姓名，方向，打开文件  
   let database = DB();
   let Class= __dirname+"\\Files\\";
   console.log("初始的目录:"+Class);
   let query = "SELECT * FROM student WHERE id='"+req.session.num+"'"; 
   console.log(query);
   database.query(query,function(err,rows,fields){
   		if(err){
   			console.log("查询数据库失败");
   		}else{
   			console.log(rows[0].direction);
   			Class+=changeStr(Number(rows[0].direction))+"\\";
   			Class+=req.session.num+"\\";
   			
   			database.end();
   			console.log("Class:"+Class);
   			return Class;
   		}
   })
}
//连接数据库并获得结果
function connectDB(name,id,req,res){
	let Class= __dirname+"\\Files\\";
	//创建连接对象	
	var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	var que = "SELECT * FROM student WHERE name='"+name+"'and id='"+id+"'";
	var que1 = "UPDATE student SET status="+2+" WHERE id='"+id+"' and name='"+name+"'";
    console.log(que1);
    //判断目录是否存在，若存在则不更新状态，不存在时更新且创建目录
    	conn.query(que,function(err,rows,fields){
		if(err){
			obj.status = 0;
			throw err;
		}else{
			console.log(rows.length);
			if(rows.length!=0){
				 if(rows[0].status == 1){
		        	obj.status = 1; 
		        	req.session.name = name;
		        	req.session.num = id;
		        	console.log(req.session.id);
		        	if(rows[0].direction == 1){
	                		 Class+="web\\";
	                	}else if(rows[0].direction == 2){
	                		 Class+="安全\\";
	                	}else if(rows[0].direction == 3){
	                		 Class+="运维\\";
	                	}else if(rows[0].direction == 4){
	                		 Class+="运营\\";
	                	}else{
	                		 Class+="设计\\";
	                	}
	                  //根据组别创建一个以学号姓名命名的目录
			           Class = Class+id;
			          // Class = Class+1;
			           if(fs.exists(Class)){
							obj.status = 0;
							console.log("文件夹已经存在！！");
					   }else{
					   	console.log(Class);
					   	fs.mkdir(Class,function(err){
						if(err){
							obj.status = 0;	
							console.log("文件夹创建失败！！");
							res.end(req.query.callback+"("+JSON.stringify(obj)+")"); 				  
						}else{
									obj.status = 1;
									console.log("创建目录成功");
								conn.query(que1,function(err,rows,fields){
						       	    if(err){
						       	    	obj.status = 3;   //注明数据库更新状态失败
						       	    	throw err;
						       	    }else{
						       	    	console.log("更新数据库状态成功");
					                	
					                	console.log("关闭数据看成功");
										    obj.status = 1;
										    res.end(req.query.callback+"("+JSON.stringify(obj)+")"); 
											conn.end();	 	
				       	    }
			                
			             });
							
						}
								 
				    });
			     }
	                
		        

		        }else{
		        	obj.status = 2; //注明已经机考过
		            console.log("该学生的状态是:"+rows[0].status);
		            conn.end();
					res.end(req.query.callback+"("+JSON.stringify(obj)+")"); 
		         }
			}else{
				obj.status = 2;   //注明数据库查找失败
				conn.end();
				res.end(req.query.callback+"("+JSON.stringify(obj)+")"); 
			}
	        
      }  
	});	
}

function updateStatus(id){
	console.log("进入更改状态！！");
	//创建连接对象
	var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	var max = 0;
	var que1 = "SELECT max(counts) AS MAX from student";
	conn.connect();
	conn.query(que1,function(err,rows,fields){
		if(err) throw err;
		max = rows[0].status;
     
       	console.log("最大值是："+rows[0].MAX);
       	max = rows[0].MAX+1;
		
		//更改状态
		var que = "UPDATE student set status=3,counts="+max+" WHERE id ='"+id+"'";
		console.log(que);
		conn.query(que,function(err,rows,fields){
			if(err){
				console.log("更新状态失败");
				throw err;
			}else{
				console.log("更新状态成功！！");
				conn.end();
			}
		})
	});
}

app.get("/check",function(req,res){
	res.setHeader("Access-Control-Allow-Credentials",true);
	//接收前端传来的数据
    var name = req.query.name;
    var id = req.query.pass;
    //连接数据库
   // connect(res);
   console.log("接收到的姓名时:"+name);
   console.log("接收到的学号是:"+id);
   
   connectDB(name,id,req,res);   
});

//code:4:存文件出错    code:0:登陆个人信息   code:1:文件已经存在    code:2:存文件成功
app.get('/',function(req,res){ 			//填空题存储
   let ele={}; 
   ele.code = 0;
   let database = DB();
   let Class= __dirname+"\\Files\\";
   console.log("初始的目录:"+Class);
   let query = "SELECT * FROM student WHERE id='"+req.session.num+"'"; 
   console.log(query);
   res.setHeader("Access-Control-Allow-Credentials",true); 
   database.query(query,function(err,rows,fields){
   		if(err){
   			console.log("查询数据库失败");
   		}else{

   			if(rows.length!=0){
   				Class+=changeStr(Number(rows[0].direction))+"\\";
   			}
   			
   			if(req.session.num){
   				Class+=req.session.num+"\\";
   			}
   			
   			database.end();
   			console.log("Class:"+Class);
   if(req.session.name){
   	console.log("启动了node服务器");
	
	var filename = Class+"/"+req.session.num+"_fill";
	var obj =req.query.data;
	var dataArr = [];
	
	//将对象中的所有数据取出来
	if(obj.answer || obj.idea){
	  for(var i=0;i<obj.answer.length||i<obj.idea.length;i++){
		var dataObj = {};
		
        dataObj.num = i+1;
        dataObj.id = obj.question[i].id;
        dataObj.question = obj.question[i].question;
        if(obj.question[i].select){
        	console.log("question:"+obj.question[i].select);
        	dataObj.select = [];
        	for(let j=0;j<obj.question[i].select.length;j++){      		
        		dataObj.select[j]={"id":obj.question[i].select[j].id,"content":obj.question[i].select[j].content}
        	}
        	
        }

        if(obj.question[i].code){
        	
        	dataObj.code = obj.question[i].code;
        }
       
		if(obj.answer&&obj.answer[i]){
			
			dataObj.answer = obj.answer[i];
		}
		
		if(obj.idea&&obj.idea[i]){
		
			dataObj.idea = obj.idea[i];
		}		
	
		dataArr.push(dataObj);
	   }
	}
   
	console.log(filename+"传来了数据");
	filename = filename+'.json';

	var fileData = JSON.stringify({"fill":dataArr});

	fs.exists(filename,function(flag){
		if(flag){
			console.log("文件已经存在！！");
			ele.code=1;
			console.log(req.query.callback+'('+JSON.stringify(ele)+')');
			res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		}else{
			fs.open(filename,'w',0644,function(e,fd){
		            if(e){
		            	  console.log("打开文件出错");
		            	  throw e;
		            	  ele.code = 4;
		            	  res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		            }
			       	fs.writeFile(filename,fileData,function(){
					console.log("写文件成功");
					//修改文件权限为可读，避免别人恶意修改文件
					fs.chmodSync(filename,574);

					fs.close(fd);
					ele.code=2;
					console.log("被动提交的标志:"+obj.status);
					console.log("被动提交的标志:"+typeof obj.status);
					console.log("被动提交的标志:"+(obj.status == "false"));
					if(obj.status == "false"){
						console.log("执行了更新操作！！");
						updateStatus(req.session.num);
					}
					//删除session
					//updateStatus(req.session.num);
					res.end(req.query.callback+'('+JSON.stringify(ele)+')');
			     });
	        });
		}
	});
}else{
	console.log("请先登录个人信息");
	res.end(req.query.callback+'('+JSON.stringify(ele)+')');
}
   		}
   })

});   

app.get('/store',function(req,res){			//编程题
   let dataArr = []; 
   let ele={};
   ele.code = 0;
 
   let database = DB();
   let Class= __dirname+"\\Files\\";
   console.log("初始的目录:"+Class);

   let query = "SELECT * FROM student WHERE id='"+req.session.num+"'"; 
   console.log(query);

   res.setHeader("Access-Control-Allow-Credentials",true);
   database.query(query,function(err,rows,fields){
   		if(err){
   			console.log("查询数据库失败");
   			
   		}else{
   			/*console.log(rows[0].direction);*/
   			if(rows.length!=0){
   				Class+=changeStr(Number(rows[0].direction))+"\\";
   			}

   			if(req.session.num){
   				Class+=req.session.num+"\\";
   			}
   		
   			
   			database.end();
   			console.log("Class:"+Class);
   	if(req.session.name){
   		console.log("启动了node服务器");
   		//判断文件夹是否存在


		var filename =Class+"\\"+req.session.num+"_code";
		var obj =req.query.data;
		console.log("前端传递过来的值是:"+obj);
		//var data = "";
	//将对象中的所有数据取出来
	if(obj.code||obj.idea){
		console.log("typeof obj.code::"+typeof obj.code);

		for(var i=0;(obj.code&&i<obj.code.length)||(obj.idea&&i<obj.idea.length);i++){
	    if((obj.code&&obj.code[i])||(obj&&obj.idea[i])){
		    let dataObj = {};
	        dataObj.num = i+1;
	        dataObj.id = obj.answer[i].id;
	        dataObj.question = obj.question[i];
	        if(obj.code&&obj.code[i]){
	        	dataObj.answer = obj.code[i];
	        }
			if(obj.idea&&obj.idea[i]){
				dataObj.idea = obj.idea[i];
			}	
			dataArr.push(dataObj);
	    }
	 }
	}
	let data = JSON.stringify({'code':dataArr});

	console.log(filename+"传来了数据");
	filename = filename+'.json';

	fs.exists(filename,function(flag){
		if(flag){
			console.log("文件已经存在！！");
			ele.code=1;
			console.log(req.query.callback+'('+JSON.stringify(ele)+')');
			res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		}else{
			fs.open(filename,'w',0644,function(e,fd){
		            if(e){
		            	  console.log("打开文件出错");
		            	  throw e;
		            	  ele.code=4;
		            	  res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		            }
			       	fs.writeFile(filename,data,function(){
					console.log("写文件成功");
					//修改文件权限为可读，避免别人恶意修改文件
					fs.chmodSync(filename,574);

					fs.close(fd);
					ele.code=2;
					updateStatus(req.session.num);					
					res.end(req.query.callback+'('+JSON.stringify(ele)+')');
			     });
	        });
		}
	});
}else{
	console.log("请先登录个人信息");
	res.end(req.query.callback+'('+JSON.stringify(ele)+')');
  }
   		}
   })


});

app.get('/instrest',function(req,res){					//脑洞题
   ele.code = 0;
   let dataArr = [];
   
   let database = DB();
   let Class= __dirname+"\\Files\\";
   console.log("初始的目录:"+Class);
   let query = "SELECT * FROM student WHERE id='"+req.session.num+"'"; 
   console.log(query);
   res.setHeader("Access-Control-Allow-Credentials",true); 

   database.query(query,function(err,rows,fields){
   		if(err){
   			console.log("查询数据库失败");

   		}else{
   			
   			if(rows.length!=0){
   				Class+=changeStr(Number(rows[0].direction))+"\\";
   			}
   			if(req.session.num){
   				Class+=req.session.num+"\\";
   			}
   			
   			database.end();
   			console.log("Class:"+Class);
   	if(req.session.name){
		var filename = Class+"\\"+req.session.num+"_instrest";
		var obj =req.query.data;
	
		var data = "";
	//将对象中的所有数据取出来
	

	for(var i=0;obj.code&&i<obj.code.length;i++){
		console.log("code i::"+obj.code[i]);
		if(obj.code[i]){
			let dataObj={};
	        dataObj.num = i+1;
	        dataObj.id = obj.answer[i].id;
	        dataObj.question = obj.question[i];

        	dataObj.answer = obj.code[i];
       
			dataArr.push(dataObj);
			console.log("obj::"+dataArr[0].id);
			break;
		}
	}

    data = JSON.stringify({'instrest':dataArr});

	console.log(filename+"传来了数据");
	filename = filename+'.json';

	fs.exists(filename,function(flag){
		if(flag){
			console.log("文件已经存在！！");
			ele.code=1;
			console.log(req.query.callback+'('+JSON.stringify(ele)+')');
			res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		}else{
			fs.open(filename,'w',0644,function(e,fd){
		            if(e){
		            	  console.log("打开文件出错");
		            	  throw e;
		            	  ele.code=4;
		            	  res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		            }
			       	fs.writeFile(filename,data,function(){
					console.log("写文件成功");
					//修改文件权限为可读，避免别人恶意修改文件
					fs.chmodSync(filename,574);

					fs.close(fd);
					ele.code=2;
					console.log("被动提交的标志:"+obj.status);
					if(obj.status == "false"){
						updateStatus(req.session.num);
					}
					
					//删除session
					//updateStatus(req.session.num);
					res.end(req.query.callback+'('+JSON.stringify(ele)+')');
			     });
	        });
		}
	});
}else{
	console.log("请先登录个人信息");
	res.end(req.query.callback+'('+JSON.stringify(ele)+')');
  }
   		}
   });
});

app.get('/add',function(req,res){				//附加题

   ele.code = 0;
  
   let dataArr = [];
   var data = "";
   res.setHeader("Access-Control-Allow-Credentials",true); 
   console.log("接收到的客户端传来的是:"+req.session.id);


   let database = DB();
   let Class= __dirname+"\\Files\\";
   console.log("初始的目录:"+Class);
   let query = "SELECT * FROM student WHERE id='"+req.session.num+"'"; 
   console.log(query);

   database.query(query,function(err,rows,fields){
   		if(err){
   			console.log("查询数据库失败");
   		}else{
   			
   			if(rows.length!=0){
   				Class+=changeStr(Number(rows[0].direction))+"\\";
   			}
   			if(req.session.num){
   				Class+=req.session.num+"\\";
   			}
   			
   			database.end();
   			console.log("Class:"+Class);
   	if(req.session.name){

   		console.log("启动了node服务器");
		var filename = Class+"\\"+req.session.num+"_add";
		var obj =req.query.data;
		console.log("前端传递过来的值是:"+obj);
		
	//将对象中的所有数据取出来
	for(var i=0;obj.code&&i<obj.code.length;i++){
		if(obj.code[i]){
			let dataObj = {};
		/*data += i+1+"-"+obj.answer[i].id+"  ";
		data += obj.question[i];
		data += "\n答案：";
        data += "\n";*/
        dataObj.num = i+1;
        dataObj.id = obj.answer[i].id;
        dataObj.question = obj.question[i];

       	dataObj.code = obj.code[i];
       
      //  data+="\n\n";
     	 dataArr.push(dataObj);
		}
       
	}
	data = JSON.stringify({'add':dataArr});
	console.log(filename+"传来了数据");
	filename = filename+'.json';

	fs.exists(filename,function(flag){
		if(flag){
			console.log("文件已经存在！！");
			ele.code=1;
			console.log(req.query.callback+'('+JSON.stringify(ele)+')');
			res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		}else{
			fs.open(filename,'w',0644,function(e,fd){
		            if(e){
		            	  console.log("打开文件出错");
		            	  throw e;
		            	  ele.code = 4;
		            	  res.end(req.query.callback+'('+JSON.stringify(ele)+')');
		            }
			       	fs.writeFile(filename,data,function(){
					console.log("写文件成功");
					//修改文件权限为可读，避免别人恶意修改文件
					fs.chmodSync(filename,574);

					fs.close(fd);
					ele.code=2;
					//updateStatus(req.session.num);
					res.end(req.query.callback+'('+JSON.stringify(ele)+')');
			     });
	        });
		}
	});
}else{
	console.log("请先登录个人信息");
	res.end(req.query.callback+'('+JSON.stringify(ele)+')');
  }
   		}
   });


});
app.get('/del',function(req,res){
	//删除session
     if(req.session.name){
	   	 delete req.session.name;     //删除之前存储的学生的姓名
	  }
	 if(req.session.num){
		 delete req.session.num;		//删除之前存储的学生的学号
	 }
	 console.log("session被销毁了！！");
	 res.end(req.query.callback+'('+JSON.stringify({"status":true})+')');
});

app.listen(2000);
console.log("服务器打开了！！");