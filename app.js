var express = require('express');

var Blog = require('./model/blog');
var blogController = require('./controller/blogController');
var app = express();

var webconfig = require('./webconfig');

/* mw for all request, just for logging
*/
app.use(function (req, res, next) {
  console.log(req.url);
  next();
});

/* router for /blog/\*
*/
app.use('/blog', blogController);

app.use('/', function (req, res, next) {
  blogController.getBlogList(webconfig.blogdir, function (err, blogList) {
    if (err) {
      next(err);
    } else {
      var html = '';
      if (blogList && blogList.length) {
        blogList.forEach(function (blog) {
          var url = blogController.getBlogUrl(blog);
          html += '<a href="' + url + '">' + blog.title + '</a><br />';
        });
        res.send(html);
      } else {
        res.send('No Blogs Found.');
      }
    }
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500, 'Internal Error');
});

app.listen(3000, '0.0.0.0');