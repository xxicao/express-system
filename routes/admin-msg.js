var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var urlLib = require('url');
var common = require('../libs/common');

var db = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'yicao0824',
    database : '20190627'
  });
  
//页面请求
router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM msg_table`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            res.render('index', {
                title: '留言列表',
                component: 'msg-list',
                select: 2,
                listData: data
            });
        }
    })
});
//删除留言
router.get('/delete/:id', (req, res, next) => {
    db.query(`DELETE FROM msg_table WHERE ID='${req.params.id}'`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            res.redirect('/admin/msg');
        }
    })
});
//清空留言
router.get('/clear', (req, res, next) => {
    db.query(`DELETE FROM msg_table`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            res.redirect('/admin/msg');
        }
    })
});


module.exports = router;
