var express = require('express');
var path = require('path');

var blogController = require('./controller/blogController');
var app = express();
var webconfig = require('./webconfig');
app.engine('jade', require('jade').__express);

app.set('views', webconfig.viewdir);
app.set('view engine', 'jade');


/* mw for all request, just for logging
*/
app.use(function (req, res, next) {
  console.log(req.url);
  next();
});

app.use('/public', express.static(webconfig.publicdir));

/* router for /blog/\*
*/
app.use('/blog', blogController);

app.get('/', function (req, res, next) {
  blogController.getBlogList(webconfig.blogdir, function (err, blogList) {
    if (err) {
      next(err);
    } else {
      if (blogList && blogList.length) {
        blogList.forEach(function (blog) {
          blog.url = blogController.getBlogUrl(blog);
        });
        res.render('home', { blogs: blogList });
      } else {
        res.send('No Blogs Found.');
      }
    }
  });
});

app.get('*', function (req, res, next) {
  res.send(404, 'Oops, this page didn\'t exist');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500, 'Internal Error');
});

app.listen(webconfig.port);