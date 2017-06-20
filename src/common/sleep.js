module.exports = function (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};