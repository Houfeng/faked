const mokit = require('mokit');
const utils = require('ntils');
const Side = require('./side');
const Editor = require('./editor');
const service = require('./common/service');
const key = require('keymaster');

require('bootstrap/dist/css/bootstrap.min.css');
require('font-awesome/css/font-awesome.min.css');
require('./assets/common.css');

const DEFAULT_ITEM = { url: '', method: '', content: '' };

key.filter = function () {
  return true;
};
key('ctrl+s,⌘+s', function () { 
  return false;
});

//context
mokit({
  element: document.querySelector('.app'),
  components: { Side, Editor },
  data() {
    return {
      list: [],
      selectedItem: DEFAULT_ITEM,
      editItem: DEFAULT_ITEM
    };
  },
  async onReady() {
    this.list = (await service.read()) || [];
    this.selectedItem = this.list[0] || DEFAULT_ITEM;
    this.$watch('list', data => {
      service.save(data);
    });
  }
}).start();