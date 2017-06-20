const Headers = require('./headers');
const Body = require('./body');
const status = require('./status');
const utils = require('ntils');

//response 一定要保持和标准 API 一致
class Response extends Body {
  constructor(body, opts) {
    super(body);
    this.opts = opts || Object.create(null);
    this.type = this.opts.type;
    this.url = this.opts.url;
    this.useFinalURL = this.opts.useFinalURL;
    this.status = this.opts.status;
    this.headers = new Headers(this.opts.headers);
    this.headers.set('status', this.status);
    this.headers.set('Date', new Date().toString());
    this.headers.set('X-Powered-By', 'Faked');
    this.headers.set('Cache-Control', 'max-age=0');
  }

  get ok() {
    return this.status >= 200 && this.status < 299;
  }

  get statusText() {
    return status[this.status];
  }

  clone() {
    return new Response(this.body, this.opts);
  }

  error() {
    let opts = utils.clone(opts);
    opts.status = 500;
    return new Response(this.body, this.opts);
  }

  redirect() {
    throw new Error('Faked does not support redirect');
  }
}

module.exports = Response;