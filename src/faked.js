const Router = require('general-router');
const utils = require('ntils');
const querystring = require('querystring');
const Response = require('./response');

const SHORT_METHDS = [
  'get', 'post', 'put', 'delete', 'patch',
  'options', 'head', 'copy', 'link', 'unlink',
  'lock', 'unlock', 'purge', 'propfind', 'view'
];

class Faked {

  constructor() {
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
    let route = this.router.get(request.url.split('?')[0])[0];
    if (!route || route.methods.indexOf(request.method.toUpperCase()) < 0) {
      return;
    }
    route.method = request.method;
    return route;
  }

  _invokeHandler(request, route, done) {
    let ctx = utils.create(request);
    ctx.request = request;
    ctx.route = route;
    ctx.params = route.params;
    ctx.query = querystring.parse(request.url.split('?')[1]);
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
      this.log(`Responsed: "${request.url}"`);
    }
    let handler = route.handler;
    if (utils.isFunction(handler)) {
      let result = handler.call(ctx, ctx);
      if (!utils.isNull(result)) ctx.send(result);
    } else {
      ctx.send(handler);
    }
  }

  error(text) {
    console.error(`[Faked]: %c${text}`, 'color:red;');
  }

  log(text) {
    console.log(`[Faked]: %c${text}`, 'color:blue;');
  }

  handle(request) {
    let route = this._findRoute(request);
    if (!route) return;
    this.log(`Requesting: "${request.url}"`);
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