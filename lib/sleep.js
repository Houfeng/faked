/*istanbul ignore next*/"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * sleep 函数，用于等待指定的时间后继续执行
 * 示例: await sleep(1000);
 * @param {int} ms 延迟的毫秒数
 * @returns {promise} promise 对象
 */
module.exports = function (ms) {
  return new /*istanbul ignore next*/_promise2.default(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms || 0);
  });
};