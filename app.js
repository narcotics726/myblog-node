var express = require('express');
var markdown = require('markdown').markdown;
var fs = require('fs');
var _ = require('underscore');
_.str = require('underscore.string');
var app = express();

var webconfig = require('./webconfig');

/** @Blog class
@param filename {string}
@return {Blog} the filename must 
match the regax or the constructor 
will return a instance with undefined title
**/
function Blog(arg, argType){
  if(argType === 'filename')
  {
    var regPattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}-.{1,}\.md$/;
    if (arg!=null && arg.search(regPattern) !== -1) {
      this.dateStr = arg.substring(0, 10);
      this.title = arg.substring(11, arg.lastIndexOf('.'));
      this.blogdate = new Date();
      this.blogdate.setTime(Date.parse(this.dateStr));
      this.dateYear = this.blogdate.getFullYear();
      this.dateMonth = _.str.pad(this.blogdate.getMonth() + 1, 2, '0');
      this.dateDate = this.blogdate.getDate();
      this.fileName = arg;
    } else {
      this.title = undefined;
    }
  } else if (argType == 'reqParams') {
    this.dateYear = arg.year;
    this.dateMonth = arg.month;
    this.dateDate = arg.day;
    this.title = arg.title;
    this.blogdir = webconfig.blogdir;
    this.fileName = _.str.sprintf('%(blogdir)s/%(dateYear)s-%(dateMonth)s-%(dateDate)s-%(title)s.md', this);
  }
}

/** @method getBlogList
@param files {array} array of file names(
no path, and in specific form like 
'2014-01-10-blogname.md')
@return {array} array of 
BlogItem{dateStr, title, blogdate, dateYear, 
dateMonth, dateDate}
**/
function getBlogList(files, callback) {
  try {
    var blogList = [];
    console.log(files);
    files.forEach(function (filename) {
      var blogItem = new Blog(filename, 'filename');
      if (blogItem.title === undefined) {
        console.log(filename + " nok");
      } else {
        blogList.push(blogItem);
      }
    });
    return callback(null, blogList);
  } catch (err) {
    return callback(err);
  }
}

/* mw for all request, just for logging
*/
app.use(function (req, res, next) {
  console.log(req.url);
  next();
});

/* router for blog reading
*/
var blogRouter = express.Router();

blogRouter.use(function (req, res, next) {
  next();
});

blogRouter.get('/:year/:month/:day/:title', function (req, res, next) {
  var blog = new Blog(req.params, 'reqParams');
  fs.exists(blog.fileName, function (exists) {
    if (exists) {
      fs.readFile(blog.fileName, 'utf-8', function (err, data) {
        res.send(markdown.toHTML(data));
      });
    } else {
      res.send(blog.fileName + 'Page Not Found');
    }
  });
});

app.use('/blog', blogRouter);

app.use('/', function (req, res, next) {
  fs.readdir(webconfig.blogdir, function (err, files) {
    if (files && files.length) {
      var html = '';
      getBlogList(files, function (err, blogList) {
        if (err) {
          next(err);
        }
        blogList.forEach(function (blog) {
          //blog.url = '/blog/' + blog.dateYear + '/' + blog.dateMonth + '/' + blog.dateDate + '/' + blog.title;
          blog.url = _.str.sprintf('/blog/%(dateYear)s/%(dateMonth)s/%(dateDate)s/%(title)s', blog);
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