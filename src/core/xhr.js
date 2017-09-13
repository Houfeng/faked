const faked = require('./faked');
const utils = require('ntils');
const Request = require('./request');
const querystring = require('querystring');
const EventEmitter = require('events');

const READY_STATES = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};

class XMLHttpRequest extends EventEmitter {

  constructor(...args) {
    super(...args);
    utils.copy(READY_STATES, this);
    this._req = new Request();
    this.sendAsBinary = this.send;
    this.openRequest = this.open;
  }

  _changeReadyState(state) {
    this.readyState = state;
    let event = Object.create(null);
    if (this.onreadystatechange) {
      this.onreadystatechange(event);
    }
    if (this.readyState === 4) {
      if (this.onload) this.onload(event);
      this.emit('load', event);
    }
  }

  abort() {
    if (this._originXhr) {
      return this._originXhr.abort();
    }
    faked.warn('XHR Abort');
  }

  getAllResponseHeaders() {
    if (this._originXhr) {
      return this._originXhr.getAllResponseHeaders(name);
    }
    if (!this._res) return;
    return this._res.headers.getAll().map(header => {
      return `${header.name}:${header.value}`;
    }).join('\r\n');
  }

  getResponseHeader(name) {
    if (this._originXhr) {
      return this._originXhr.getResponseHeader(name);
    }
    if (!this._res) return;
    return this._res.headers.get(name);
  }

  open(method, url, isAsync, user, password) { //eslint-disable-line
    this._openArgs = arguments;
    this._req = new Request(this._req, {
      url,
      method
    });
    this._isAsync = isAsync;
  }

  overrideMimeType(mime) {
    if (this._originXhr) {
      return this._originXhr.overrideMimeType(mime);
    }
    this._mime = mime;
  }

  async send(data) {
    let contentType = this._req.headers.get('Content-Type');
    if (contentType == 'application/x-www-form-urlencoded') {
      this._req.body = querystring.parse(data);
    } else {
      this._req.body = data;
    }
    this._res = await faked.handle(this._req);
    if (!this._res) {
      return this._originSend(data);
    }
    this._changeReadyState(READY_STATES.OPENED);
    this._changeReadyState(READY_STATES.HEADERS_RECEIVED);
    if (this._isAsync === false) {
      faked.warn('Unable to synchronize request and has been replaced with an asynchronous request');
    }
    if (this._mime) {
      this._res.headers.set('Content-Type', this._mime);
    }
    this._changeReadyState(READY_STATES.LOADING);
    this._changeReadyState(READY_STATES.DONE);
  }

  _originSend(data) {
    this._originXhr = new OriginXMLHttpRequest(); //eslint-disable-line
    this._originXhr.withCredentials = this.withCredentials;
    this._originXhr.timeout = this.timeout;
    this._originXhr.onload = this.onload;
    this._originXhr.onreadystatechange = this.onreadystatechange;
    this._originXhr.addEventListener('load', event => {
      this.emit('load', event);
    });
    this._originXhr.open(...this._openArgs);
    for (let entry of this._req.headers.entries()) {
      if (typeof entry[0] === 'string') {
        this.setRequestHeader(entry[0], entry[1]);
      }
    }
    return this._originXhr.send(data);
  }

  setRequestHeader(name, value) {
    if (this._originXhr) {
      this._originXhr.setRequestHeader(name, value);
    }
    this._req.headers.set(name, value);
  }

  get responseType() {
    if (this._originXhr) {
      return this._originXhr.responseType;
    }
    return this._responseType;
  }

  set responseType(value) {
    if (this._originXhr) {
      this._originXhr.responseType = value;
    }
    this._responseType = value;
  }

  get responseURL() {
    if (this._originXhr) {
      return this._originXhr.responseURL;
    }
    if (!this._res) return;
    return this._req.url;
  }

  get responseText() {
    if (this._originXhr) {
      return this._originXhr.responseText;
    }
    if (utils.isString(this.response)) return this.response;
    return JSON.stringify(this.response);
  }

  get responseXML() {
    if (this._originXhr) {
      return this._originXhr.responseXML;
    }
    if (utils.isString(this.response)) return this.response;
    return JSON.stringify(this.response);
  }

  get responseJSON() {
    if (this._originXhr) {
      return this._originXhr.responseJSON;
    }
    return JSON.parse(this.responseText);
  }

  get response() {
    if (this._originXhr) {
      return this._originXhr.response;
    }
    if (!this._res) return;
    if (!this.responseType || this.responseType == 'text') {
      return this._res.bodyText;
    } else if (this.responseType == 'blob' &&
      Object.prototype.toString.call(this._res.body) != '[object Blob]') {
      return new Blob([this._res.bodyText]);
    } else {
      return this._res.body;
    }
  }

  get status() {
    if (this._originXhr) {
      return this._originXhr.status;
    }
    if (!this._res) return;
    return this._res.status;
  }

  get statusText() {
    if (this._originXhr) {
      return this._originXhr.statusText;
    }
    if (!this._res) return;
    return this._res.statusText;
  }

  get withCredentials() {
    if (this._originXhr) {
      return this._originXhr.withCredentials;
    }
    return this._withCredentials || 0;
  }

  set withCredentials(value) {
    if (this._originXhr) {
      this._originXhr.withCredentials = value;
    }
    this._withCredentials = value;
  }

  get timeout() {
    if (this._originXhr) {
      return this._originXhr.timeout;
    }
    return this._timeout || 0;
  }

  set timeout(value) {
    if (this._originXhr) {
      this._originXhr.timeout = value;
    }
    this._timeout = value;
  }

  get readyState() {
    if (this._originXhr) {
      return this._originXhr.readyState;
    }
    return this._readyState || 0;
  }

  set readyState(value) {
    if (this._originXhr) {
      this._originXhr.readyState = value;
    }
    this._readyState = value;
  }

}

utils.copy(READY_STATES, XMLHttpRequest);

module.exports = XMLHttpRequest;
