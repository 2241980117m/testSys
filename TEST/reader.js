var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//设置session
app.use(cookieParser());
app.use(session({
    secret: '123',
    cookie: {
        maxAge: 60000 * 60 * 24,
        secure: false
    }, //设置有效时间是24小时
    resave: false,
    saveUninitialized: false
}));


//连接数据库
function connectDB(){
	let conn = mysql.createConnection({
		host:'localhost',
		password:'100100mxh',
		user:'root',
		database:'2017_sign'
	});

	conn.connect();

	return conn;
}

app.get('/check',function(req,res){
	//返回code，组名，用户名
	//将组名、用户名,序号用session存起来
	let data = {"code":0};
	let obj = req.query;
	console.log(req.query);
    let conn = connectDB();

    let query = "SELECT *  FROM reader WHERE name='"+obj.user+"'";
    console.log(query);

    conn.query(query,function(err,rows,fields){
    	if(err){
    		console.log("查找失败");
    	}else{
    		console.log(rows[0]);
    		if(obj.pass == rows[0].password){
    			req.session.class = rows[0].direction;
    			req.session.name = obj.user;
    			req.session.num = rows[0].num;
    			data.code = 1;
    			data.name = obj.name;
    			data.class = rows[0].direction;
    			console.log("查找成功！！");
    			conn.end();
    		}
    	}
    	res.setHeader("Access-Control-Allow-Credentials",true);
    	res.end(req.query.callback+"("+JSON.stringify(data)+")");
    });
});

app.get('/read',function(req,res){
	console.log(req.session);
	console.log("进入读取！！");
	res.setHeader("Access-Control-Allow-Credentials",true);
	res.end(req.query.callback+"("+JSON.stringify({'data':req.session})+")");
});

//根据组号分别查询当前组有多少个人
app.get('/getItem',function(req,res){
	console.log("进入查询!!"+req.query);
	let conn = connectDB();	
	let num1,num2;
	let arr = [];
	let query1 = "SELECT count(*) AS sum  FROM reader WHERE direction ='"+req.session.class+"'";
	let query2 = "SELECT count(*) AS sum  FROM student WHERE direction ='"+req.session.class+"'";
	let query3 = "SELECT * FROM student WHERE direction='"+req.session.class+"'";
	conn.query(query1,function(err,rows,fileds){
		if(err){
			console.log("查询reader表失败");
		}else{
			num1 = Number(rows[0].sum);
			console.log("num1："+num1);
		}
	});
	conn.query(query2,function(err,rows,fileds){
		if(err){
			console.log("查询student表失败");
		}else{
			num2 = Number(rows[0].sum);		
			console.log("num2："+num2);
		}
		let average = Math.ceil(num2/num1);
		console.log("average:"+average);
		//返回 （当前序号-1）*average--当前序号*average 的数据
		conn.query(query3,function(err,rows,fileds){
			if(err){
				console.log("查询student数据库失败");
			}else{
				let i;
				if((req.session.num-1)*average<0){
					i = 0;
				}else{
					i =(req.session.num-1)*average;
				}
				console.log("i::"+i);
				console.log("length:"+rows.length);
				for(;i<rows.length&&i<req.session.num*average;i++){
					console.log("插入一条数据");
					arr.push(rows[i]);
				}
				conn.end();
			}
			res.setHeader("Access-Control-Allow-Credentials",true);
			console.log(arr.length);
			res.end(req.query.callback+"("+JSON.stringify({"data":arr})+")");
		});

	});
	
});

//将总分及批改卷面的人的序号插入数据库中
app.get('/insert',function(req,res){
	let obj1 = {"code":0};
	let obj = req.query;
	console.log(obj);
	let query1 = "UPDATE student set grade="+obj.total+",judger='"+obj.judger+"',total='"+obj.evaluation+"' WHERE id='"+obj.id+"'";
	let conn = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'100100mxh',
		database:'2017_sign'
	});
	conn.connect();
	conn.query(query1,function(err,rows,fields){
		if(err){
			console.log("更新总成绩失败"+err.message);
		}else{
			console.log("更新总成绩成功");
			conn.end();
			obj1.code = 1;
			res.setHeader("Access-Control-Allow-Credentials",true);
			res.end(req.query.callback+"("+JSON.stringify(obj1)+")");
		}
	});
});


app.listen(2300,function(){
	console.log("服务器启动了！！");
});
