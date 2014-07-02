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
  blogHelper.getBlogList(webconfig.blogdir, function (err, blogList) {
    if (err) {
      next(err);
    } else {
      if (blogList && blogList.length) {
        blogList.forEach(function (blog) {
          blog.url = blogHelper.getBlogUrl(blog);
        });
        res.render('home', { blogs: blogList });
      } else {
        res.send('No Blogs Found.');
      }
    }
  });
});

blogRouter.get('/:year/:month/:day/:title', function (req, res, next) {
  var blog = new Blog(req.params, 'reqParams');
  fileHandler.getBlogContent(blog, function (err, content) {
    if (err) {
      next(err);
    } else {
      if (content && content.length) {
        res.render('blog', { blog: { title: blog.title, content: content} });
      } else {
        next();
      }
    }
  });
});

module.exports = blogRouter;