// 导入 jsonwebtoken
const jwt = require('jsonwebtoken')
// 读取配置项
const {SECRET} = require('../config/config')
// 声明中间件
module.exports = (req, res, next) => {
    // 获取 token
    let token = req.get('token')
    // 判断
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token缺失~',
            data: null
        })
    }
    // 校验 token
    jwt.verify(token, SECRET, (err, data) => {
        // 检测 token 是否正确
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token错误~',
                data: null
            })
        }
        // 保存用户信息
        req.user = data
        // 如果 token 校验成功
        next()
    })
}