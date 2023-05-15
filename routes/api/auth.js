const express = require("express");
// (使用express.Router()方法创建了一个新的子路由)
const router = express.Router();
// 导入用户的模型
const UserModel = require("../../models/UserModel");
// 导入md5
const md5 = require("md5");
// 导入jwt
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/config');

// 登录操作
router.post("/login", (req, res) => {
  // 获取用户名和密码
  const { username, password } = req.body;
  // 查询数据库
  UserModel.findOne({ username, password: md5(password)}).then(result => {
    if (!result) {
      return res.json({
        code: '2002',
        msg: '用户名或密码错误~~~',
        data: null
      })
    }
    // 创建当前用户的token
    const token = jwt.sign({
      username: result.username,
      _id: result._id
    }, secret, {
      expiresIn: 60 * 60 * 24 * 7
    });

    // 响应token
    res.json({
      code: '0000',
      msg: '登陆成功',
      data: token
    })
  }).catch(err => {
    res.json({
      code: '2001',
      msg: '数据库读取失败~~~',
      data: null
    })
    return;
  })
});

// 退出登录
router.post('/logout', (req, res) => {
  // 销毁 session
  req.session.destroy(() => {
    res.render('success', { msg: '退出成功', url: '/login'})
  })
});

module.exports = router;
