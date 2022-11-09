import Koa from 'koa';
import Router from './router.js';

const router = new Router();
router.get('/hello', async (ctx, next) => {
  // await next();
  ctx.body = "hello";
})
const app = new Koa();

async function logTime(ctx, next) {
  console.time('logTime');
  const start = Date.now();
  await next();
  const end = Date.now();
  ctx.set('X-Response-Time', (end - start) + 'ms');
  console.timeEnd('logTime');
}

async function errorHandler(ctx, next) {
  const { status, url, method } = ctx;
  console.log(url, method, status)
  if (url === '/404' && method === 'GET') {
    ctx.body = "Not Found";
    ctx.status = 404;
    return;
  }
  await next();

}
app.use(router.routes());
app.use(logTime);
app.use(errorHandler);
app.use(async (ctx, next) => {
  const { url, method, path, query } = ctx
  console.log(url, method, path, query)
  ctx.state.user = { name: "king" };
  ctx.body = { query }
  await next();
})

/* app.use(async (ctx, next) => {
  ctx.response.status = 200;
  ctx.cookies.set('app', "koa", { path: '/test', httpOnly: true, maxAge: 3000 });

  const accept = ctx.request.accepts('html');
  console.log(accept);
  if (accept) {
    ctx.response.type = 'html';
  }
  console.log(ctx.response.is('text/html'), 'kkk');
  await next();
  ctx.response.body = ctx.state.user;
}) */

app.use(async (ctx, next) => {
  // ctx.throw(500);
  ctx.body = 'hello world';
  await next();
})

/* app.use(async (ctx, next) => {
  return new Promise((resolve, reject) => {
    let data = '';
    ctx.req.on('data', (d) => {
      data += d.toString();
    });
    ctx.req.on('end', () => {
      ctx.body = data;
      resolve();
    });
  })
}); */


app.listen(3000, () => console.log('server listening on port 3000'));