const path = require('path');
const utils = require('ntils');
const fs = require('fs');
const gui = require('../web');

//加载要注入的文件
function loadInjectFiles(opts) {
  let injectFiles = [path.resolve(__dirname, '../'), opts.dir];
  return injectFiles;
}

//复制 gui 所需的文件
function createFiles(opts) {
  if (!fs.existsSync(opts.dir)) fs.mkdirSync(opts.dir);
  let copyFils = ['index.js', 'gui.data.json'];
  copyFils.forEach(file => {
    let srcFile = path.resolve(__dirname, `../faked/${file}`);
    let dstFile = `${opts.dir}/${file}`;
    if (srcFile == dstFile) return;
    if (fs.existsSync(dstFile)) return;
    let buffer = fs.readFileSync(srcFile);
    fs.writeFileSync(dstFile, buffer);
  });
}

//处理入口文件
function wrapEntries(entries, injectFiles) {
  let wrappedEntries = entries;
  if (utils.isString(wrappedEntries)) {
    wrappedEntries = [wrappedEntries];
  }
  if (utils.isArray(wrappedEntries)) {
    return wrappedEntries.unshift(...injectFiles);
  }
  utils.each(wrappedEntries, (name, entryFiles) => {
    if (!utils.isArray(entryFiles)) entryFiles = [entryFiles];
    entryFiles.unshift(...injectFiles);
    wrappedEntries[name] = entryFiles;
  });
  return wrappedEntries;
}

//启动 gui
function startGui(opts) {
  let server = gui({
    port: opts.port,
    store: opts.dir
  });
  server.start((err, info) => {
    if (err) return opts.console.error(err);
    server.url = `http://127.0.0.1:${opts.port}/`;
    opts.console.warn('faked:', server.url);
    opts.console.info('faked:', '准备就绪');
    if (opts.done) opts.done(server);
  });
}

//处理参数
function handleOpts(opts) {
  opts = opts || Object.create(null);
  opts.port = opts.port || 5002;
  opts.console = opts.console || console;
  opts.cwd = opts.cwd || process.cwd();
  opts.dir = path.resolve(opts.cwd, opts.dir || 'faked');
  return opts;
}

//定义入口
function entries(entries, opts) {
  opts = handleOpts(opts);
  //检查是否禁用
  if (opts.disabled) return entries;
  //检查并创建依赖的文件
  opts.console.info('faked:', '检查依赖...');
  createFiles(opts);
  //处理入口文件，实现加载 mock 文件
  opts.console.info('faked:', '加载文件...');
  let injectFiles = loadInjectFiles(opts);
  let wrappedEntries = wrapEntries(entries, injectFiles);
  //启动 gui server
  if (opts.gui !== false) {
    opts.console.info('faked:', '启动 GUI...');
    startGui(opts);
  } else {
    opts.console.info('faked:', '准备就绪');
  }
  return wrappedEntries;
}

module.exports = { entries: entries, entry: entries };