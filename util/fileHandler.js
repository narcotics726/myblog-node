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

function markdown2html(data, callback) {
  marked(data, function (err, content) {
    return callback(err, content);
  });
}

function writeHtmlCache(cacheFilePath, htmlContent) {
  fs.writeFile(cacheFilePath, htmlContent, 'utf-8', function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function getBlogContent(blog, callback) {
  var filePath = path.resolve(webconfig.blogdir, blog.fileName);
  if (!fs.existsSync(filePath)) {
    return callback(null, null);
  }

  fs.readFile(filePath, 'utf-8', function (err, data) {
    var h = crypto.createHash('md5');
    h.update(data);
    var ret = h.digest('hex');

    var cachedHtmlFilePath = path.resolve(webconfig.blogCacheDir, ret);
    if (fs.existsSync(cachedHtmlFilePath)) {
      fs.readFile(cachedHtmlFilePath, 'utf-8', function (err, data) {
        return callback(err, data);
      });
    } else {
      if (!fs.existsSync(webconfig.blogCacheDir)) {
        fs.mkdirSync(webconfig.blogCacheDir);
      }
      if (err) {  return callback(err, null); }
      markdown2html(data, function (err2, content) {
        if (err) { return callback(err2, null); }
        writeHtmlCache(cachedHtmlFilePath, content);
        return callback(null, content);
      });
    }
  });
}


module.exports.getBlogContent = getBlogContent;