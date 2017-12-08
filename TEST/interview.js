var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var COUNT = 1;
var DEEP = 2;     //一轮有多少同学参加面试
var obj;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
//设置session
app.use(cookieParser());
app.use(session({
    secret: '123',
    cookie: {
        maxAge: 60000*60,
        //secure: false
    }, //设置有效时间是1小时
    resave: false, 
    saveUninitialized: false
}));




//对比面试官的信息，且将class用session存起来
function getDB(id,req,res){

	var obj={
		status:0     //默认为0
	};
    var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	var query = "SELECT * FROM interview WHERE id ="+id;
	conn.query(query,function(err,rows,filed){
		if(err){
			console.log("查找数据库失败");
		}else{
			if(req.query.pass == rows[0].pass){
				obj.status = 1;
				console.log("查找到了！！");
			}
			req.session.class = rows[0].class;
		/*	console.log("start req session:"+req.session.id);
			console.log("设置的req session是:"+req.session.class);*/
			res.setHeader("Access-Control-Allow-Credentials",true); 
			res.end(req.query.callback+"("+JSON.stringify(obj)+")");
			conn.end();
		}
	});
}

//查找student数据库中class与该class相同且待面试，count最小的值
function getStudentDB(req,res){
	
    var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	res.setHeader("Access-Control-Allow-Credentials",true); 
	console.log(req.session.id);
	if(req.session.name == undefined){
		 let obj={};
		 obj.code = 2;
		 res.end(req.query.callback+"("+JSON.stringify(obj)+")");
	}else{
	var que = "SELECT min(counts) AS MIN from student WHERE direction='"+req.session.class+"' AND status=3 AND counts!=0"; //AND id<="+COUNT*DEEP;
	console.log(que);
	conn.query(que,function(err,rows,filed){
		if(err){
			console.log("查找数据库失败");
		}else{
			var min = rows[0].MIN;
			console.log("待面试的最小的count是:"+min);
			if(min != null){
				var query = "SELECT * FROM student WHERE counts="+min;
				var que2 = "UPDATE student SET status=4,interviewer="+req.session.name+" WHERE counts="+min;  //更改此时学生的状态为正在面试
                console.log("更新为面试中："+que2);
				conn.query(query,function(err,rows,fields){
					 obj = rows[0];
					 obj.code = 1;
					// obj.href="./Files/"+obj.id+"_"+obj.name+".doc";
					 conn.query(que2,function(err,rows,fields){
					 	 console.log("更改学生状态为面试中");
					 	 res.end(req.query.callback+"("+JSON.stringify(obj)+")");
				         conn.end();
					 });
					
				});
			}else{
				console.log("待面试的最小的count是:"+min);
				var obj = {};
				obj.code = 0;
				res.end(req.query.callback+"("+JSON.stringify(obj)+")");
			}


			
		}
	});
  }
}


function updateStatus(req,res){
	var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	var query = "UPDATE student SET status=5,judge='"+req.query.judge+"' WHERE name='"+req.query.name+"' AND id='"+req.query.id+"'";
	console.log("改变面试完:"+query);
	conn.query(query,function(err,rows,fields){
        console.log("将学生状态已经更改为面试完！");
        conn.end();
      
        getStudentDB(req,res);
	});
}

function exit(req,res){
	let ele = {};
	ele.code =0;
	var conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	var query = "UPDATE student SET status=5,judge='"+req.query.judge+"' WHERE name='"+req.query.name+"' AND id='"+req.query.id+"'";
	console.log("改变面试完:"+query);
	conn.query(query,function(err,rows,fields){
        if(err){
        	res.end(req.query.callback+"("+JSON.stringify(ele)+")");
        }else{
        	ele.code =1;
        	console.log("将学生状态已经更改为面试完！");
	        conn.end();
	        console.log(req);

	        delete req.session.name;
	        delete req.session.class;

	        res.end(req.query.callback+"("+JSON.stringify(ele)+")");
        }
       // getStudentDB(req,res);
	});
}

app.get("/",function(req,res){
	var id = req.query.user;
	//将它用session存起来
    req.session.name = id;
    console.log("收到的id是:"+id);

	getDB(id,req,res);
});

app.get('/interview',function(req,res){
    //查找student数据库中class与该class相同且待面试，count最小的值
    getStudentDB(req,res);
});

app.get('/next',function(req,res){
     //当没有面试的人时就返回状态为0，提醒面试官
     updateStatus(req,res); 
});

app.get('/exit',function(req,res){
     //当没有面试的人时就返回状态为0，提醒面试官
     exit(req,res); 
});


app.listen(2200);