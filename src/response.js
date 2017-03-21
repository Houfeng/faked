const Headers = require('./headers');
const Body = require('./body');
const status = require('./status');

class Response extends Body {
  constructor(body, opts) {
    super(body);
    this.opts = opts || {};
    this.type = this.opts.type;
    this.url = this.opts.url;
    this.useFinalURL = this.opts.useFinalURL;
    this.status = this.opts.status;
    this.headers = new Headers(this.opts.headers);
    this.headers.set('Date', new Date().toString());
    this.headers.set('X-Powered-By', 'Faked');
    this.headers.set('Cache-Control', 'max-age=0');
  }
  get ok() {
    return this.status >= 200 && this.status < 299;
  }
  get statusText() {
    return status[this.status]
  }
  clone() {
    return new Response(this.body, this.opts);
  }
  error() {
    let res = new Response(this.body, this.opts);
    res.status = 500;
    return res;
  }
  redirect() {
    throw new Error('Faked does not support redirect');
  }
}

module.exports = Response;