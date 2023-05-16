const express = require("express");
// (使用express.Router()方法创建了一个新的子路由)
const router = express.Router();
const AccountModel = require("../../models/AccountModel");
// 导入moment
const moment = require("moment");
// 导入token处理中间件
const checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");

/**
 * 记账本的列表
 * /api/account
 */
router.get("/account", checkTokenMiddleware, function (req, res, next) {
  // 读取集合信息
  AccountModel.find()
    .sort({ time: -1 })
    .exec()
    .then((result) => {
      // 响应成功的提示
      res.json({
        // 响应编号
        code: "0000",
        // 响应的信息
        msg: "读取成功",
        // 响应的数据
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        code: "1001",
        msg: "读取失败~~",
        data: null,
      });
      return;
    });
});

// 新增记录
router.post("/account", checkTokenMiddleware, (req, res) => {
  // 插入数据库
  AccountModel.create({
    ...req.body,
    // 修改time属性的值
    time: moment(req.body.time).toDate(),
  })
    .then((result) => {
      res.json({
        code: "0000",
        msg: "创建成功",
        data: result,
      });
    })
    .catch((err) => {
      if (err) {
        res.json({
          code: "1002",
          msg: "创建失败~~",
          data: null,
        });
        return;
      }
    });
});

// 删除记录
router.delete("/account/:id", checkTokenMiddleware, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({ _id: id })
    .then((result) => {
      res.json({
        code: "0000",
        msg: "删除成功",
        data: {},
      });
    })
    .catch((err) => {
      res.json({
        code: "1003",
        msg: "删除账单失败",
        data: null,
      });
      return;
    });
});

// 获取单个账单信息
router.get("/account/:id", checkTokenMiddleware, (req, res) => {
  // 获取id参数
  const { id } = req.params;
  // 查询数据库
  AccountModel.findById(id)
    .then((result) => {
      res.json({
        code: "0000",
        msg: "读取成功",
        data: result,
      });
    })
    .catch((err) => {
      return res.json({
        code: "1004",
        msg: "读取失败~",
        data: null,
      });
    });
});

// 更新单个账单信息
router.patch("/account/:id", checkTokenMiddleware, (req, res) => {
  // 获取id参数
  const { id } = req.params;
  // 查询数据库
  AccountModel.updateOne({ _id: id }, req.body)
    .then((result) => {
      AccountModel.findById(id)
        .then((innerResult) => {
          res.json({
            code: "0000",
            msg: "更新成功",
            data: innerResult,
          });
        })
        .catch((err) => {
          return res.json({
            code: "1004",
            msg: "读取失败~~",
            data: null,
          });
        });
    })
    .catch((err) => {
      return res.json({
        code: "1005",
        msg: "更新失败~",
        data: null,
      });
    });
});

module.exports = router;
