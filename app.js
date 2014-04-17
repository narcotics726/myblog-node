var express = require('express');
var markdown = require('markdown').markdown;
var fs = require('fs');
var webconfig = require('./webconfig');

var app = express();

/** @method pad
@param num {int} the number need padding
@param n {int} padding length
@return {string} number after padding
@example
var str = pad(1, 2);
//str = 01
var str = pad(888, 2);
//str = 888
**/
function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

/** @method getBlogList
@param files {array} array of file names(no path, and in specific form like '2014-01-10-blogname.md')
@return {array} array of BlogItem{dateStr, title, blogdate, dateYear, dateMonth, dateDate}
**/
function getBlogList(files, callback) {
  try {
    var blogList = [];
    console.log(files);
    files.forEach(function (filename) {
      var regPattern = /^[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-9][0-9]-.{1,}\.md$/;
      if (filename.search(regPattern) !== -1) {
        var blogItem = {};
        blogItem.dateStr = filename.substring(0, 10);
        blogItem.title = filename.substring(11, filename.lastIndexOf('.'));
        blogItem.blogdate = new Date();
        blogItem.blogdate.setTime(Date.parse(blogItem.dateStr));
        blogItem.dateYear = blogItem.blogdate.getFullYear();
        blogItem.dateMonth = pad(blogItem.blogdate.getMonth() + 1, 2);
        blogItem.dateDate = blogItem.blogdate.getDate();
        blogList.push(blogItem);
      } else {
        console.log('nok', filename);
      }
    });
    return callback(null, blogList);
  } catch (err) {
    return callback(err, null);
  }
}

app.use(function (req, res, next){
  console.log(req.url);
  next();
});

var blogRouter = express.Router();

blogRouter.use(function (req, res, next) {
  next();
});

blogRouter.get('/:year/:month/:day/:title', function (req, res, next) {
  console.log(req.params.title);
  var filename = './blog/' + req.params.year + '-' + req.params.month + '-' + req.params.day + '-' + req.params.title + '.md';
  console.log(filename);
  fs.exists(filename, function (exists) {
    if (exists) {
      fs.readFile(filename, 'utf-8', function (err, data) {
        var start = new Date();
        res.send(markdown.toHTML(data));
        var end = new Date();
        console.log(end - start);
      });
    } else {
      res.send(filename + 'Page Not Found');
    }
  });
});

app.use('/blog', blogRouter);

app.use('/', function (req, res) {
  fs.readdir(webconfig.blogdir, function (err, files) {
    if (files && files.length) {
      var html = '';
      getBlogList(files, function (err, blogList) {
        blogList.forEach(function (blog) {
          blog.url = '/blog/' + blog.dateYear + '/' + blog.dateMonth + '/' + blog.dateDate + '/' + blog.title;
          html += '<a href="' + blog.url + '">' + blog.title + '</a><br />';
        });
        res.send(html);
      });
    } else {
      res.send('No Blogs');
    }
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500, 'Internal Error');
});

app.listen(3000, '0.0.0.0');