const express = require("express");
// 导入moment
const moment = require("moment");
const AccountModel = require("../../models/AccountModel");
// 导入中间件检测登录
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');

// 创建路由对象
// (使用express.Router()方法创建了一个新的子路由)
const router = express.Router();

/**
 * 添加首页路由规则
 */
router.get('/', (req, res) => {
  // 重定向 /account
  res.redirect('/account');
})

/* 记账本的列表 */
router.get("/account", checkLoginMiddleware, function (req, res, next) {
  // 读取集合信息
  AccountModel.find()
    .sort({ time: -1 })
    .exec()
    .then((result) => {
      res.render("list", { accounts: result, moment: moment });
    })
    .catch((err) => {
      res.status(500).send("读取失败~~~");
      return;
    });
});

/* 添加记录 */
router.get("/account/create", checkLoginMiddleware, function (req, res, next) {
  res.render("create");
});

// 新增记录
router.post("/account", checkLoginMiddleware, (req, res) => {
  // 插入数据库
  AccountModel.create({
    ...req.body,
    // 修改time属性的值
    time: moment(req.body.time).toDate(),
  })
    .then((result) => {
      // 成功提醒
      res.render("success", { msg: "添加成功哦~~~", url: "/account" });
    })
    .catch((err) => {
      if (err) {
        res.status(500).send("插入失败~~");
        return;
      }
    });
});

// 删除记录
router.get("/account/:id", checkLoginMiddleware, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({ _id: id })
    .then((result) => {
      res.render("success", { msg: "删除成功哦~~~", url: "/account" });
    })
    .catch((err) => {
      res.status(500).send("删除失败~");
      return;
    });
});

module.exports = router;
