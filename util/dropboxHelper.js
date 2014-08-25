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
    if (err) { return callback(err, null); }
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

/*
** this func is fired when dropbox give us notification
** it only knows that there ARE files have been changed
** but doesnt know WHAT have been changed
** so we'll call /delta to make it clear
*/
function onNotified(callback) {
  //call /delta api, get to know what files have been changed
  var lastDeltaCursor = '';
  var currentBlogListRev = '';
  var args = {
    cursor: lastDeltaCursor,
    locale: '',
    path_prefix: 'blogs',
    include_media_info: 'false'
  };
  invokeAPI('delta', args, function (err, result) {
    if (err) { return callback(err); }
    result = JSON.parse(result);
    if (!result.entries || result.entries.length === 0) {
      return callback('');
    }
    var i = 0;
    var item = {};
    for (i = 0; i < result.entries.length; i++) {
      item = result.entries[i];
      if (item[0] === '/blogs') {
        if (item[1].rev !== currentBlogListRev) {
          updateBlogListCache(item);
          break;
        }
      }
    }
    return callback('');
  });
}


module.exports.invokeAPI = invokeAPI;
module.exports.getHttpOptions = getHttpOptions;
module.exports.getToken = getToken;
module.exports.onNotificated = onNotificated;