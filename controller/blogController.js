var express = require('express');

var _ = require('underscore');
_.str = require('underscore.string');

var fs = require('fs');
var path = require('path');

var Blog = require('../model/blog');

var fileHandler = require('../util/fileHandler');

var blogRouter = express.Router();

blogRouter.use(function (req, res, next) {
  next();
});

blogRouter.get('/:year/:month/:day/:title', function (req, res, next) {
  var blog = new Blog(req.params, 'reqParams');
  fileHandler.getBlogContent(blog, function (err, content) {
    if (err) {
      next(err);
    } else {
      res.render('blog', { blog: { title: blog.title, content: content} });
    }
  });
});

/* if the requested blog path is not match the specific pattern
or didn't find the file
*/
blogRouter.use(function (req, res, next) {
  res.send('We didn\'t find that :(');
});

function getBlogUrl(blog) {
  return _.str.sprintf('/blog/%(dateYear)s/%(dateMonth)s/%(dateDate)s/%(title)s', blog);
}

/** @method getBlogList
@param files {array} array of file names(
no path, and in specific form like 
'yyyy-MM-dd-blogname.md')
@return {array} array of 
BlogItem{dateStr, title, blogdate, dateYear, 
dateMonth, dateDate}
**/
function getBlogList(blogDir, callback) {
  fs.readdir(blogDir, function (err, files) {
    if (files && files.length) {
      try {
        var blogList = [];
        files.forEach(function (filename) {
          var blogItem = new Blog(filename, 'filename');
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

module.exports = blogRouter;
module.exports.getBlogUrl = getBlogUrl;
module.exports.getBlogList = getBlogList;