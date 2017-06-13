/*istanbul ignore next*/'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = require('ntils');

var METHODS = ['arrayBuffer', 'blob', 'formData'];

/*istanbul ignore next*/var Body = function () {
  function /*istanbul ignore next*/Body(rawBody) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Body);

    this.bodyUsed = false;
    this.rawBody = utils.clone(rawBody);
  }

  (0, _createClass3.default)(Body, [{
    key: 'text',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.bodyUsed) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Body Used');

              case 2:
                if (!utils.isString(this.body)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', this.body);

              case 4:
                return _context.abrupt('return', /*istanbul ignore next*/(0, _stringify2.default)(this.body));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function text() {
        return _ref.apply(this, arguments);
      }

      return text;
    }()
  }, {
    key: 'json',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.bodyUsed) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Body Used');

              case 2:
                if (!utils.isString(this.body)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', JSON.parse(this.body));

              case 4:
                return _context2.abrupt('return', this.body);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function json() {
        return _ref2.apply(this, arguments);
      }

      return json;
    }()
  }, {
    key: 'body',
    get: function get() {
      return this.rawBody;
    },
    set: function set(value) {
      this.rawBody = value;
    }
  }]);
  return Body;
}();

METHODS.forEach(function (method) {
  Body.prototype[method] = /*istanbul ignore next*/(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function /*istanbul ignore next*/_callee3() /*istanbul ignore next*/{
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!this.bodyUsed) {
              _context3.next = 2;
              break;
            }

            throw new Error('Body Used');

          case 2:
            this.bodyUsed = true;
            return _context3.abrupt('return', this.body);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
});

module.exports = Body;