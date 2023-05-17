const express = require('express');
// 导入shortid
const shortid = require('shortid')
// 导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModels');
// 导入中间件用于检测用户是否登录
const checkLoginMiddlewar = require('../../middlewares/checkLoginMiddleware')

// 创建路由对象
const router = express.Router();

// 添加首页路由规则
router.get('/', (req, res) => {
  // 重定向 /account
  res.redirect('/account')
})

// 记账本列表
router.get('/account', checkLoginMiddlewar, function(req, res, next) {
  // // 获取所有账单信息
  // let accounts = db.get('accounts').value()
  AccountModel.find().sort({time: -1}).exec((err, data) => {
    if(err){
      res.status(500).send('读取数据失败~~~~~~~')
      return
    }
    res.render('list', {accounts: data, moment: moment});
  })

  // console.log(accounts)
});

// 添加记录
router.get('/account/create', checkLoginMiddlewar, function(req, res, next) {
  res.render('create');
});

// 新增记录
router.post('/account', checkLoginMiddlewar, function(req, res, next) {
  // 写入文件
  // db.get('accounts').unshift({id:id, ...req.body}).write()
  // 插入数据库
  AccountModel.create({
    ...req.body,
    // 修改time属性
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if(err){
      res.status(500).send('插入失败~~~~~')
      return
    }
    res.render('success' , {msg:'添加成功~~~~~', url:'/account'})
  })
});

// 删除记录
router.get('/account/:id', checkLoginMiddlewar, (req, res) => {
  // 获取params的id参数
  let id = req.params.id
  // 删除
  AccountModel.deleteOne({_id: id}, (err, data) => {
    if(err){
      res.status(500).send('删除失败啦~~')
      return
    }
    res.render('success' , {msg:'删除成功~~~~~', url:'/account'})
  })
})

module.exports = router;
