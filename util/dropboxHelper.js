var https = require('https');
var dropboxCfg = require('../webconfig').dropBoxCfg;

var apiOptTable = {
  authorize: {
    hostname: 'www.dropbox.com',
    path: '/1/oauth2/authorize?code=%(code)s&grant_type=%(grant_type)s&client_id=%(client_id)s&client_secret=%(client_secret)s&redirect_uri=%(redirect_uri)s',
    method: 'POST',
    port: 443
  }
};

function getHttpOptions(api, args) {
  return apiOptTable[api];
}

function invokeAPI(api, args, callback) {
  var options = getHttpOptions(api);
  options.path = _.str.sprintf(options.path, args);
  var req = https.request(options, function (res) {
    var result = '';
    res.on('data', function (chunk) { result += chunk; });
    res.on('end', function () { callback(result, null); });
    req.end();
    req.on('error', function (err) {
      callback(null, err);
    });
  });
}

function getToken(code, callback) {
  var grant_type = 'authorization_code';
  var client_id = dropboxCfg.client_id;
  var client_secret = dropboxCfg.client_secret;
  var redirect_uri = dropboxCfg.redirect_uri;

  var options = {
    hostname: 'api.dropbox.com',
    path: '/1/oauth2/token?code=' + code + '&grant_type=' + grant_type + '&client_id=' + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirect_uri,
    method: 'POST',
    port: 443
  };

  var req = https.request(options, function (res) {
    var result = '';
    res.on('data', function (chunk) {
      result += chunk;
    });
    res.on('end', function () {
      console.log(result);
      callback(JSON.parse(result), null);
    });
  });
  req.write('');
  req.end();

  req.on('error', function (err) {
    callback(null, err);
  });
}

function getAccountInfo(user, locale, callback) {
  var options = {
    hostname: 'api.dropbox.com',
    path: '/1/account/info?' + 'oauth_token=' + user.Token + '&oauth_consumer_key=' + dropboxCfg.client_id + '&locale=zh-cn',
    method: 'GET',
    port: 443
  };

  var req = https.request(options, function (res) {
    var result = '';
    res.on('data', function (chunk) {
      result += chunk;
    });
    res.on('end', function () {
      callback(JSON.parse(result), null);
    });
  });

  req.write('');
  req.end();

  req.on('error', function (err) {
    callback(null, err);
  });
}

module.exports.getToken = getToken;
module.exports.getAccountInfo = getAccountInfo;
