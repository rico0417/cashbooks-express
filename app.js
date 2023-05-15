const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 导入路由模块（引入子路由）
const indexRouter = require('./routes/web/index');
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
 * 当用户进行新的请求时，
 * express-session 将使用cookie中的标识符到数据库中检索与当前用户相关的session数据，
 * 并存入每个请求的req.session中
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
/**
 * cookie-parser中间件用于解析HTTP请求中的cookie
 */
app.use(cookieParser());
/**
 * express.static中间件用于指定Express应用程序的静态资源
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 配置路由页（将子路由挂载到主路由）
 */
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/api', accountRouter);
app.use('/api', authApiRouter);

/**
 * catch 404 and forward to error handler
 * 通过向一个不含路径参数的回调函数传值 err, req, res 和 next，
 * 你可以访问应用程序中的错误处理路径
 * 
 * 配置404页面
 */
app.use(function(req, res, next) {
  // 响应404
  res.render('404');
});

/**
 * 作用：
 * Express：错误处理器中间件，当前端请求处理过程中出现错误时，将调用这个错误处理器。
 * 
 * 需要注意的是：
 * 错误处理器必须放在所有路由处理器之后，
 * 这样，如果处理请求时出现错误，将会被错误处理器捕获并返回错误响应。
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /**
   * 这里设置的res.locals的属性 可以在跳转到视图页面时，直接访问。
   * 比如<%= message %> <%= error %>
   * 具体可以参考error.ejs页面
   */
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
