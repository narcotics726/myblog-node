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

var _ = require('underscore');
_.str = require('underscore.string');

var crypto = require('crypto');

var webconfig = require('../webconfig');

var dropboxHelper = require('../util/dropboxHelper');

//=============================================

var lockList = [];

function getBlogHeader(data) {
  data = _.str.trim(data);
  var blogHeaderHtml = '';
  try {
    if (data[0] === '{') {
      var bracePairStack = [];
      var lastBraceOnBlogHeader = -1;
      var i = 0;
      var currentChar;
      for (i = 0; i < data.length; i++) {
        currentChar = data.charAt(i);
        if (currentChar === '{') {
          bracePairStack.push('brace');
        } else if (currentChar === '}') {
          bracePairStack.pop();
          if (bracePairStack.length === 0) {
            lastBraceOnBlogHeader = i;
            break;
          }
        }
      }
      if (lastBraceOnBlogHeader !== -1) {
        var blogHeader = JSON.parse(data.slice(0, lastBraceOnBlogHeader + 1));
        data = data.slice(lastBraceOnBlogHeader + 2);
        blogHeaderHtml = _.str.sprintf('<p>Category: %(category)s</p>', blogHeader);
        return { header: blogHeaderHtml, data: data };
      }
    }
  } catch (ex) {
    console.log('get blog header err: ' + ex.stack);
    return '';
  }
}

function markdown2html(data, callback) {
  var startTime = new Date().getTime();
  var blogHeader = getBlogHeader(data);
  var blogHeaderHtml = '';
  if (blogHeader) {
    data = blogHeader.data;
    blogHeaderHtml = blogHeader.header;
  }
  marked(data, function (err, content) {
    console.log('md2html ok: ', new Date().getTime() - startTime);
    return callback(err, blogHeaderHtml + content);
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
  var metadataArg = {
    path: 'blogs/' + blog.fileName,
    token: blog.token,
    file_limit: '',
    hash: '',
    list: 'true',
    include_deleted: '',
    rev: '',
    locale: '',
    include_media_info: '',
  };
  dropboxHelper.invokeAPI('metadata', metadataArg, function (err, result) {
    if (err) {
      return callback(err, null);
    } else {
      result = JSON.parse(result);
      if (result.rev) {
        var cachedHtmlFilePath = path.resolve(webconfig.blogCacheDir, result.rev);
        if (fs.existsSync(cachedHtmlFilePath)) {
          fs.readFile(cachedHtmlFilePath, 'utf-8', function (err2, data) {
            return callback(err2, data);
          });
        } else {
          if (!fs.existsSync(webconfig.blogCacheDir)) {
            fs.mkdirSync(webconfig.blogCacheDir);
          }
          dropboxHelper.invokeAPI('files', apiArg, function (err, data) {
            markdown2html(data, function (err2, content) {
              writeHtmlCache(cachedHtmlFilePath, content);
              return callback(null, content);
            });
          });
        }
      }
    }
  });
}

function getBlogContent(blog, callback) {
  if (blog.location) {
    switch (blog.location) {
      case 'l':
      return getBlogContentLocal(blog, callback);
      case 'dp':
      return getBlogContentDropbox(blog, callback);
    }
  }
}

module.exports.getBlogContent = getBlogContent;