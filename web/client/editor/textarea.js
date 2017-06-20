const mokit = require('mokit');
const CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');

module.exports = new mokit.Component({
  template: '<textarea></textarea>',
  onReady() {
    this.inner = CodeMirror.fromTextArea(this.$element, {
      lineNumbers: true,
      mode: 'javascript',
      tabSize: 2
    });
    this.inner.on('change', () => {
      this.$emit('change', this.getValue());
    });
    this.inner.setOption("extraKeys", {
      'Ctrl-S': function (cm) {
        //alert('不需要保存');
        return false;
      },
      'Cmd-S': function (cm) {
        //alert('不需要保存');
        return false;
      }
    });
  },
  props: {
    value: {
      get() {
        return this.getValue();
      },
      set(val) {
        this.setValue(val);
      }
    }
  },
  getValue() {
    if (!this.inner) return;
    return this.inner.getValue();
  },
  setValue(val) {
    if (!this.inner || this.getValue() == val) return;
    this.inner.setValue(val);
  }
});