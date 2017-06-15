/*istanbul ignore next*/'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Router = require('general-router');
var utils = require('ntils');
var Response = require('./response');
var sleep = require('./sleep');

var SHORT_METHDS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'copy', 'link', 'unlink', 'lock', 'unlock', 'purge', 'propfind', 'view'];

var EXECABLE_STRING = /^\/\/!exec/;

/*istanbul ignore next*/var Faked = function () {
  function /*istanbul ignore next*/Faked() {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Faked);

    this.delay = 0;
    this.timeout = 5 * 1000;
    this.router = new Router();
    this.global = {};
  }

  (0, _createClass3.default)(Faked, [{
    key: 'when',
    value: function when(methods, pattern, handler, opts) {
      if (!utils.isArray(methods)) {
        methods = [methods];
      }
      this.router.add([{
        methods: methods,
        pattern: pattern,
        handler: handler,
        opts: opts
      }]);
    }
  }, {
    key: '_findRoute',
    value: function _findRoute(request) {
      var matchedRoutes = this.router.get(request.url.split('?')[0]);
      var route = matchedRoutes.find(function (item) /*istanbul ignore next*/{
        return item.methods.indexOf(request.method.toUpperCase()) > -1;
      });
      if (!route) {
        return this.warn( /*istanbul ignore next*/'Unmatched request: "' + request.method + ' ' + request.url + '"');
      }
      route.method = request.method;
      return route;
    }
  }, {
    key: '_checkTimeout',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return sleep(this.timeout);

              case 2:
                if (!ctx._sended) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return');

              case 4:
                this.error( /*istanbul ignore next*/'Timeout: ' + ctx.method + ' ' + ctx.url);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _checkTimeout(_x) {
        return _ref.apply(this, arguments);
      }

      return _checkTimeout;
    }()
  }, {
    key: '_invokeHandler',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(request, route, done) {
        var _this = this;

        var ctx, handler, result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                ctx = utils.create(request);

                this._checkTimeout(ctx);
                ctx.request = request;
                ctx.route = route;
                ctx.params = route.params;
                ctx._sended = false;
                ctx.send = function (body, status, headers) {
                  if (ctx._sended) {
                    return (/*istanbul ignore next*/_this.error('Send and return cannot coexist, and send cannot be repeated')
                    );
                  }
                  ctx._sended = true;
                  status = status || 200;
                  done(new Response(body, {
                    status: status,
                    headers: headers
                  }));
                  /*istanbul ignore next*/_this.info( /*istanbul ignore next*/'Responsed: "' + ctx.method + ' ' + ctx.url + '"');
                };
                handler = route.handler;

                if (!utils.isFunction(handler)) {
                  _context2.next = 18;
                  break;
                }

                result = handler.call(ctx, ctx, this.global);
                //如果 result 为 null，认为用户将要手动调用 this.send 方法
                //否则，自动调用 send，用 await 可使用户基于 Promise 完成异步操作

                if (utils.isNull(result)) {
                  _context2.next = 16;
                  break;
                }

                _context2.t0 = ctx;
                _context2.next = 14;
                return result;

              case 14:
                _context2.t1 = _context2.sent;

                _context2.t0.send.call(_context2.t0, _context2.t1);

              case 16:
                _context2.next = 19;
                break;

              case 18:
                ctx.send(handler);

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _invokeHandler(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return _invokeHandler;
    }()
  }, {
    key: 'error',
    value: function error(text) {
      console.error( /*istanbul ignore next*/'[faked]: ' + text);
    }
  }, {
    key: 'log',
    value: function log(text) {
      console.log( /*istanbul ignore next*/'[faked]: ' + text);
    }
  }, {
    key: 'warn',
    value: function warn(text) {
      console.warn( /*istanbul ignore next*/'[faked]: ' + text);
    }
  }, {
    key: 'info',
    value: function info(text) {
      console.info( /*istanbul ignore next*/'[faked]: ' + text);
    }
  }, {
    key: 'handle',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(request) {
        var _this2 = this;

        var route;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                route = this._findRoute(request);

                if (route) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt('return');

              case 3:
                this.info( /*istanbul ignore next*/'Requesting: "' + request.method + ' ' + request.url + '"');

                if (!(this.delay > 0)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 7;
                return sleep(this.delay);

              case 7:
                return _context3.abrupt('return', new /*istanbul ignore next*/_promise2.default(function (resolve) {
                  /*istanbul ignore next*/_this2._invokeHandler(request, route, resolve);
                }));

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function handle(_x5) {
        return _ref3.apply(this, arguments);
      }

      return handle;
    }()
  }, {
    key: 'fromJson',
    value: function fromJson(list) {
      /*istanbul ignore next*/var _this3 = this;

      list.forEach(function (item) {
        item.handler = item.handler || item.content;
        item.pattern = item.pattern || item.url;
        item.options = item.options || item.option;
        item.methods = item.methods || item.method || item.type;
        if (utils.isString(item.handler) && EXECABLE_STRING.test(item.handler)) {
          item.handler = new Function('context', 'global', item.handler);
        }
        /*istanbul ignore next*/_this3.when(item.methods, item.pattern, item.handler, item.options);
      });
    }
  }, {
    key: 'toJson',
    value: function toJson() {
      return this.router.table.map(function (item) {
        return {
          methods: item.methods,
          pattern: item.pattern,
          handler: item.handler,
          options: item.opts
        };
      });
    }
  }, {
    key: 'applyWebpack',
    value: function applyWebpack(webpackConfig, srcFiles) {
      if (utils.isString(webpackConfig.entry)) {
        webpackConfig.entry = [webpackConfig.entry];
      }
      if (utils.isArray(webpackConfig.entry)) {
        /*istanbul ignore next*/var _webpackConfig$entry;

        return (/*istanbul ignore next*/(_webpackConfig$entry = webpackConfig.entry).unshift. /*istanbul ignore next*/apply( /*istanbul ignore next*/_webpackConfig$entry, /*istanbul ignore next*/(0, _toConsumableArray3.default)(srcFiles))
        );
      }
      utils.each(webpackConfig.entry, function (name, files) {
        /*istanbul ignore next*/var _files;

        if (!utils.isArray(files)) files = [files];
        /*istanbul ignore next*/(_files = files).unshift. /*istanbul ignore next*/apply( /*istanbul ignore next*/_files, /*istanbul ignore next*/(0, _toConsumableArray3.default)(srcFiles));
        webpackConfig.entry[name] = files;
      });
      return webpackConfig;
    }
  }]);
  return Faked;
}();

SHORT_METHDS.forEach(function (method) {
  Faked.prototype[method] = function () {
    /*istanbul ignore next*/for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (/*istanbul ignore next*/this.when. /*istanbul ignore next*/apply(this, /*istanbul ignore next*/[method].concat(args))
    );
  };
});

module.exports = new Faked();