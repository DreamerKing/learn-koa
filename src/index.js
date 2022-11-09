import Koa from 'koa';
import path, { dirname, resolve, join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import KoaRouter from 'koa-router';
import views from 'koa-views';
import serve from 'koa-static';
import koaSessions from 'koa-session';
import koaBodyParser from 'koa-bodyparser';
import { koaBody } from 'koa-body';
import koaSend from 'koa-send';
import mount from 'koa-mount';
import cors from '@koa/cors';
import rewrite from 'koa-rewrite';
import koaError from 'koa-error';
import { nanoid } from 'nanoid';
import Store from './store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new Koa();
const staticPath = resolve(__dirname, '../public');
const viewsPath = join(__dirname, './views');

const router = new KoaRouter();

const redisConfig = {
  port: 6379,
  host: '127.0.0.1',
  password: ''
}

const sessionConfig = {
  key: 'koa:sess',
  maxAge: 6000,
  signed: false,
  store: new Store(redisConfig),
  genid: () => nanoid()
}

router.get('/', cors(), async (ctx, next) => {
  await next();
  const { url, query, querystring } = ctx.request;
  ctx.body = { url, query, querystring };
});


router.get('/test', cors(), async (ctx, next) => {
  console.log('get test')
  await next();
  ctx.body = '/test get';
});


router.post('/test', async (ctx, next) => {
  await next();
  ctx.body = 'test post';
})

router.all('/test', async (ctx, next) => {
  console.log('all method', ctx.method);
  await next();
  ctx.body = 'all';
})



router.get('/old/:name', cors(), async (ctx, next) => {
  console.log('old:', ctx.request.url);
  await next();
  ctx.body = ctx.request.query;
  // await ctx.response.redirect('/new');
});

router.get('/new/:name', cors(), async (ctx, next) => {
  console.log('new:', ctx.request.path);
  await next();
  ctx.body = ctx.request.query;
})

router.get('/query', cors(), async (ctx, next) => {
  console.log(ctx.request.query);
  console.log(ctx.request.origin);
  console.log('originUrl:', ctx.request.originalUrl);
  console.log("origin", ctx.request.headers.origin);
  await next();
  // ctx.response.set('Access-Control-Allow-Origin', ctx.request.headers.origin);
  ctx.body = ctx.request.query;
});

router.get('/login', async (ctx, next) => {
  console.log('session', ctx.session.userData);
  await ctx.render('test', { title: 'learn koa', session: ctx.session.userData })
});

router.get('/upload', async (ctx, next) => {
  await ctx.render('upload');
});

router.get('/download/:name', async (ctx, next) => {
  const name = ctx.params.name;
  console.log(staticPath, name);
  ctx.attachment(name);
  await koaSend(ctx, name, { root: staticPath });
})

router.post('/api/login', async (ctx, next) => {
  console.log(ctx.request.body)
  await next();
  ctx.body = ctx.request.body;
  ctx.session.userData = ctx.request.body;
});

router.post('/api/upload', async (ctx, next) => {
  const file = ctx.request.files.file;
  const fileData = await readFile(file.filepath);
  await writeFile(join(staticPath, file.originalFilename), fileData);
  await next();
  ctx.body = { success: true };
})

router.post('/post', async (ctx, next) => {
  console.log(ctx.request.body);
  console.dir(ctx.request.query);

  await next();
  ctx.cookies.set('name', "dreamerKing", { maxAge: 10000, path: '/query', overwrite: false, httpOnly: true, expires: new Date('2022-11-30 22:12:00') });
});

app.use(koaError({
  engine: 'pug',
  template: viewsPath + '/error.pug'
}))

app.use(views(viewsPath, {
  extension: 'pug'
}));
app.use(koaSessions(sessionConfig, app));
app.use(koaBodyParser({ enableTypes: ['text', 'json', 'form'] }));
app.use(koaBody({
  multipart: true, formidable: {
    maxFieldsSize: 200 * 1024 * 1024
  }
}));
app.use(rewrite(/\/old\/(\w+)/, '/new/$1'));
app.use(router.routes());
app.use(async (ctx, next) => {
  console.log('url:', ctx.request.url);
  console.log('cookies:', ctx.cookies.get('name'));
  await next();
});

app.use(mount('/static', serve(staticPath)))

/* 
app.use(async (ctx, next) => {
  const { url } = ctx.request
  console.log('1')
  await next();
  if (url == '/') {
    ctx.body = "hello koa!";
  } else {
    ctx.status = 404;
    ctx.body = 'not content!';
  }
  console.log('2')
});

app.use(async (ctx, next) => {
  console.log(3),
    await next();
  console.log(4)
});
 */
app.listen(8888, () => console.log('server runing at localhost:8888'));