var express = require('express');
var path = require('path');

var blogController = require('./controller/blogController');
var adminContoller = require('./controller/adminController');
var app = express();
var webconfig = require('./webconfig');
var dropboxAuth = null;

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

/* router for /blog/
*/
app.use('/blog', blogController);
app.use('/admin', adminContoller);

app.get('/', function (req, res, next) {
  if (dropboxAuth) {
    res.redirect('/blog/list');
  } else {
    res.redirect(require('./test/dropboxtest').authUrl);
  }
});

app.get('/dropboxAuth', function (req, res, next) {
  console.log(req.query);
  dropboxAuth = req.query.code;
  res.redirect('/');
});

app.get('/dropboxAuthClear', function (req, res, next) {
  dropboxAuth = null;
  res.redirect('/');
});

app.get('*', function (req, res, next) {
  res.send(404, 'Oops, this page didn\'t exist');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500, 'Internal Error');
});

app.listen(webconfig.port);