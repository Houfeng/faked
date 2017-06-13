/*istanbul ignore next*/'use strict';

var faked = require('./faked');
faked.Headers = require('./headers');
faked.Request = require('./request');
faked.Response = require('./response');
faked.XMLHttpRequest = require('./xhr');
faked.fetch = require('./fetch');
faked.jsonp = require('./jsonp');

if (!window.faked) {
  window.OriginHeaders = window.Headers;
  window.OriginRequest = window.Request;
  window.OriginResponse = window.Response;
  window.originFetch = window.fetch;
  window.OriginXMLHttpRequest = window.XMLHttpRequest;

  window.Headers = faked.Headers;
  window.Request = faked.Request;
  window.Response = faked.Response;
  window.fetch = faked.fetch;
  window.XMLHttpRequest = faked.XMLHttpRequest;

  module.exports = window.faked = faked;
} else {
  module.exports = window.faked;
}