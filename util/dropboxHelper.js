var https = require('https');
var dropboxCfg = require('../webconfig').dropboxCfg;
var _ = require('underscore');
_.str = require('underscore.string');

var apiOptTable = require('../cfg/dropboxAPITable');

function getHttpOptions(api, args) {
  var opt = apiOptTable[api];
  if (opt) {
    //prevent the originPath overwritten by the newer one,
    //restore it everytime before using it again
    if (opt.originPath) {
      opt.path = opt.originPath;
    } else {
      opt.originPath = opt.path;
    }
    opt.path = _.str.sprintf(opt.path, args);
  }
  return opt;
}

function getToken(callback) {
  var cfgPath = require('path').resolve(__dirname, '../cfg/dropboxCfg.json');
  require('fs').readFile(cfgPath, 'utf-8', function (err, data) {
    var cfg = '';
    try {
      cfg = JSON.parse(data);
    } catch (ex) {
      return callback(ex, null);
    }
    if (cfg.token && cfg.token.length) {
      return callback(null, cfg.token);
    }
    return callback(null, null);
  });
}

function invokeAPI(api, args, callback) {
  getToken(function (err, token) {
    if (err) {
      return callback(err, null);
    }
    args.token = token;
    var options = getHttpOptions(api, args);
    console.log('invokeAPI: ', options.path);
    var req = https.request(options, function (res) {
      var result = '';
      res.on('data', function (chunk) { result += chunk; });
      res.on('end', function () {
        console.log('invokeAPI-Result: ' + result);
        callback(null, result);
      });
    });
    req.write('');
    req.end();
    req.on('error', function (err) {
      callback(err, null);
    });
  });
}



module.exports.invokeAPI = invokeAPI;
module.exports.getHttpOptions = getHttpOptions;
module.exports.getToken = getToken;