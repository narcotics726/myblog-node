var fs = require('fs');

var _ = require('underscore');
_.str = require('underscore.string');

var dropboxHelper = require('../util/dropboxHelper');

var Blog = require('../model/blog');

function getBlogListLocal(args, callback) {
  var blogDir = args.blogDir;
  fs.readdir(blogDir, function (err, files) {
    if (files && files.length) {
      try {
        var blogList = [];
        files.forEach(function (filename) {
          var blogItem = new Blog(filename, 'filename', 'local');
          if (blogItem.title !== undefined) {
            blogList.push(blogItem);
          }
        });
        return callback(null, blogList);
      } catch (innerErr) {
        return callback(innerErr);
      }
    } else {
      return callback(null, []);
    }
  });
}

function getBlogListDropbox(args, callback) {
  var optArg = {
    path: 'Blogs',
    token: args.token,
    file_limit: '',
    hash: '',
    list: 'true',
    include_deleted: '',
    rev: '',
    locale: '',
    include_media_info: '',
  };
  dropboxHelper.invokeAPI('metadata', optArg, function (err, result) {
    if (err) {
      return callback(err, null);
    }

    result = JSON.parse(result);
    if (result.error) {
      return callback(new Error(result.error), null);
    }
    var blogList = [];
    if (!result.contents) {
      return callback(new Error('no content in blog dir result'), null);
    }
    result.contents.forEach(function (item) {
      if (_.str.endsWith(item.path, 'md')) {
        //e.g: reuslt.path = '/blogs', the contents item's path will be '/blogs/filename'
        var fileName = item.path.slice(result.path.length + 1);
        var blogItem = new Blog(fileName, 'filename', 'dropbox');
        if (blogItem.title !== undefined) {
          blogList.push(blogItem);
        }
      }
    });
    return callback(null, blogList);
  });
}

function getBlogList(args, callback) {
  switch (args.argType) {
    case 'dirPath':
    return getBlogListLocal(args, callback);
    case 'token':
    return getBlogListDropbox(args, callback);
    default:
    return callback(new Error('wrong getList argType', null));
  }
}

function getBlogUrl(blog) {
  return _.str.sprintf('/blog/%(dateYear)s/%(dateMonth)s/%(dateDate)s/%(title)s?l=%(location)s', blog);
}


module.exports.getBlogUrl = getBlogUrl;
module.exports.getBlogList = getBlogList;