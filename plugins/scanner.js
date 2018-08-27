global.faked = require('faked');
const request = require.context('${root}', true, /\.faked\.(js|ts)$/);
request.keys().forEach(function (key) {
  exports[key] = request(key);
});