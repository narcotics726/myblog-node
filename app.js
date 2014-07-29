var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var blogController = require('./controller/blogController');
var adminContoller = require('./controller/adminController');

var webconfig = require('./webconfig');

var app = express();

app.engine('jade', require('jade').__express);
app.set('views', webconfig.viewdir);
app.set('view engine', 'jade');

app.use(cookieParser());

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
  if (!req.session.user && req.cookies.user) {
    console.log('cookie found: ' + req.cookies.user);
    var user = JSON.parse(req.cookies.user);
    req.session.user = { token: user.token, uid: user.uid };
  }
  next();
});

app.use('/public', express.static(webconfig.publicdir));

/* router for /blog/
*/
app.use('/blog', blogController);
app.use('/admin', adminContoller);

app.use('/dropboxAuth', function (req, res, next) {
  var dropboxCfg = require('./webconfig').dropboxCfg;
  var args = {
    code: req.query.code,
    grant_type: 'authorization_code',
    client_id: dropboxCfg.client_id,
    client_secret: dropboxCfg.client_secret,
    redirect_uri: dropboxCfg.redirect_uri
  };
  require('./util/dropboxHelper').invokeAPI('token', args, function (err, result) {
    if (err) {
      next(err);
    } else {
      result = JSON.parse(result);
      req.session.user = { id: 'dp', token: result.access_token, uid: result.uid };
      res.cookie('user', JSON.stringify(req.session.user));
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