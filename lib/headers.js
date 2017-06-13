/*istanbul ignore next*/'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = require('ntils');

/*istanbul ignore next*/var HeaderItem = function /*istanbul ignore next*/HeaderItem(name, value) {
  /*istanbul ignore next*/(0, _classCallCheck3.default)(this, HeaderItem);

  this.name = name;
  this.value = value;
};

/*istanbul ignore next*/var Headers = function () {
  function /*istanbul ignore next*/Headers(headers) {
    /*istanbul ignore next*/var _this = this;

    (0, _classCallCheck3.default)(this, Headers);

    headers = headers || {};
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    this._list = [];
    utils.each(headers, function (name, value) {
      /*istanbul ignore next*/_this.append(name, value);
    });
  }

  (0, _createClass3.default)(Headers, [{
    key: 'append',
    value: function append(name, value) {
      this._list.push(new HeaderItem(name, value));
    }
  }, {
    key: 'delete',
    value: function _delete(name) {
      this._list = this._list.filter(function (item) /*istanbul ignore next*/{
        return item.name !== name;
      });
    }
  }, {
    key: 'set',
    value: function set(name, value) {
      this.delete(name);
      this.append(name, value);
    }
  }, {
    key: 'has',
    value: function has(name) {
      !!this.find(function (item) /*istanbul ignore next*/{
        return item.name === name;
      });
    }
  }, {
    key: 'get',
    value: function get(name) {
      var item = this._list.find(function (item) /*istanbul ignore next*/{
        return item.name === name;
      });
      if (!item) return;
      return item.value;
    }
  }, {
    key: 'getAll',
    value: function getAll(name) {
      if (!name) return this._list;
      var items = this._list.filter(function (item) /*istanbul ignore next*/{
        return item.name === name;
      });
      return items.map(function (item) /*istanbul ignore next*/{
        return item.value;
      });
    }
  }, {
    key: 'keys',
    value: function keys() {
      return this._list.map(function (item) /*istanbul ignore next*/{
        return item.name;
      });
    }
  }, {
    key: 'values',
    value: function values() {
      return this._list.map(function (item) /*istanbul ignore next*/{
        return item.value;
      });
    }
  }, {
    key: 'entries',
    value: _regenerator2.default.mark(function entries() {
      var item;
      return _regenerator2.default.wrap(function entries$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = _regenerator2.default.keys(this._list);

            case 1:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 7;
                break;
              }

              item = _context.t1.value;
              _context.next = 5;
              return [item.name, item.value];

            case 5:
              _context.next = 1;
              break;

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, entries, this);
    })
  }]);
  return Headers;
}();

module.exports = Headers;