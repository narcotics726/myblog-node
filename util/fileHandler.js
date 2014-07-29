var fs = require('fs');
var path = require('path');

var marked = require('marked');
var pygmentize = require('pygmentize-bundled');
marked.setOptions({
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

var crypto = require('crypto');

var webconfig = require('../webconfig');

//=============================================

var lockList = [];


function markdown2html(data, callback) {
  var startTime = new Date().getTime();
  marked(data, function (err, content) {
    console.log('md2html ok: ', new Date().getTime() - startTime);
    return callback(err, content);
  });
}

function writeHtmlCache(cacheFilePath, htmlContent) {
  fs.writeFile(cacheFilePath, htmlContent, 'utf-8', function (err) {
    if (err) { console.log(err); }
  });
}

function getBlogContentLocal(blog, callback) {
  var filePath = path.resolve(webconfig.blogdir, blog.fileName);
  if (!fs.existsSync(filePath)) {
    return callback(null, null);
  }

  fs.readFile(filePath, 'utf-8', function (err, data) {
    var h = crypto.createHash('md5');
    h.update(data);
    var fileHash = h.digest('hex');

    var cachedHtmlFilePath = path.resolve(webconfig.blogCacheDir, fileHash);
    if (fs.existsSync(cachedHtmlFilePath)) {
      fs.readFile(cachedHtmlFilePath, 'utf-8', function (err2, data) {
        return callback(err2, data);
      });
    } else {
      if (!fs.existsSync(webconfig.blogCacheDir)) {
        fs.mkdirSync(webconfig.blogCacheDir);
      }
      if (err) {  return callback(err, null); }
      if (lockList.indexOf(fileHash) !== -1) {
        console.log('locked!');
        return getBlogContentLocal(blog, callback);
      }
      //no lock on cache
      lockList.push(fileHash);
      markdown2html(data, function (err2, content) {
        if (err) { return callback(err2, null); }
        writeHtmlCache(cachedHtmlFilePath, content);
        lockList.splice(lockList.indexOf(fileHash), 1);
        return callback(null, content);
      });
    }
  });
}

function getBlogContentDropbox(blog, callback) {
  var apiArg = {
    path: 'blogs/' + blog.fileName,
    token: blog.token,
    rev: ''
  };
  require('./dropboxHelper').invokeAPI('files', apiArg, function (err, data) {
    markdown2html(data, function (err2, content) {
      return callback(null, content);
    });
  });
}

function getBlogContent(blog, callback) {
  if (blog.location) {
    switch (blog.location) {
    case 'local':
      return getBlogContentLocal(blog, callback);
    case 'dropbox':
      return getBlogContentDropbox(blog, callback);
    }
  }
}

module.exports.getBlogContent = getBlogContent;