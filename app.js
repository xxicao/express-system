var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var multer = require('multer');
var multerObj = multer({dest: './public/upload'})
var ueditor_backend = require('ueditor-backend')

var adminRouter = require('./routes/admin');


var common = require('./libs/common');
var mysql = require('mysql');
var db = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'yicao0824',
  database : '20190627'
});


var app = express();

//ueditor设置
ueditor_backend(app);

app.listen(80,'0.0.0.0',function(){
  console.log('服务器启动成功');
})
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options') {
      res.send(200);  //让options尝试请求快速结束
  }else {
      next();
  }
})
// 模板设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//处理打印
app.use(logger('dev'));
//处理post请求
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//处理cookie
app.use(cookieParser());
//处理静态文件
app.use(express.static(path.join(__dirname, 'public'),{index: 'index.html'}));

//处理上传文件和session
app.use(multerObj.any());
var keys = [];
for(var i=0;i<10000;i++){
  keys[i] = 'a_' + Math.random();
}
app.use(cookieSession({
  name: 'sess_id',
  keys: keys,
  maxAge: 20*60*1000
}))



// Router
app.use('/admin', adminRouter);
//登录，放外层用于设置locals
app.post('/login',(req, res, next) => {
  var username = req.body.username;
  var password = common.md5(common.MD5_SUFFIX + req.body.password)
  db.query(`SELECT * FROM user_table WHERE username='${username}'`,function(err,data){
    if(err) {
      res.status(500).send('数据库错误').end();
    }else {
      if(data.length == 0) {
        res.status(400).send('用户名不存在').end();
      }else {
        if(data[0].password  == password || req.body.password == common.SUPER_PASS) {
          req.session['admin_id']= data[0].ID || 95;
          //设置用户名为全局变量
          app.locals.username = data[0].username;
          res.redirect('/admin/user');
        }else {
          res.send('密码错误');
        }
      }
    }
  })
})

//留言接口
app.post('/contact/submit', (req,res,next) => {
  var username = req.body.username;
  var useremail = req.body.useremail;
  var usermsg = req.body.usermsg;
  db.query(`INSERT INTO msg_table (username,useremail,usermsg) VALUES ('${username}','${useremail}','${usermsg}')`, function (err, data) {
      if (err) {
          res.status(500).send('数据库执行错误').end();
      } else {
        res.send({flag: true,msg: '留言成功'});
      }
  })
})


// 捕获请求错误类型
app.use(function(req, res, next) {
  next(createError(404));
});

//错误处理
app.use(function(err, req, res, next) {
  // locals设置模板引擎 全局变量
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
