const utils = require('ntils');
const faked = require('./faked');
const Request = require('./request');

const jsonp = { param: 'callback', callback: null };

document.originCreateElement = document.createElement;

document.createElement = function (tagName) {
  if (!utils.isNull(tagName)) tagName = tagName.toUpperCase();
  const element = document.originCreateElement(tagName);
  if (tagName !== 'SCRIPT') return element;
  //--
  const setAttribute = element.setAttribute;
  element.setAttribute = function (name, value) {
    if (name != 'src') {
      return setAttribute.call(this, name, value);
    }
    const request = new Request(value);
    const jsonpName = jsonp.callback || request.query[jsonp.param];
    const jsonpFunc = window[jsonpName];
    (async () => {
      const response = await faked.handle(request);
      if (!response) {
        return setAttribute.call(this, name, value);
      }
      jsonpFunc(await response.json());
      const loadEvent = document.createEvent('HTMLEvents');
      loadEvent.initEvent('load', false, false);
      element.dispatchEvent(loadEvent);
    })();
  };
  //--
  delete element.src;
  Object.defineProperty(element, 'src', {
    get() {
      return this.getAttribute('src');
    },
    set(value) {
      this.setAttribute('src', value);
    }
  });
  //--
  return element;
};

module.exports = jsonp;
