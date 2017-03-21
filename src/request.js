const Headers = require('./headers');
const Body = require('./body');
const utils = require('ntils');

class Request extends Body {
  constructor(url, opts) {
    opts = opts || {};
    super(opts.body);
    this.opts = {};
    if (!utils.isString(url)) {
      utils.copy(url, this.opts);
    } else {
      this.opts.url = url;
    }
    utils.copy(opts, this.opts);
    this.url = this.opts.url;
    this.method = this.opts.method || 'GET';
    this.headers = new Headers(this.opts.headers);
    this.context = this.opts.context;
    this.referrer = this.opts.referrer;
    this.mode = this.opts.mode;
    this.credentials = this.opts.credentials;
    this.redirect = this.opts.redirect;
    this.integrity = this.opts.integrity;
    this.cache = this.opts.cache;
  }
  clone() {
    return new Request(this.url, this.opts);
  }
}

module.exports = Request;