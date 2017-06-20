const faked = require('./core/faked');

if (typeof window == 'undefined') {
  module.exports = faked;
} else if (window.faked) {
  module.exports = window.faked;
} else {
  faked.Headers = require('./core/headers'); 
  faked.Request = require('./core/request');
  faked.Response = require('./core/response');
  faked.XMLHttpRequest = require('./core/xhr');
  faked.fetch = require('./core/fetch');
  faked.jsonp = require('./core/jsonp');

  window.OriginHeaders = window.OriginHeaders || window.Headers;
  window.OriginRequest = window.OriginRequest || window.Request;
  window.OriginResponse = window.OriginResponse || window.Response;
  window.originFetch = window.originFetch || window.fetch;
  window.OriginXMLHttpRequest = window.OriginXMLHttpRequest || window.XMLHttpRequest;

  window.Headers = faked.Headers;
  window.Request = faked.Request;
  window.Response = faked.Response;
  window.fetch = faked.fetch;
  window.XMLHttpRequest = faked.XMLHttpRequest;

  module.exports = window.faked = faked;
}