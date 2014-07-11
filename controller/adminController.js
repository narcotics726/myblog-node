var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var adminRouter = express.Router();
var blogController = require('./blogController');

var webconfig = require('../webconfig');

adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded());
adminRouter.use(session({secret: 'abc'}));
adminRouter.use(function (req, res, next) {
  var url = req.originalUrl;
  if (url !== '/admin/login' && !req.session.user) {
    return res.redirect('/admin/login');
  }
  next();
});

adminRouter.get('/blog', blogController);


adminRouter.get('/login', function (req, res, next) {
  res.render('admin/login');
});

adminRouter.post('/login', function (req, res, next) {
  var userId = req.body.userId;
  var pwd = req.body.pwd;
  req.session.user = { Id: userId };
  return res.redirect('/admin');
});

module.exports = adminRouter;