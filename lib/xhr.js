/*istanbul ignore next*/'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var faked = require('./faked');
var utils = require('ntils');
var Request = require('./request');
var Headers = require('./headers');
var querystring = require('querystring');
var EventEmitter = require('events');

var READY_STATES = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};

/*istanbul ignore next*/var XMLHttpRequest = function (_EventEmitter) {
  (0, _inherits3.default)(XMLHttpRequest, _EventEmitter);

  function /*istanbul ignore next*/XMLHttpRequest() {
    /*istanbul ignore next*/var _ref;

    (0, _classCallCheck3.default)(this, XMLHttpRequest);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /*istanbul ignore next*/var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = XMLHttpRequest.__proto__ || (0, _getPrototypeOf2.default)(XMLHttpRequest)).call.apply(_ref, [this].concat(args)));

    utils.copy(READY_STATES, /*istanbul ignore next*/_this);
    /*istanbul ignore next*/_this.withCredentials = false;
    /*istanbul ignore next*/_this.timeout = 0;
    delete /*istanbul ignore next*/_this.readyState;
    /*istanbul ignore next*/_this.readyState = 0;
    /*istanbul ignore next*/_this._req = new Request();
    /*istanbul ignore next*/_this.sendAsBinary = /*istanbul ignore next*/_this.send;
    /*istanbul ignore next*/_this.openRequest = /*istanbul ignore next*/_this.open;
    /*istanbul ignore next*/return _this;
  }

  (0, _createClass3.default)(XMLHttpRequest, [{
    key: '_changeReadyState',
    value: function _changeReadyState(state) {
      this.readyState = state;
      var event = {};
      if (this.onreadystatechange) {
        this.onreadystatechange(event);
      }
      if (this.readyState === 4) {
        if (this.onload) this.onload(event);
        this.emit('load', event);
      }
    }
  }, {
    key: 'abort',
    value: function abort() {
      if (this._originXhr) {
        return this._originXhr.abort();
      }
      faked.warn('XHR Abort');
    }
  }, {
    key: 'getAllResponseHeaders',
    value: function getAllResponseHeaders() {
      if (this._originXhr) {
        return this._originXhr.getAllResponseHeaders(name);
      }
      if (!this._res) return;
      return this._res.headers.getAll().map(function (header) {
        return (/*istanbul ignore next*/header.name + ':' + header.value
        );
      }).join('\r\n');
    }
  }, {
    key: 'getResponseHeader',
    value: function getResponseHeader(name) {
      if (this._originXhr) {
        return this._originXhr.getResponseHeader(name);
      }
      if (!this._res) return;
      return this._res.headers.get(name);
    }
  }, {
    key: 'open',
    value: function open(method, url, isAsync, user, password) {
      this._openArgs = arguments;
      this._req = new Request(this._req, {
        url: url,
        method: method
      });
      this._isAsync = isAsync;
      this._changeReadyState(READY_STATES.OPENED);
    }
  }, {
    key: 'overrideMimeType',
    value: function overrideMimeType(mime) {
      if (this._originXhr) {
        return this._originXhr.overrideMimeType(mime);
      }
      this._mime = mime;
    }
  }, {
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
        var contentType;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                contentType = this._req.headers.get('Content-Type');

                if (contentType == 'application/x-www-form-urlencoded') {
                  this._req.body = querystring.parse(data);
                } else {
                  this._req.body = data;
                }
                this._changeReadyState(READY_STATES.HEADERS_RECEIVED);
                _context.next = 5;
                return faked.handle(this._req);

              case 5:
                this._res = _context.sent;

                if (this._res) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt('return', this._originSend(data));

              case 8:
                if (this._isAsync === false) {
                  faked.warn('Unable to synchronize request and has been replaced with an asynchronous request');
                }
                if (this._mime) {
                  this._res.headers.set('Content-Type', this._mime);
                }
                this._changeReadyState(READY_STATES.LOADING);
                this._changeReadyState(READY_STATES.DONE);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: '_originSend',
    value: function _originSend(data) {
      /*istanbul ignore next*/var _originXhr,
          _this2 = this;

      this._originXhr = new OriginXMLHttpRequest();
      this._originXhr.withCredentials = this.withCredentials;
      this._originXhr.timeout = this.timeout;
      /*istanbul ignore next*/(_originXhr = this._originXhr).open. /*istanbul ignore next*/apply( /*istanbul ignore next*/_originXhr, /*istanbul ignore next*/(0, _toConsumableArray3.default)(this._openArgs));
      this._originXhr.onload = this.onload;
      this._originXhr.onreadystatechange = this.onreadystatechange;
      this._originXhr.addEventListener('load', function (event) {
        /*istanbul ignore next*/_this2.emit('load', event);
      });
      return this._originXhr.send(data);
    }
  }, {
    key: 'setRequestHeader',
    value: function setRequestHeader(name, value) {
      if (this._originXhr) {
        return this._originXhr.setRequestHeader(name, value);
      }
      this._req.headers.set(name, value);
    }
  }, {
    key: 'responseType',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.responseType;
      }
      return '';
    },
    set: function set(value) {
      if (this._originXhr) {
        this._originXhr.responseType = value;
      }
    }
  }, {
    key: 'responseURL',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.responseURL;
      }
      if (!this._res) return;
      return this._req.url;
    }
  }, {
    key: 'responseText',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.responseText;
      }
      if (utils.isString(this.response)) return this.response;
      return (/*istanbul ignore next*/(0, _stringify2.default)(this.response)
      );
    }
  }, {
    key: 'responseXML',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.responseXML;
      }
      return null; //TODO: parse XML
    }
  }, {
    key: 'responseJSON',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.responseJSON;
      }
      return JSON.parse(this.responseText);
    }
  }, {
    key: 'response',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.response;
      }
      if (!this._res) return;
      return this._res.body;
    }
  }, {
    key: 'status',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.status;
      }
      if (!this._res) return;
      return this._res.status;
    }
  }, {
    key: 'statusText',
    get: function get() {
      if (this._originXhr) {
        return this._originXhr.statusText;
      }
      if (!this._res) return;
      return this._res.statusText;
    }
  }]);
  return XMLHttpRequest;
}(EventEmitter);

module.exports = XMLHttpRequest;