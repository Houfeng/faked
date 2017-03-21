const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const os = require('os');
const pkg = require('./package');

const ENV = process.env.NODE_ENV || 'prod';
console.log(`${os.EOL}NODE_ENV:`, ENV);

// const cssBundlePlugin = new ExtractTextPlugin("css/bundle.css");

// const htmlPlugin = new HtmlWebpackPlugin({
//   title: 'template',
//   filename: 'index.html',
//   template: './src/assets/index.html',
// });

const cleanPlugin = new CleanWebpackPlugin(['build/dist'], {
  verbose: false
});

const compressPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
});

// webpack plugins
const plugins = [];
if (ENV === 'prod') plugins.push(compressPlugin);

// webpack loaders
const loaders = [{
  test: /\.js$/,
  loader: "babel",
  exclude: [/node_modules/, /\.test\.js$/]
}, {
  test: /general-router/,
  loader: "babel",
}, {
  test: /\.json$/,
  loader: "json",
}];

// webpack configs
module.exports = {
  entry: {
    [pkg.name]: `./src/index.js`
  },
  output: {
    path: './build/dist/',
    filename: `./[name]${ENV === 'prod'?'.min':''}.js`
  },
  devtool: 'source-map',
  module: {
    loaders: loaders
  },
  plugins: plugins
};