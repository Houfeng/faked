const utils = require('ntils');

const METHODS = ['arrayBuffer', 'blob', 'formData'];

class Body {

  constructor(rawBody) {
    this.bodyUsed = false;
    this.rawBody = utils.clone(rawBody);
  }

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