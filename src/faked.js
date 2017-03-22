const Router = require('general-router');
const utils = require('ntils');
const Response = require('./response');
const sleep = require('./sleep');

const SHORT_METHDS = [
  'get', 'post', 'put', 'delete', 'patch',
  'options', 'head', 'copy', 'link', 'unlink',
  'lock', 'unlock', 'purge', 'propfind', 'view'
];

class Faked {

  constructor() {
    this.delay = 0;
    this.timeout = 5 * 1000;
    this.router = new Router();
  }

  when(methods, pattern, handler, opts) {
    if (!utils.isArray(methods)) {
      methods = [methods];
    }
    this.router.add([{
      methods,
      pattern,
      handler,
      opts
    }]);
  }

  _findRoute(request) {
    let matchedRoutes = this.router.get(request.url.split('?')[0]);
    let route = matchedRoutes.
    find(item => item.methods.indexOf(request.method.toUpperCase()) > -1);
    if (!route) {
      return this.warn(`Unmatched request: "${request.method} ${request.url}"`);
    }
    route.method = request.method;
    return route;
  }

  async _checkTimeout(ctx) {
    await sleep(this.timeout);
    if (ctx._sended) return;
    this.error(`Timeout: ${ctx.method} ${ctx.url}`);
  }

  async _invokeHandler(request, route, done) {
    let ctx = utils.create(request);
    this._checkTimeout(ctx);
    ctx.request = request;
    ctx.route = route;
    ctx.params = route.params;
    ctx._sended = false;
    ctx.send = (body, status, headers) => {
      if (ctx._sended) {
        return this.error('Send and return cannot coexist, and send cannot be repeated');
      }
      ctx._sended = true;
      status = status || 200;
      done(new Response(body, {
        status,
        headers
      }));
      this.info(`Responsed: "${ctx.method} ${ctx.url}"`);
    }
    let handler = route.handler;
    if (utils.isFunction(handler)) {
      let result = handler.call(ctx, ctx);
      //如果 result 为 null，认为用户将要手动调用 this.send 方法
      //否则，自动调用 send，用 await 可使用户基于 Promise 完成异步操作
      if (!utils.isNull(result)) ctx.send(await result);
    } else {
      ctx.send(handler);
    }
  }

  error(text) {
    console.error(`[faked]: ${text}`);
  }

  log(text) {
    console.log(`[faked]: ${text}`);
  }

  warn(text) {
    console.warn(`[faked]: ${text}`);
  }

  info(text) {
    console.info(`[faked]: ${text}`);
  }

  async handle(request) {
    let route = this._findRoute(request);
    if (!route) return;
    this.info(`Requesting: "${request.method} ${request.url}"`);
    if (this.delay > 0) await sleep(this.delay);
    return new Promise((resolve) => {
      this._invokeHandler(request, route, resolve);
    });
  }
}

SHORT_METHDS.forEach(method => {
  Faked.prototype[method] = function (...args) {
    return this.when(method, ...args);
  }
});

module.exports = new Faked();