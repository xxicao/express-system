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
  

//请求页面
router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM article_table`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            if (data && data.length > 0) {
                data.map(item => {
                    item.createtime = common.formatDateTime(new Date(item.createtime));
                })
            }
            res.render('index', {
                title: '文章列表',
                component: 'article-list',
                select: 1,
                listData: data
            });
        }
    })
});
router.get('/add', (req, res, next) => {
    res.render('index', {
        title: '新增文章',
        component: 'article-add',
        select: 1
    });
});
router.get('/edit', (req, res, next) => {
    res.render('index', {
        title: '编辑文章',
        component: 'article-edit',
        select: 1
    });
})


//新增文章
router.post('/add', (req, res, next) => {
    var title = req.body.title;
    var content = req.body.content;
    var introduction = req.body.introduction;
    var createtime = new Date().getTime();
    db.query(`INSERT INTO article_table (title,content,introduction,createtime) VALUES ('${title}','${content}','${introduction}','${createtime}')`, function (err, data) {
        if (err) {
            res.status(500).send('数据库执行错误').end();
        } else {
            res.send({
                msg: 'ok',
                flag: true
            })
        }
    })

})
//编辑文章
router.post('/update', (req, res, next) => {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var introduction = req.body.introduction;
    console.log(req.body);
    db.query(`UPDATE article_table set title ='${title}',content='${content}',introduction='${introduction}' WHERE ID = '${id}'`, function (err, data) {
        if (err) {
            res.status(500).send('数据库执行错误').end();
        } else {
            res.send({
                msg: 'ok',
                flag: true
            })
        }
    })

})
//查询文章
router.post('/get', (req, res, next) => {
    db.query(`SELECT * FROM article_table WHERE ID ='${req.body.id}'`, function (err, data) {
        if (err) {
            res.status(500).send('数据库执行错误').end();
        } else {
            res.send(data);
        }
    })
})
//删除文章
router.get('/delete/:id', (req, res, next) => {
    db.query(`DELETE FROM article_table WHERE ID='${req.params.id}'`, function (err, data) {
        if (err) {
            res.status(500).send('数据库错误').end();
        } else {
            res.redirect('/admin/article');
        }
    })
});
//发布文章
router.get('/release', (req, res, next) => {
    var query = urlLib.parse(req.url, true).query;
    db.query(`UPDATE article_table set status ='${query.status}' WHERE ID = '${query.id}'`, function (err, data) {
        if (err) {
            res.status(500).send('数据库执行错误').end();
        } else {
            res.redirect('/admin/article')
        }
    })

})

module.exports = router;