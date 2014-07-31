var express = require('express');
var dropboxhooksRouter = express.Router();

dropboxhooksRouter.get('/', function (req, res, next) {
  next();
});

module.exports = dropboxhooksRouter;