import Koa from 'koa';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import koaViews from 'koa-views'
const __dirname = dirname(fileURLToPath(import.meta.url));

const viewsPath = join(__dirname, './views');
console.log('views:', viewsPath);

const app = new Koa();
app.use(koaViews(viewsPath, {
  extension: 'ejs'
}));

app.use(async (ctx) => {
  const title = 'hello';
  await ctx.render('index', { title, content: 'koa' });
})

app.listen(4001, () => console.log('server runing at localhost:4001'));