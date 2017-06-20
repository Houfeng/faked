const mokit = require('mokit');
const os = require('os');
const textarea = require('./textarea');

module.exports = new mokit.Component({
  template: require('./index.html'),
  components: { textarea },
  props: {
    item: { value: {} },
  },
  textareaChanged(content) {
    this.item.content = content;
  }
});