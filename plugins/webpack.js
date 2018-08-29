const utils = require('ntils');
const VModule = require('vmodule-webpack-plugin');
const fs = require('fs');
const path = require('path');
const stp = require('stp');

const scannerFile = path.resolve(__dirname, './scanner.js');
const scannerText = fs.readFileSync(scannerFile).toString('utf8');
const scannerTemplate = stp(scannerText.replace('//${common}', '${common}'));
const scannerCommon = ['global.faked = require("faked")'];

function FakedPlugin(opts) {
  this.opts = Object.assign({
    root: './src', config: './.faked.js'
  }, opts);
}

FakedPlugin.prototype.wrapEntries = function (entries, injectFiles) {
  let wrappedEntries = entries;
  if (utils.isString(wrappedEntries)) wrappedEntries = [wrappedEntries];
  if (utils.isArray(wrappedEntries)) {
    return wrappedEntries.unshift(...injectFiles);
  }
  utils.each(wrappedEntries, (name, entryFiles) => {
    if (!utils.isArray(entryFiles)) entryFiles = [entryFiles];
    entryFiles.unshift(...injectFiles);
    wrappedEntries[name] = entryFiles;
  });
  return wrappedEntries;
};

FakedPlugin.prototype.createScannerParams = function () {
  const params = {}, commonLines = [...scannerCommon], cwd = process.cwd();
  const configFile = path.resolve(cwd, this.opts.config);
  if (fs.existsSync(configFile)) {
    commonLines.push(fs.readFileSync(configFile).toString('utf8'));
  }
  params.common = commonLines.join(';');
  params.root = path.resolve(cwd, this.opts.root);
  return params;
}

FakedPlugin.prototype.apply = function (compiler) {
  if (process.env.NODE_ENV === 'production') return;
  const webpackConf = compiler.options;
  const scannerName = '$faked-files';
  if (!webpackConf.plugins) webpackConf.plugins = [];
  const scannerModule = new VModule({
    name: scannerName,
    type: 'js',
    handler: () => scannerTemplate(this.this.createScannerParams())
  });
  scannerModule.apply(compiler);
  compiler.plugin('entry-option', () => {
    webpackConf.entry = this.wrapEntries(webpackConf.entry, [scannerName]);
  });
};

module.exports = FakedPlugin;