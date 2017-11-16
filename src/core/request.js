const Headers = require('./headers');
const Body = require('./body');
const utils = require('ntils');
const querystring = require('querystring');

function getOrigin() {
  if (!location.origin)
    location.origin = location.protocol + "//" + location.hostname +
      (location.port ? ':' + location.port : '');
  return location.origin;
}

function removeOrigin(url) {
  if (!url) return url;
  let origin = getOrigin();
  if (url.indexOf(origin) != 0) return url;
  return url.replace(origin, '');
}

function trimUrl(url) {
  return removeOrigin(url);
}

class Request extends Body {

  constructor(url, opts) {
    opts = opts || Object.create(null);
    super(opts.body);
    this.opts = Object.create(null);
    if (!utils.isString(url)) {
      utils.copy(url, this.opts);
    } else {
      this.opts.url = url;
    }
    utils.copy(opts, this.opts);
    this.opts.url = trimUrl(this.opts.url);
    this.url = this.opts.url;
    this.method = this.opts.method || 'GET';
    this.headers = new Headers(this.opts.headers);
    this.context = this.opts.context || window;
    this.referrer = this.opts.referrer || location.href;
    this.mode = this.opts.mode;
    this.credentials = this.opts.credentials;
    this.redirect = this.opts.redirect;
    this.integrity = this.opts.integrity;
    this.cache = this.opts.cache;
  }

  //这是一个扩展属性, 不是标准 API
  get body() {
    let contentType = this.headers.get('Content-Type');
    switch (contentType) {
      case 'application/json':
      case 'text/json':
        return utils.isString(this.rawBody) ?
          JSON.parse(this.rawBody) : this.rawBody;
      case 'application/x-www-form-urlencoded':
        return utils.isString(this.rawBody) ?
          querystring.parse(this.rawBody) : this.rawBody;
      default:
        return this.rawBody;
    }
  }

  set url(url) {
    this._url = url;
    if (!url) return;
    this.query = querystring.parse(url.split('?')[1]);
  }

  get url() {
    return this._url;
  }

  set body(value) {
    this.rawBody = value;
  }

  clone() {
    return new Request(this.url, this.opts);
  }

}

module.exports = Request;