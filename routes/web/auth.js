const express = require("express");
// (使用express.Router()方法创建了一个新的子路由)
const router = express.Router();
// 导入用户的模型
const UserModel = require("../../models/UserModel");
// 导入md5
const md5 = require("md5");

// 注册
router.get("/reg", (req, res) => {
  // 响应HTML内容(获取注册页的HTML信息)
  res.render("auth/reg");
});

// 注册用户
router.post("/reg", (req, res) => {
  // 做表单验证
  // 获取请求体的数据
  UserModel.create({ ...req.body, password: md5(req.body.password) })
    .then((result) => {
      res.render("success", { msg: "注册成功", url: "/login" });
    })
    .catch((err) => {
      res.status(500).send("注册失败，请稍后再试~~");
      return;
    });
});

// 登录页面
router.get("/login", (req, res) => {
  // 响应HTML内容
  res.render("auth/login");
});

// 登录操作
router.post("/login", (req, res) => {
  // 获取用户名和密码
  const { username, password } = req.body;
  // 查询数据库
  UserModel.findOne({ username, password: md5(password)}).then(result => {
    if (!result) {
      return res.status(500).send('账号或密码错误');
    }
    // 写入session
    req.session.username = result.username;
    req.session._id = result._id;
    // 登陆成功响应
    res.render('success', { msg: '登录成功', url: '/account' });
  }).catch(err => {
    res.status(500).send('登录，请稍后再试~~');
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
