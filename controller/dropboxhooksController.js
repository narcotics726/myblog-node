var express = require('express');
var router = express.Router();
var dropboxHelper = require('../util/dropboxHelper');

router.get('/', function (req, res, next) {
  next();
});

/*
** this is the dropbox-webhook's verification request handler
** see https://www.dropbox.com/developers/webhooks/tutorial
*/
router.get('/', function (req, res, next) {
  return res.send(req.query.challenge);
});

/*
** and this is webhook's notification request handler
*/
router.post('/', function (req, res, next) {
  var sig = req.get('X-Dropbox-Signature');
  var key = 'abc';  //key should be your app's secret
  var hash = require('crypto').createHmac('sha256', key).update(req.body).digest('hex');
  if (sig !== hash) {
    console.log('Dropbox webhook, wrong request: expect: ' + hash + ', actual: ' + sig);
    //todo: here should raise an error
  }
  var deltaUsers = JSON.parse(req.body).delta.users;
  if (deltaUsers && deltaUsers.length) {
    //dropbox gave us an userList, 
    //but actually our system is a single-user sys, 
    //so we dont need to do anything with that, just judge if this list is empty, 
    //then do what we should do
    dropboxHelper.onNotificated();
  }
  return res.send('');
});

module.exports = router;