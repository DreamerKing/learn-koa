```bash
yarn add koa
yarn add koa-router

yarn add koa-static

yarn add koa-views pug ejs
```

koa 原生支持 query 参数的解析

```bash
yarn add koa-bodyparser
支持json/form/text/xml格式的解析，默认支持json和form格式
// 支持x-www-form-urlencoded和application/json的解析
```

```bash
npm install -g redis-commander
redis-commander
```

组合中间件

```bash
yarn add koa-compose
```

中间件决定响应请求，并希望绕过下游中间件可以简单地省略 next()。

Koa 以及许多构建库，支持来自 debug 的 DEBUG 环境变量，它提供简单的条件记录。

可以为匿名中间件设置`._name`来方便调试。

路由重写和重定向

Context 对象

- request
  - accepts()
- response
  - type
  - status
  - is(type)
- app
- req
- res
- socket
- state 中间件共享数据使用
- cookies
  cookie options
  - maxAge 过期时间(ms)
  - signed 签名
  - expires 过期时间
  - path 路径
  - domain 域名
  - secure 是否只能 https 访问
  - httpOnly 是否支持 js 读取
  - overwrite 是否覆盖同名 cookie

Rest 概念

- 一切皆资源
- 每个资源对应唯一的 URI
- 对资源的操作不会改变 URI
- 所有的操作都是无状态的

koa-router

all() 一般用于设置请求头
url() 根据路由名称和参数生成 url

特性：

- 命名路由
- 嵌套路由
- 多中间件
- 路由前缀
- 路径参数

koa-jwt
