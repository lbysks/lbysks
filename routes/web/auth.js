var express = require('express');
const { get } = require('mongoose');
const md5 = require('md5')
var router = express.Router();

// 导入用户模型
const UserModel = require('../../models/UserModels')

// 注册页面
router.get('/reg', (req, res) => {
    // 响应 HTML 内容
    res.render('auth/reg')
})

// 注册用户
router.post('/reg', (req, res) => {
    // 获取请求体数据
    UserModel.create({...req.body, password: md5(req.body.password)}, (err, data) => {
        if(err){
            res.status(500).send('注册失败~')
            return
        }
        res.render('success', {msg: '注册成功', url: '/login'})
    })
})

// 登录页面
router.get('/login', (req, res) => {
    // 响应 HTML 内容
    res.render('auth/login')
})

// 登录操作
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let {username, password} = req.body
    // 查询数据库
    UserModel.findOne({username:username, password: md5(password)}, (err, data) => {
        if(err){
            res.status(500).send('登录失败哦~')
            return
        }
        // 判断 data
        // console.log(data)
        if(!data){
            res.send('对不起，账号或者密码错误')
            return
        }

        // 写入 session
        req.session.username = data.username
        req.session._id = data._id

        // 登录成功响应
        res.render('success', {msg: '登录成功', url: '/account'})
    })
})

// 退出登录
router.post('/logout', (req, res) => {
    // 销毁 session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'})
    })
})

module.exports = router;
