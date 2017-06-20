const mokit = require('mokit');
const utils = require('ntils');

module.exports = new mokit.Component({
  template: require('./index.html'),

  props: {
    selectedItem: null,
    editItem: null,
    keyword: '',
    list: {
      value: []
    },
    filtratedList() {
      if (!this.keyword) return this.list;
      return this.list.filter(item => {
        return item.name.indexOf(this.keyword) > -1 ||
          item.url.indexOf(this.keyword) > -1 ||
          item.content.indexOf(this.keyword) > -1;
      });
    }
  },

  //编辑一项
  edit(item) {
    if (item && item.type == 'remote') return;
    this.editItem = item;
  },

  //选择一项
  select(item) {
    this.selectedItem = item;
  },

  //添加一项
  add() {
    let id = utils.newGuid().replace(/\-/g, '');
    let item = {
      id: id,
      name: 'Untitled',
      method: 'GET',
      url: `/api/${id}`,
      content: '{}',
      checked: true
    };
    this.list.push(item);
    this.select(item);
    this.edit(item);
  },

  //移除
  remove(item, event) {
    if (event) event.stopPropagation();
    if (!confirm(`确认删除 '${item.name}' 吗?`)) return;
    let index = this.list.findIndex(i => i == item);
    this.list.splice(index, 1);
  }

});