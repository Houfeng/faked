const pkg = require('./package.json');

module.exports = function (webpackConfig) {
  webpackConfig.output.library = pkg.name;
  webpackConfig.output.libraryTarget = 'umd';
  webpackConfig.output.umdNamedDefine = true;
};