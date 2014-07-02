var fs = require('fs');

var _ = require('underscore');
_.str = require('underscore.string');

var Blog = require('../model/blog');


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



function getBlogUrl(blog) {
  return _.str.sprintf('/blog/%(dateYear)s/%(dateMonth)s/%(dateDate)s/%(title)s', blog);
}


module.exports.getBlogUrl = getBlogUrl;
module.exports.getBlogList = getBlogList;