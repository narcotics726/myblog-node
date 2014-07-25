var https = require('https');

var client = {
  appKey: "ndd7wtqyiu0y4vb",
  appSecret: "p4gqaj9sn2yjkol",
  redirect_uri: "http://localhost:18080/dropboxAuth"
};

function getToken(code, callback) {
  var grant_type = 'authorization_code';
  var client_id = client.appKey;
  var client_secret = client.appSecret;
  var redirect_uri = client.redirect_uri;

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