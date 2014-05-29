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

var webconfig = require('../webconfig');

//=============================================

function markdown2html(data, callback) {
  marked(data, function (err, content) {
    callback(err, content);
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
  var fileNameWithOutExt = blog.fileName.slice(0, (blog.fileName.lastIndexOf('.')));
  var cachedHtmlFileName = fileNameWithOutExt + '.html';
  var cachedHtmlFilePath = path.resolve(webconfig.blogCacheDir, cachedHtmlFileName);
  var filePath = path.resolve(webconfig.blogdir, blog.fileName);

  if (!fs.existsSync(filePath)) {
    callback(null, null);
  }

  if (fs.existsSync(cachedHtmlFilePath)) {
    fs.readFile(cachedHtmlFilePath, 'utf-8', function (err, data) {
      callback(err, data);
    });
  } else if (!fs.existsSync(webconfig.blogCacheDir)) {
    fs.mkdirSync(webconfig.blogCacheDir);

    fs.readFile(filePath, 'utf-8', function (err, data) {
      if (err) { callback(err, null); }
      markdown2html(data, function (err2, content) {
        if (err) { callback(err2, null); }
        writeHtmlCache(cachedHtmlFilePath, content);
        callback(null, content);
      });
    });
  }
}


module.exports.markdown2html = markdown2html;
module.exports.getBlogContent = getBlogContent;