const faked = require('./faked');
const Request = require('./request');
const Headers = require('./headers');

async function fetch(req, opts) {
  const response = await faked.handle(new Request(req, opts));
  if (response) return response;
  if (opts.headers && opts.headers instanceof Headers) {
    opts = {
      ...opts,
      headers: opts.headers.toMap()
    };
  }
  return window.originFetch(req, opts);
}

module.exports = fetch;
