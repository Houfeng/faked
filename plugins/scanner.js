global.faked = require("faked");
//${preferred}
const request = require.context('${root}', true, /\.faked\.(js|ts)$/);
request.keys().forEach(key => exports[key] = request(key));