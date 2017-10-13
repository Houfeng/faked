![logo](./docs/faked.png)

## 1. 简介
faked 是一个在前端开发中用于 mock 服务端接口的模块，轻量简单，无需要在本地启动 Server 也无需其它更多的资源，仅在浏览器中完成「请求拉截」，配合完整的「路由系统」轻而易举的 mock 后端 API。


## 2. 安装 faked

有两种可选安装方式，你可以通过传统的 `sciprt` 方式引入 faked，如果你采用了 CommonJs 或 ES6 Modules 模块方案，也可通过安装 NPM Pageage 的方式安装依赖。

通过 script 引入：
```html
<script src="your-path/faked.min.js"></script>
```

通过 npm 安装：
```sh
$ npm i faked --save-dev
```

CommonJs 方式引用
```js
const faked = require('faked');
```

ES6 Modules 方式引用
```js
import * as faked from 'faked'
```


## 3. 使用 Faked

### 3.1 基本用法

通过 `faked.when` 方法你几乎就可以使用 faked 的所有功能了，尽管 faked 还提供了一组「快捷方法」，`faked.when` 方法说明如下：
```js
//指定单一 Http Method
faked.when(<method>, <pattern>, <handler>);

//指定多个 Http Method
faked.when(<methods>, <pattern>, <handler>);
```

示例，模拟一个获取用户信息的接口，参考如下代码：
```js
faked.when('get','/user/{id}', function(){
  this.send({name:'Bob'});
});
```

每一个 `handler` 的 `this` 就是当前请求上下文对象，对象有如下主要成员:
- `this.send(data, status, headers)` 方法，用于响应一个请求，status 默认为 200
- `this.params` 路由参数对象，用于访问路由模式中的「路由参数」，如上边示例中的 id
- `this.query` 解析查询字符串对应的对象，比如 `?name=bob` 可以通过 `this.query.name` 访问
- `this.body` 请求的主体内容，通常会是一个 `json` 对象，它取决于发起的请求。

除了使用 `send` 方法，还可以直接「返回」数据，参考如下代码：
```js
faked.when('get','/user/{id}', function(){
  return {name:'Bob'};
});
```
当然，在有「异步处理」时你也可以返回一个 `promise` 对象或像上边那样用 `send` 方法。如果你只想 mock 数据，还可以使用简化写法，参考如下代码：
```js
faked.when('get','/user/{id}', {name:'bob'});
```

### 3.2 快捷方法
faked 还基于 when 方法提供了一组快捷方法，对应常用的 Http Methods，包括：

```
get, post, put, delete, options, patch, head, copy, link, unlink, lock, unlock, view
```

用 `faked.get` 写一个示例：

```js
faked.get('/user/{id}',function(){
  this.send({name:'Bob'});
});
```
其它快捷方法和 `faked.get` 用法完全一致。

### 3.3 路由系统
在编辑 Mock API 时， faked 提供了路由支持，如上边看到的 `/user/{id}`，就是一个路由「匹配模式」，其中 `{id}` 是一个路由参数，当多个路由同时匹配请求的 URL 时，只会触发第一个执行，不同的 `Http Method` 的 URL 匹配模式可以相同，并不会冲突。路由参数还可以加「限定表达式」，参考如下代码：

```js
// User Id 只能是数字
faked.get('/user/{id:\d+}', {name:'test'});
```

### 3.4 模拟网络延时

有时候，我们希望 Mock API 能延时响应数据，以模拟「网络延时」，faked 目前支持固定的「延时设置」，参考如下代码：

```js
const faked = require('faked');

//所有的请求都将被延时 2 秒种再响应用 mock 数据
faked.delay = 2000; 
```
当 delay 设置 0 时，将禁用延时。


### 3.5 设置超时时间

faked 还可设置 Mock API 的最大响应时间，这项设置存在的意义还在于「所有 Mock API 的 Handler 默认都是异步的，如果忘记「返回或 Send」一个响应结果，请求将会被一直挂起，有了超时设置，超时时将会抛出一个错误，方便定位问题」，参考如下代码：

```js
const faked = require('faked');

//在超过 8 秒未响应数据时，将会打印一个错误消息
faked.timeout = 8000; 
```

超时设置和延时设置并不会相互影响，超时计算是从延时结束后开始的。

### 3.6 JSONP 处理

faked 除了能 mock 常规的 `ajax` 和 `fetch` 请求，还能 mock 常常用来处理跨域问题的 `jsonp` 请求，faked 有两个参数用于配置 jsonp，参考如下代码：

```js
//指定服务端用于获取「回调函数名」的 「QueryString 参数」
faked.jsonp.param = 'callback'; //默认值为 callback 和 jQuery 一致

//有些 jsonp 服务可能是固定了「回调函数名」，可以这样设定
faked.jsonp.callback = 'your-callbak-name'; 
```


## 4. 在项目中使用

### 4.1 注意事项
faked 是一个「辅助开发」的工具，除非有特殊需要，一般情况下它不应出现在你的生产代码中，所以需要注意：

1. 请勿将 faked 放到「生产环境」的应用或页面中  
2. 找一个合适的你项目的方式决定什么时引用 faked 




### 4.2. 使用示例

  
比如，在 `webpack` 中，可以根据环境变量决定入口文件，并只在 `mock` 的入口文件中引用 faked，示例:

webpack.config.js
```js
const NODE_ENV = process.env.NODE_ENV;

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

然后，在 `index.mock.js` 中这样写：
```js
require('./mock')
require('./index');
```

用于存放的 `mock` 代码的 `mock.js` 可能是这样的：
```js
const faked = require('faked');

faked.get('/user/{id}',function(){
  this.send({name:'Bob'});
});
```

根据实际情况，安排你的文或目录结构，使用其它的工具诸如 gulp/browserify 等，都可以有类似的处理。


### 4.3 使用 Webpack 的插件

上边提到的使用方式可能稍显床烦，针对基于 webpack 进行构建的工程，faked 提供了一个插件，这是使用 faked 最简单的方式，只需要做一件事，在安装 faked 之后，修改 webpack.config.js，如下:

```js
const fakedPlugin = require('faked/plugins/webpack');
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  entry: fakedPlugin.entry({
    bundlue: './src/index.js'
  },{
    disabled: NODE_ENV=='prod', //是否禁用 faked 
    port: 5002,                 //GUI 使用的端口，可以省略，将自动先一个可用端口
    dir: 'faked'                // mock 文件存放目录，可以省略，默认为 faked
  })
  ...
};
```

然后，像之前一样，开发或构建你的工程好就行了，比如：
```
NODE_ENV=mock webpack --watch
```

此时，会在终端中看到如下日志
```sh
faked: 检查依赖...
faked: 加载文件...
faked: 启动 GUI...
faked: http://127.0.0.1:5002/
faked: 准备就绪
```

在浏览器中访问 http://127.0.0.1:5002/ ，将会看到 faked 的图形配置界面，如下：

![gui](./docs/gui.png)


可以在 GUI 界面中完成相关 mock 配置，在 GUI 一样能进行简单的数据或逻辑的 mock。

## 开发与构建

faked 使用 Dawn 进行开发与构建

安装 dawn
```sh
npm i dawn -g
```

开发与构建
```sh
# 克隆代码
git clone <git-repo> <your-path>

# 开发
dn dev

#构建
dn build
```
-- END --
