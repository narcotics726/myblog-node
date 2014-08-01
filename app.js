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
  console.log(req.method + ':' + req.url);
  next();
});

app.use('/public', express.static(webconfig.publicdir));

/* router for /blog/
*/
app.use('/blog', blogController);

app.get('/', function (req, res, next) {
  res.redirect('/blog');
});

app.get('*', function (req, res, next) {
  res.send(404, 'Oops, this page didn\'t exist');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500, 'Internal Error');
});

app.listen(webconfig.port);