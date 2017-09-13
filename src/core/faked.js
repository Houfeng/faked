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

  when(methods, pattern, handler, opts) {
    if (!utils.isArray(methods)) {
      methods = [methods];
    }
    if (ABS_PATH_NO_PROTOCOL.test(pattern)) {
      this.when(methods, `http:${pattern}`, handler, opts);
      this.when(methods, `https:${pattern}`, handler, opts);
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
      let res = new Response(body, {
        status,
        headers
      });
      done(res);
      this.info(`[Res]: "${ctx.method} ${ctx.url}"`, {
        headers: res.headers.toMap(),
        body: body
      });
    };
    let handler = route.handler;
    if (utils.isFunction(handler)) {
      let result = handler.call(ctx, ctx, this.global);
      //如果 result 为 null，认为用户将要手动调用 this.send 方法
      //否则，自动调用 send，用 await 可使用户基于 Promise 完成异步操作
      if (!utils.isNull(result)) ctx.send(await result);
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

  async handle(request) {
    let route = this._findRoute(request);
    if (!route) return;
    this.info(`[Req]: "${request.method} ${request.url}"`, {
      headers: request.headers.toMap(),
      query: request.query,
      body: request.body
    });
    if (this.delay > 0) await sleep(this.delay);
    return new Promise((resolve) => {
      this._invokeHandler(request, route, resolve);
    });
  }

  fromJson(list) {
    list.forEach(item => {
      item.handler = item.handler || item.content;
      item.pattern = item.pattern || item.url;
      item.options = item.options || item.option;
      item.methods = item.methods || item.method || item.type;
      if (utils.isString(item.handler) &&
        EXECABLE_STRING.test(item.handler)) {
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
        options: item.opts
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