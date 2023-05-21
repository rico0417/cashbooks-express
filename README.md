特点：
1.使用nodemon来自动重启更改代码后的程序。pnpm add nodemon -g

token是给接口做验证的

session在有浏览器的情况下更适合（因为浏览器访问接口/页面的时候 会自动带上cookie）

routes/api 目录下的接口是给前后端分离用的
routes/web 目录下的接口是前后端不分离...

待完成需求：
[] express跨域
[] 大文件上传
[] 登录鉴权
[] websocket + 心跳检测
[] redis