const faked = require('./faked');
const utils = require('ntils');
const Request = require('./request');
const Headers = require('./headers');
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
    this.withCredentials = false;
    this.timeout = 0;
    delete this.readyState;
    this.readyState = 0;
    this._req = new Request();
    this.sendAsBinary = this.send;
    this.openRequest = this.open;
  }

  _changeReadyState(state) {
    this.readyState = state;
    let event = {};
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
    faked.log('XHR Abort');
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

  open(method, url, isAsync, user, password) {
    this._openArgs = arguments;
    this._req = new Request(this._req, {
      url,
      method
    });
    this._isAsync = isAsync;
    this._changeReadyState(READY_STATES.OPENED);
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
    this._changeReadyState(READY_STATES.HEADERS_RECEIVED);
    this._res = await faked.handle(this._req);
    if (!this._res) {
      return this._originSend(data);
    }
    if (this._isAsync === false) {
      faked.log('Unable to synchronize request and has been replaced with an asynchronous request');
    }
    if (this._mime) {
      this._res.headers.set('Content-Type', this._mime);
    }
    this._changeReadyState(READY_STATES.LOADING);
    this._changeReadyState(READY_STATES.DONE);
  }

  _originSend(data) {
    this._originXhr = new OriginXMLHttpRequest();
    this._originXhr.withCredentials = this.withCredentials;
    this._originXhr.timeout = this.timeout;
    this._originXhr.open(...this._openArgs);
    this._originXhr.onload = this.onload;
    this._originXhr.onreadystatechange = this.onreadystatechange;
    this._originXhr.addEventListener('load', event => {
      this.emit('load', event);
    });
    return this._originXhr.send(data);
  }

  setRequestHeader(name, value) {
    if (this._originXhr) {
      return this._originXhr.setRequestHeader(name, value);
    }
    this._req.headers.set(name, value);
  }

  get responseType() {
    if (this._originXhr) {
      return this._originXhr.responseType;
    }
    return '';
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
    return null; //TODO: parse XML
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
    return this._res.body;
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
}

module.exports = XMLHttpRequest;