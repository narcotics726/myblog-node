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
  },
  //create folder
  create_folder: {
    hostname: 'api.dropbox.com',
    path: '/1/fileops/create_folder?access_token=%(token)s&root=%(root)s&path=%(path)s&locale=%(locale)s',
    method: 'POST',
    port: 443
  },
  //metadata
  metadata: {
    hostname: 'api.dropbox.com',
    path: '/1/metadata/auto/%(path)s?access_token=%(token)s&file_limit=%(file_limit)s&hash=%(hash)s&list=%(list)s&include_deleted=%(include_deleted)s&rev=%(rev)s&locale=%(locale)s&include_media_info=%(include_media_info)s',
    method: 'GET',
    port: 443
  },
  //get file
  files: {
    hostname: 'api-content.dropbox.com',
    path: '/1/files/auto/%(path)s?access_token=%(token)s&rev=%(rev)s',
    method: 'GET',
    port: 443
  },
  //tokenflowAuth
  authorize_token: {
    hostname: 'www.dropbox.com',
    path: '/1/oauth2/authorize?response_type=token&client_id=%(client_id)s&redirect_uri=%(redirect_uri)s',
    method: 'GET',
    port: 443
  },
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
      callback(null, result);
    });
  });
  req.write('');
  req.end();
  req.on('error', function (err) {
    callback(err, null);
  });
}

function getToken(callback) {
  var cfgPath = require('path').resolve(__dirname, '../cfg/dropboxCfg.json');
  require('fs').readFile(cfgPath, 'utf-8', function (err, data) {
    var cfg = '';
    try {
      cfg = JSON.parse(data);
      if (cfg.token && cfg.token.length) {
        callback(null, cfg.token);
      } else {
        var arg = {
          client_id: cfg.client_id
        };
        invokeAPI(arg, 'authorize_token', function (err2, result) {
          return callback(new Error('func not impl'));
        });
      }
    } catch (ex) {
      callback(ex, null);
    }
  });
  // body...
}

module.exports.invokeAPI = invokeAPI;
module.exports.getHttpOptions = getHttpOptions;