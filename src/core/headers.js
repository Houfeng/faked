const utils = require('ntils');

class HeaderItem {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class Headers {
  constructor(headers) {
    headers = headers || Object.create(null);
    if (headers.toMap) headers = headers.toMap();
    this._list = [];
    utils.each(headers, (name, value) => {
      this.append(name, value);
    });
  }

  append(name, value) {
    this._list.push(new HeaderItem(name, value));
  }

  delete(name) {
    this._list = this._list.filter(item => item.name !== name);
  }

  set(name, value) {
    this.delete(name);
    this.append(name, value);
  }

  has(name) {
    !!this.find(item => item.name === name);
  }

  get(name) {
    let item = this._list.find(item => item.name === name);
    if (!item) return;
    return item.value;
  }

  getAll(name) {
    if (!name) return this._list;
    let items = this._list.filter(item => item.name === name);
    return items.map(item => item.value);
  }

  keys() {
    return this._list.map(item => item.name);
  }

  values() {
    return this._list.map(item => item.value);
  }

  *entries() {
    for (let item of this._list) {
      yield [item.name, item.value];
    }
  }

  toMap() {
    let map = Object.create(null);
    this._list.forEach(item => {
      map[item.name] = item.value;
    });
    return map;
  }
}

module.exports = Headers;