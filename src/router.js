export default class Router {
  #routers = [];

  get(url, handler) {
    this.#routers.push({
      url,
      method: 'GET',
      handler
    });
  }

  routes() {
    return async (ctx, next) => {
      const { method, url } = ctx;
      const matchedRouter = this.#routers.find(r => r.url === url && r.method === method);
      if (matchedRouter?.handler) {
        await matchedRouter.handler(ctx, next);
        return;
      }
      await next();
    }
  }
}