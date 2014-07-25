var https = require('https');
var dropboxCfg = require('../webconfig').dropBoxCfg;

function getToken(code, callback) {
  var grant_type = 'authorization_code';
  var client_id = dropboxCfg.appKey;
  var client_secret = dropboxCfg.appSecret;
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
    path: '/1/account/info?' + 'oauth_token=' + user.Token + '&oauth_consumer_key=' + client.appKey + '&locale=zh-cn',
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
