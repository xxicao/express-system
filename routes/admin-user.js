var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var common = require('../libs/common');

var db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'yicao0824',
    database: '20190627'
});

//页面请求
router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM user_table`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            res.render('index', {
                title: '用户列表',
                component: 'user-list',
                select: 0,
                listData: data
            });
        }
    })
});
router.get('/add', (req, res, next) => {
    res.render('index', {
        title: '新增用户',
        component: 'user-add',
        select: 0
    });
});


//新增用户
router.post('/add', (req, res, next) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = common.md5(common.MD5_SUFFIX + req.body.newpass);
    db.query(`INSERT INTO user_table (username,password,email) VALUES ('${username}','${password}','${email}')`, function (err, data) {
        if (err) {
            res.status(500).send('数据库执行错误').end();
        } else {
            res.redirect('/admin/user');
        }
    })
});

//删除用户
router.get('/delete/:id', (req, res, next) => {
    db.query(`DELETE FROM user_table WHERE ID='${req.params.id}'`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            res.redirect('/admin/user');
        }
    })
});

module.exports = router;