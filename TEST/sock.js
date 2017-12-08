var express = require("express"),
	app = express();
var http = require("http");
var server = http.createServer(app);
var mysql = require("mysql");
//var count = 1;         //之后需要找到更适合的存储方式
server.listen(8080);
var io = require("./tool/node_modules/socket.io").listen(server);


var DEEP=30;    //一轮有多少人
var minId = 1;    //最小的id

//连接数据库并将每个学生的姓名及状态返回给客户端
function connectDB(){
	var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	return conn;
}
function getDB(socket){
    var conn = connectDB();
	//查找所有登陆过得学生的信息
	var qu = "SELECT * from student WHERE status!=1 AND status!=5";
	var stuID = [];
	conn.query(qu,function(err,rows,fileds){
		 for(var i=0;i<rows.length;i++){
		 	stuID.push(rows[i].id);
		 }
		 stuID.join(",");
		 console.log(stuID.length);
		// if(i==rows.length){
		 	//count++;
		 	//查找所有status为2的数据
		 	/*var qu1 = "SELECT * from student WHERE id IN ("+stuID+")";
		 	conn.query(qu1,function(err,rows,fileds){
		 		console.log("又进行一轮");
		 		// minId = rows[0].ID;
		 		 conn.end();*/
		 		 setInterval(function(){
		 		 	returnItem(socket,stuID);
		 		 },2000);		 		
		 //	});
		 //}
		
	});

}

function returnItem(socket,stuID){
		        var conn = connectDB();
	
				var que = "SELECT name,status,interviewer FROM student WHERE id IN ("+stuID+")";
				console.log("请求的数据:"+que);
				conn.query(que,function(err,rows,filed){
			        if(err){
			        	console.log("连接数据库失败");
			        	return;
			        }else{
			        	console.log("从数据库获得的数据是:"+rows);
			            socket.emit('system',rows);	
			            conn.end();
			            return rows;
			        }
				}); 
}
app.use('/',express.static(__dirname));

//连接数据库，获得数据库内各个成员现在的状态
io.on('connection',function(socket){
		getDB(socket); 
});
