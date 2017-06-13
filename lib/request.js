/*istanbul ignore next*/'use strict';

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

var Headers = require('./headers');
var Body = require('./body');
var utils = require('ntils');
var querystring = require('querystring');

/*istanbul ignore next*/var Request = function (_Body) {
  (0, _inherits3.default)(Request, _Body);

  function /*istanbul ignore next*/Request(url, opts) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Request);

    opts = opts || {};

    /*istanbul ignore next*/var _this = (0, _possibleConstructorReturn3.default)(this, (Request.__proto__ || (0, _getPrototypeOf2.default)(Request)).call(this, opts.body));

    /*istanbul ignore next*/_this.opts = {};
    if (!utils.isString(url)) {
      utils.copy(url, /*istanbul ignore next*/_this.opts);
    } else {
      /*istanbul ignore next*/_this.opts.url = url;
    }
    utils.copy(opts, /*istanbul ignore next*/_this.opts);
    /*istanbul ignore next*/_this.url = /*istanbul ignore next*/_this.opts.url;
    /*istanbul ignore next*/_this.method = /*istanbul ignore next*/_this.opts.method || 'GET';
    /*istanbul ignore next*/_this.headers = new Headers( /*istanbul ignore next*/_this.opts.headers);
    /*istanbul ignore next*/_this.context = /*istanbul ignore next*/_this.opts.context || window;
    /*istanbul ignore next*/_this.referrer = /*istanbul ignore next*/_this.opts.referrer || location.href;
    /*istanbul ignore next*/_this.mode = /*istanbul ignore next*/_this.opts.mode;
    /*istanbul ignore next*/_this.credentials = /*istanbul ignore next*/_this.opts.credentials;
    /*istanbul ignore next*/_this.redirect = /*istanbul ignore next*/_this.opts.redirect;
    /*istanbul ignore next*/_this.integrity = /*istanbul ignore next*/_this.opts.integrity;
    /*istanbul ignore next*/_this.cache = /*istanbul ignore next*/_this.opts.cache;
    /*istanbul ignore next*/return _this;
  }

  //这是一个扩展属性, 不是标准 API


  (0, _createClass3.default)(Request, [{
    key: 'clone',
    value: function clone() {
      return new Request(this.url, this.opts);
    }
  }, {
    key: 'body',
    get: function get() {
      var contentType = this.headers.get('Content-Type');
      switch (contentType) {
        case 'application/json':
        case 'text/json':
          return utils.isString(this.rawBody) ? JSON.parse(this.rawBody) : this.rawBody;
        case 'application/x-www-form-urlencoded':
          return utils.isString(this.rawBody) ? querystring.parse(this.rawBody) : this.rawBody;
        default:
          return this.rawBody;
      }
    },
    set: function set(value) {
      this.rawBody = value;
    }
  }, {
    key: 'url',
    set: function set(url) {
      this._url = url;
      if (!url) return;
      this.query = querystring.parse(url.split('?')[1]);
    },
    get: function get() {
      return this._url;
    }
  }]);
  return Request;
}(Body);

module.exports = Request;