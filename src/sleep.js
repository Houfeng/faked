/**
 * sleep 函数，用于等待指定的时间后继续执行
 * 示例: await sleep(1000);
 * @param {int} ms 延迟的毫秒数
 * @returns {promise} promise 对象
 */
module.exports = function (ms) {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, ms || 0);
  });
};