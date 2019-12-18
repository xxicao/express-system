var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var common = require('../libs/common');
var articleRouter = require('./admin-article');
var userRouter = require('./admin-user');
var msgRouter = require('./admin-msg');

var db = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'yicao0824',
  database : '20190627'
});


//检查登录状态
router.use((req,res,next) => {
  if(!req.session['admin_id'] && req.url != '/login'  && req.url != '/forgot'  && req.url != '/register'){
    res.redirect('/admin/login');
  }else {
    next();
  }
});
//重定向后台首页
router.get('/', (req, res, next)=> {
  res.redirect('/admin/user');
});

//文章管理
router.use('/article', articleRouter);

//用户管理
router.use('/user', userRouter);

//留言管理
router.use('/msg', msgRouter);


//用户操作
router.get('/login', (req, res, next) => {
  res.render('login', {});
});
router.get('/forgot', (req, res, next)=> {
  res.render('forgot', {});
});

//退出
router.get('/logout', (req, res, next) => {
  req.session['admin_id'] = null;
  res.redirect('/admin/user');
});

//修改密码
router.post('/forgot', (req, res, next)=> {
  var username = req.body.username;
  var newpass = common.md5(common.MD5_SUFFIX + req.body.newpass);
  if(req.body.superpass == common.SUPER_PASS) {
    if(req.body.newpass != req.body.againpass) {
      res.send('两次密码不一致')
    }else{
      db.query(`UPDATE user_table SET password='${newpass}' WHERE username='${username}'`,function(err,data){
        if(err) {
          res.status(500).send('数据库错误').end();
        }else {
          res.redirect('/admin/login');
        }
      })
    }
  }else {
    res.send('超级密码错误')
  }
});

module.exports = router;
