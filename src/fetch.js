const faked = require('./faked');
const utils = require('ntils');
const Request = require('./request');

async function fetch(req, opts) {
  opts = opts || {};
  opts['content-type'] = 'application/json';
  let response = await faked.handle(new Request(req, opts));
  if (response) return response;
  return window.originFetch(req, opts);
}

module.exports = fetch;