var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var blogController = require('./controller/blogController');
var adminContoller = require('./controller/adminController');

var webconfig = require('./webconfig');

var app = express();

app.engine('jade', require('jade').__express);
app.set('views', webconfig.viewdir);
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'abc',
  resave: true,
  saveUninitialized: true
}));

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

app.use('/dropboxAuth', function (req, res, next) {
  require('./util/dropboxHelper').getToken(req.query.code, function (result, err) {
    if (err) {
      next(err);
    } else {
      req.session.user = { Id: 'dp', Token: result.access_token, Uid: result.uid };
      console.log(req.session.user.Uid);
      if (req.session.originalUrl) {
        res.redirect(req.session.originalUrl);
      } else {
        res.redirect('/');
      }
    }
  });
});

app.get('/', function (req, res, next) {
  res.redirect('/blog/list');
});

app.get('*', function (req, res, next) {
  res.send(404, 'Oops, this page didn\'t exist');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500, 'Internal Error');
});

app.listen(webconfig.port);