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
    try {
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('end', function () {
        callback(JSON.parse(result), null);
      });
    } catch (err) {
      callback(null, err);
    }
  });
  req.write('');
  req.end();
}

module.exports.getToken = getToken;