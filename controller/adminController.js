var express = require('express');
var session = require('express-session');
var adminRouter = express.Router();
var blogController = require('./blogController');

var webconfig = require('../webconfig');

adminRouter.use(function (req, res, next) {
  var url = req.originalUrl;
  req.session.originalUrl = url;
  if (url !== '/admin/login' && !req.session.user) {
    return res.redirect('/admin/login');
  }
  next();
});

adminRouter.get('/', function (req, res, next) {
  res.send(req.session.user.Id);
});

adminRouter.get('/login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('admin/login', { dropboxAuthUri: require('../test/dropboxtest').authUrl });
  }
});

adminRouter.post('/login', function (req, res, next) {
  var userId = req.body.userId;
  var pwd = req.body.pwd;
  req.session.user = { Id: userId };
  return res.redirect('/');
});

adminRouter.get('/dpbxapi/:cmd', function (req, res, next) {
  switch (req.params.cmd) {
  case 'getcode':
    console.log(req.session.user.DropboxCode);
    break;
  case 'accountInfo':
    console.log('accountInfo');
    var url = "https://api.dropbox.com/1/account/info";
    break;
  default:
    console.log('no such cmd');
  }
});

module.exports = adminRouter;