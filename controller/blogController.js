var express = require('express');
var blogRouter = express.Router();

var Blog = require('../model/blog');

var fileHandler = require('../util/fileHandler');
var blogHelper = require('../misc/blogHelper');
var webconfig = require('../webconfig');

blogRouter.use(function (req, res, next) {
  next();
});

blogRouter.get('/list', function (req, res, next) {
  var getListArg = {};
  require('../util/dropboxHelper').getToken(function (err, token) {
    if (err) {
      return next(err);
    }
    if (token) {
      getListArg = { argType: 'token', token: token };
    } else {
      getListArg = { argType: 'dirPath', blogDir: webconfig.blogdir };
    }
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
});

blogRouter.get('/:year/:month/:day/:title', function (req, res, next) {
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

blogRouter.get('/add', function (req, res, next) {
  res.render('blog/add');
});

blogRouter.post('/add', function (req, res, next) {
  var title = req.params.title;
  var content = req.params.content;
  console.log(title);
});

module.exports = blogRouter;