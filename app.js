var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/web/index');
const accountRouter = require('./routes/api/account');
const authRouter = require('./routes/web/auth');
const authApiRouter = require('./routes/api/auth');
// 引入express-session connect-mongo
const session = require("express-session");
const MongoStore = require("connect-mongo");
// 导入配置项
const { DBHOST, DBPORT, DBNAME } = require('./config/config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

/**
 * 设置session的中间件
 */
app.use(session({
  name: 'sid', // 设置cookie的name，默认值是：connect.sid
  secret: 'atguigu', // 参与加密的字符串（又称签名） 加盐
  saveUninitialized: false, // 是否为每次请求都设置一个cookie用来存储session的id
  resave: true, // 是否在每次请求时重新保存session 20分钟 4:00 4:20
  store: MongoStore.create({
    mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}` // 数据库的连接配置
  }),
  cookie: {
    httpOnly: true, // 开启后前端无法通过JS操作
    maxAge: 1000 * 60 * 60 * 24 * 7 // 这一条 是 控制 sessionId 的过期时间的!!!
  }
}))

/**
 * express.urlencoded({ extended: false })
 * 是一个Express中间件，用于解析请求体中的URL编码数据。
 * xpress4.16.0及以上版本已经将express.urlencoded和body-parser合并了，因此可以直接使用express.urlencoded()中间件来解析请求体数据，无需再安装body-parser模块
 */
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/api', accountRouter);
app.use('/api', authApiRouter);

/**
 * catch 404 and forward to error handler
 * 配置404页面
 */
app.use(function(req, res, next) {
  // 响应404
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
