const Router = require('general-router');
const utils = require('ntils');
const Response = require('./response');
const sleep = require('../common/sleep');

const SHORT_METHDS = [
  'get', 'post', 'put', 'delete', 'patch',
  'options', 'head', 'copy', 'link', 'unlink',
  'lock', 'unlock', 'purge', 'propfind', 'view'
];

const EXECABLE_STRING = /^\/\/!exec/;
const ABS_PATH_NO_PROTOCOL = /^\/\//;

class Faked {

  constructor() {
    this.delay = 0;
    this.timeout = 5 * 1000;
    this.router = new Router();
    this.global = Object.create(null);
  }

  when(methods, pattern, handler, options) {
    if (!utils.isArray(methods)) {
      methods = [methods];
    }
    if (ABS_PATH_NO_PROTOCOL.test(pattern)) {
      this.when(methods, `http:${pattern}`, handler, options);
      this.when(methods, `https:${pattern}`, handler, options);
    }
    this.router.add([{ methods, pattern, handler, options }]);
  }

  _findRoute(request) {
    const matchedRoutes = this.router.get(request.url.split('?')[0]);
    const route = matchedRoutes.find(
      item => item.methods.indexOf(request.method.toUpperCase()) > -1
    );
    if (!route) {
      if (this.debug) {
        this.warn(`Unmatched: "${request.method} ${request.url}"`);
      }
      return;
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
    const ctx = utils.create(request);
    this._checkTimeout(ctx);
    ctx.request = request;
    ctx.route = route;
    ctx.params = route.params;
    ctx._sended = false;
    ctx.send = (body, status, headers) => {
      if (ctx._sended) {
        return this.error(
          'Send and return cannot coexist, and send cannot be repeated'
        );
      }
      ctx._sended = true;
      status = status || 200;
      const res = new Response(body, { status, headers });
      done(res);
      this.info(`Response "${ctx.method} ${ctx.url}"`, {
        headers: res.headers.toMap(), body: body
      });
    };
    const handler = route.handler;
    if (utils.isFunction(handler)) {
      const result = await handler.call(ctx, ctx, this.global);
      //如果 result 为 null，认为用户将要手动调用 this.send 方法
      //否则，自动调用 send，用 await 可使用户基于 Promise 完成异步操作
      if (!utils.isNull(result)) ctx.send(result);
    } else {
      ctx.send(handler);
    }
  }

  error(...args) {
    console.error('[faked]:', ...args);
  }

  log(...args) {
    console.log('[faked]:', ...args);
  }

  warn(...args) {
    console.warn('[faked]:', ...args);
  }

  info(...args) {
    console.info('[faked]:', ...args);
  }

  random(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
  }

  calcDelay(route) {
    const delay = utils.isNull(route.delay) ? this.delay : route.delay;
    if (utils.isFunction(delay)) return delay(route);
    if (utils.isNumber(delay)) return delay;
    if (utils.isArray(delay)) return this.this.random([delay[0], delay[1]]);
    return 0;
  }

  async handle(request) {
    const route = this._findRoute(request);
    if (!route) return;
    this.info(`Request "${request.method} ${request.url}"`, {
      headers: request.headers.toMap(),
      query: request.query,
      body: request.body
    });
    const delay = Number(this.calcDelay(route));
    if (delay > 0) await sleep(delay);
    return new Promise(resolve => {
      this._invokeHandler(request, route, resolve);
    });
  }

  fromJson(list) {
    list.forEach(item => {
      item.handler = item.handler || item.content;
      item.pattern = item.pattern || item.url;
      item.options = item.options || item.option;
      item.methods = item.methods || item.method || item.type;
      if (utils.isString(item.handler) && EXECABLE_STRING.test(item.handler)) {
        item.handler = new Function('context', 'global', item.handler);
      }
      this.when(item.methods, item.pattern, item.handler, item.options);
    });
  }

  toJson() {
    return this.router.table.map(item => {
      return {
        methods: item.methods,
        pattern: item.pattern,
        handler: item.handler,
        options: item.options
      };
    });
  }
}

SHORT_METHDS.forEach(method => {
  Faked.prototype[method] = function (...args) {
    return this.when(method, ...args);
  };
});

module.exports = new Faked();
