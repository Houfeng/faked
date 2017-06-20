const faked = require('./faked');
const Request = require('./request');

async function fetch(req, opts) {
  let response = await faked.handle(new Request(req, opts));
  if (response) return response;
  return window.originFetch(req, opts);
}

module.exports = fetch;