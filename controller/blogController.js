var express = require('express');
var router = express.Router();

var Blog = require('../model/blog');

var fileHandler = require('../util/fileHandler');
var blogHelper = require('../misc/blogHelper');
var dropboxHelper = require('../util/dropboxHelper');
var webconfig = require('../webconfig');

router.use(function (req, res, next) {
  next();
});

router.get('/', function (req, res, next) {
  var getListArg = {
    blogLocation: 'dropbox'
  };
  blogHelper.getBlogList(getListArg, function (err, blogList) {
    if (err) {
      return next(err);
    }
    if (blogList && blogList.length) {
      blogList.forEach(function (blog) {
        blog.url = blogHelper.getBlogUrl(blog);
      });
      res.render('home', { blogs: blogList });
    } else {
      res.send('No Blogs Found.');
    }
  });
});

router.get('/:year/:month/:day/:title', function (req, res, next) {
  var blog = new Blog(req.params, 'reqParams', req.query.l);
  fileHandler.getBlogContent(blog, function (err, content) {
    if (err) { return next(err); }
    if (content && content.length) {
      var renderArg = { blog: { title: blog.title, content: content } };
      return res.render('blog/index', renderArg);
    }
    return next();
  });
});

router.get('/add', function (req, res, next) {
  res.render('blog/add');
});

router.post('/add', function (req, res, next) {
  var title = req.params.title;
  var content = req.params.content;
});

module.exports = router;