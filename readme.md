## 一、简介
faked 是一个在前端开发中用于模拟服务端接口的模块。

## 二、安装 faked

1. 通过 script 引入
```html
<script src="your-path/faked.min.js"></script>
```

2. 通过 npm 安装
```sh
$ npm i faked --save-dev
```

## 三、使用方法

`faked.when` 方法，通过 `faked.when` 方法你几乎就可以使用 faked 的所有功能，尽管 faked 还提供了一些简便的别名方法。
```js
//Usage
//1. faked.when(<method>,<pattern>,<handler>,[options])
//2. faked.when(<methods>,<pattern>,<handler>,[options])

//示例，模拟一个获取用户信息的接口
faked.when('get','/user/{id}',function(){
  this.send({id:this.params.id,name:'Bob'});
});

```
每一个 handler 的 this 就是当前请求上下文对象，对象有如下成员:
- `this.send(data, status, headers)` 方法，用于响应一个请求，status 默认为 200
- `this.params` 路由参数对象，用于访问路由模式中的「具名参数」，如上边示你中的 id
- `this.query` 解析查询字符串对应的对象，比如 `?name=bob` 可以通过 `this.params.name` 访问
- `this.body` 请求的主体内容，通常会是一个 `json` 对象，它取决于发起的请求。

其它方法，faked 还基于 when 方法提供了一组便捷方法，包括
`get,post,put,delete,options,patch ...` 等常用的 Http Methods

用 `faked.get` 写一个示例：

```js
faked.get('/user/{id}',function(){
  this.send({id:this.params.id,name:'Bob'});
});
```
其它方法和 `faked.get` 用法一致。

## 四、小提示

> 请勿将 faked 放到「生产环境」的应用或页面中  
> 开发过程中可用自动化的服本处理什么时候包含 faked 什么时候不包含 faked

比如，在 `webpak` 中，可以根据环境变量决定入口文件，并只在 `mock` 的入口文件中引用 faked，示例:

webpack.config.js
```js
module.exports = {
  entry: {
    //根据 NODE_ENV 决定是 index.js 还是 index.mock.js
    bundle: `./src/index${NODE_ENV=='mock'?'.mock':''}.js`
  },
  output: {
    path: './dist/',
    filename: `./[name]${NODE_ENV == 'prod'?'.min':''}.js`
  },
  devtool: 'source-map',
  module: {
    loaders: [...]
  },
  plugins: [...]
};
```

然后，在 `index.mock.js` 中这样写
```js
require('./mock')
require('./index');
```

用于存放的 `mock` 代码 `mock.js` 是这样的
```js
const faked = require('faked');

faked.get('/user/{id}',function(){
  this.send({id:this.params.id,name:'Bob'});
});
```