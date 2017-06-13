/*istanbul ignore next*/'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var fetch = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function /*istanbul ignore next*/_callee(req, opts) /*istanbul ignore next*/{
    var response;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return faked.handle(new Request(req, opts));

          case 2:
            response = _context.sent;

            if (!response) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', response);

          case 5:
            return _context.abrupt('return', window.originFetch(req, opts));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetch(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/*istanbul ignore next*/function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var faked = require('./faked');
var utils = require('ntils');
var Request = require('./request');

module.exports = fetch;