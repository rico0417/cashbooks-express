// 检测登录的中间件
module.exports = (req, res, next) => {
  // 判断(通过浏览器中缓存的_id, express-session中间件从数据库中找到对应的session数据，我们通过req.session访问)
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
};
