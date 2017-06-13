/*istanbul ignore next*/'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = require('ntils');
var faked = require('./faked');
var Request = require('./request');

var jsonp = {
  param: 'callback',
  callback: null
};

document.originCreateElement = document.createElement;

document.createElement = function (tagName) {
  if (!utils.isNull(tagName)) tagName = tagName.toUpperCase();
  var element = document.originCreateElement(tagName);
  if (tagName !== 'SCRIPT') return element;
  //--
  var setAttribute = element.setAttribute;
  element.setAttribute = function (name, value) {
    /*istanbul ignore next*/var _this = this;

    if (name != 'src') {
      return setAttribute.call(this, name, value);
    }
    var request = new Request(value);
    var jsonpName = jsonp.callback || request.query[jsonp.param];
    var jsonpFunc = window[jsonpName];
    /*istanbul ignore next*/(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function /*istanbul ignore next*/_callee() /*istanbul ignore next*/{
      var response, loadEvent;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return faked.handle(request);

            case 2:
              response = _context.sent;

              if (response) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return', setAttribute.call( /*istanbul ignore next*/_this, name, value));

            case 5:
              _context.t0 = jsonpFunc;
              _context.next = 8;
              return response.json();

            case 8:
              _context.t1 = _context.sent;
              (0, _context.t0)(_context.t1);
              loadEvent = document.createEvent("HTMLEvents");

              loadEvent.initEvent("load", false, false);
              element.dispatchEvent(loadEvent);

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  };
  //--
  delete element.src;
  Object.defineProperty(element, 'src', {
    /*istanbul ignore next*/get: function get() {
      return this.getAttribute('src');
    },
    /*istanbul ignore next*/set: function set(value) {
      this.setAttribute('src', value);
    }
  });
  //--
  return element;
};

module.exports = jsonp;