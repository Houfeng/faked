const fs = require('fs');
const utils = require('ntils');
const writeFile = require('../common/writefile');
const readFile = require('../common/readfile');

/**
 * 定义 ApiController
 **/
const ApiController = nokit.define({

  /**
   * 保存配置
   **/
  save: async function () {
    let filename = `${this.server.configs.store}/gui.data.json`;
    let list = this.context.request.body;
    list.forEach(item => {
      try {
        item.content = JSON.parse(item.content);
      } catch (err) { }
    });
    await writeFile(filename, JSON.stringify(list, null, '  '));
    this.context.send({ success: true });
  },

  /**
   * 读取配置
   */
  read: async function () {
    let filename = `${this.server.configs.store}/gui.data.json`;
    if (!fs.existsSync(filename)) return this.context.send([]);
    let buffer = await readFile(filename);
    let list = JSON.parse(buffer.toString());
    list.forEach(item => {
      if (utils.isString(item.content)) return;
      item.content = JSON.stringify(item.content, null, '  ');
    });
    this.context.send(list);
  }

});

module.exports = ApiController;