const utils = require('ntils');

const METHODS = ['arrayBuffer', 'blob', 'formData', 'json'];

class Body {
  constructor(body) {
    this.bodyUsed = false;
    this.body = utils.clone(body);
  }
  async text() {
    if (utils.isString(this.body)) {
      return JSON.stringify(this.body);
    }
    return JSON.stringify(this.body);
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