var express = require('express');
var session = require('express-session');
var router = express.Router();
var blogController = require('./blogController');

var webconfig = require('../webconfig');

router.use(function (req, res, next) {
  var url = req.originalUrl;
  req.session.originalUrl = url;
  if (url !== '/admin/login' && !req.session.user) {
    return res.redirect('/admin/login');
  }
  next();
});

router.get('/', function (req, res, next) {
  res.send(req.session.user.Id);
});

router.get('/login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    var opt = require('../util/dropboxHelper').getHttpOptions('authorize', require('../webconfig').dropboxCfg);
    var authorizeUri = 'https://' + opt.hostname + opt.path;
    res.render('admin/login', { dropboxAuthUri: authorizeUri });
  }
});

router.post('/login', function (req, res, next) {
  var userId = req.body.userId;
  var pwd = req.body.pwd;
  req.session.user = { Id: userId };
  return res.redirect('/');
});

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  res.cookie('user', '');
  return res.redirect('/');
});

module.exports = router;