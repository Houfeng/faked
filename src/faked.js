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
    route.handler.call({
      route: route,
      request: request,
      params: route.params,
      query: querystring.parse(request.url.split('?')[1]),
      headers: request.headers,
      body: request.body,
      send: (body, status, headers) => {
        status = status || 200;
        done(new Response(body, {
          status,
          headers
        }));
        this.log(`Responsed: "${request.url}"`);
      }
    });
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