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
var status = require('./status');

//response 一定要保持和标准 API 一致

/*istanbul ignore next*/var Response = function (_Body) {
  (0, _inherits3.default)(Response, _Body);

  function /*istanbul ignore next*/Response(body, opts) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Response);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Response.__proto__ || (0, _getPrototypeOf2.default)(Response)).call(this, body));

    /*istanbul ignore next*/_this.opts = opts || {};
    /*istanbul ignore next*/_this.type = /*istanbul ignore next*/_this.opts.type;
    /*istanbul ignore next*/_this.url = /*istanbul ignore next*/_this.opts.url;
    /*istanbul ignore next*/_this.useFinalURL = /*istanbul ignore next*/_this.opts.useFinalURL;
    /*istanbul ignore next*/_this.status = /*istanbul ignore next*/_this.opts.status;
    /*istanbul ignore next*/_this.headers = new Headers( /*istanbul ignore next*/_this.opts.headers);
    /*istanbul ignore next*/_this.headers.set('Date', new Date().toString());
    /*istanbul ignore next*/_this.headers.set('X-Powered-By', 'Faked');
    /*istanbul ignore next*/_this.headers.set('Cache-Control', 'max-age=0');
    /*istanbul ignore next*/return _this;
  }

  (0, _createClass3.default)(Response, [{
    key: 'clone',
    value: function clone() {
      return new Response(this.body, this.opts);
    }
  }, {
    key: 'error',
    value: function error() {
      var res = new Response(this.body, this.opts);
      res.status = 500;
      return res;
    }
  }, {
    key: 'redirect',
    value: function redirect() {
      throw new Error('Faked does not support redirect');
    }
  }, {
    key: 'ok',
    get: function get() {
      return this.status >= 200 && this.status < 299;
    }
  }, {
    key: 'statusText',
    get: function get() {
      return status[this.status];
    }
  }]);
  return Response;
}(Body);

module.exports = Response;