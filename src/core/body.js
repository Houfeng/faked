const utils = require('ntils');

const METHODS = ['arrayBuffer', 'blob', 'formData'];

class Body {

  constructor(rawBody) {
    this.bodyUsed = false;
    this.rawBody = utils.clone(rawBody);
    this.bodyText = utils.isString(this.rawBody) ?
      this.rawBody :
      JSON.stringify(this.rawBody);
  }

  // body 属性不是标准 api 的一部分，只为方便使用
  get body() {
    return this.rawBody;
  }

  set body(value) {
    this.rawBody = value;
  }

  async text() {
    if (this.bodyUsed) throw new Error('Body Used');
    if (utils.isString(this.body)) {
      return this.body;
    }
    return JSON.stringify(this.body);
  }

  async json() {
    if (this.bodyUsed) throw new Error('Body Used');
    if (utils.isString(this.body)) {
      return JSON.parse(this.body);
    }
    return this.body;
  }
}

METHODS.forEach(method => {
  Body.prototype[method] = async function () {
    if (this.bodyUsed) throw new Error('Body Used');
    this.bodyUsed = true;
    return this.body;
  };
});

module.exports = Body;