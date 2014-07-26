var https = require('https');
var dropboxCfg = require('../webconfig').dropboxCfg;
var _ = require('underscore');
_.str = require('underscore.string');

var apiOptTable = {
  //get authorization code
  authorize: {
    hostname: 'www.dropbox.com',
    path: '/1/oauth2/authorize?response_type=%(response_type)s&client_id=%(client_id)s&redirect_uri=%(redirect_uri)s',
    method: 'GET',
    port: 443
  },
  //get token
  token: {
    hostname: 'api.dropbox.com',
    path: '/1/oauth2/token?code=%(code)s&grant_type=%(grant_type)s&client_id=%(client_id)s&client_secret=%(client_secret)s&redirect_uri=%(redirect_uri)s',
    method: 'POST',
    port: 443
  }
};

function getHttpOptions(api, args) {
  var opt = apiOptTable[api];
  if (opt) {
    opt.path = _.str.sprintf(opt.path, args);
  }
  return opt;
}

function invokeAPI(api, args, callback) {
  var options = getHttpOptions(api, args);
  console.log(options.path);
  var req = https.request(options, function (res) {
    var result = '';
    res.on('data', function (chunk) { result += chunk; });
    res.on('end', function () {
      console.log(result);
      callback(result, null);
    });
  });
  req.write('');
  req.end();
  req.on('error', function (err) {
    callback(null, err);
  });
}

module.exports.invokeAPI = invokeAPI;
module.exports.getHttpOptions = getHttpOptions;