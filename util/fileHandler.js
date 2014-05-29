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
  console.log(fileNameWithOutExt);
  var cachedHtmlFileName = fileNameWithOutExt + '.html';
  var cachedHtmlFilePath = path.resolve(webconfig.blogCacheDir, cachedHtmlFileName);
  fs.exists(webconfig.blogCacheDir, function (existsDir) {
    if (!existsDir) {
      fs.mkdir(webconfig.blogCacheDir);
    }
  });
  fs.exists(cachedHtmlFilePath, function (existsCache) {
    if (existsCache) {
      console.log('cache file found');
      fs.readFile(cachedHtmlFilePath, 'utf-8', function (err, data) {
        callback(err, data);
      });
    } else {
      var filePath = path.resolve(webconfig.blogdir, blog.fileName);
      fs.exists(filePath, function (exists) {
        if (exists) {
          fs.readFile(filePath, 'utf-8', function (err, data) {
            if (err) {
              callback(err, null);
            } else {
              markdown2html(data, function (err, content) {
                if (err) {
                  callback(err, null);
                }
                writeHtmlCache(cachedHtmlFilePath, content);
                callback(null, content);
              });
            }
          });
        }
      });
    }
  });
}


module.exports.markdown2html = markdown2html;
module.exports.getBlogContent = getBlogContent;