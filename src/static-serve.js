import Koa from 'koa';
import path, { dirname, join, resolve } from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import mime from 'mime';

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = new Koa();
const staticPath = resolve(__dirname, '../public');

app.use(async (ctx, next) => {
  const { url } = ctx.request;
  const fullPath = join(staticPath, url);
  const mimeType = mime.getType(fullPath);
  const content = await readFile(fullPath);

  if (mimeType) {
    ctx.type = mimeType;
  }
  if (mimeType?.includes('image/')) {
    ctx.body = content;
  } else {
    ctx.body = content;
  }
  await next();
})


app.listen(4000, () => console.log('server runing at localhost:4000'));