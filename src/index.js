window.OriginHeaders = window.Headers;
window.OriginRequest = window.Request;
window.OriginResponse = window.Response;
window.originFetch = window.fetch;
window.OriginXMLHttpRequest = window.XMLHttpRequest;

window.Headers = require('./headers');
window.Request = require('./request');
window.Response = require('./response');
window.fetch = require('./fetch');
window.XMLHttpRequest = require('./xhr');

const faked = require('./faked');
const jsonp = require('./jsonp');

faked.jsonp = jsonp;

module.exports = window.faked = faked;