var path = require('path');

var config = require('./cfg/basicCfg');

var dropboxCfg = require('./cfg/dropboxCfg');

module.exports.blogdir = path.resolve(__dirname, config.blogdir);
module.exports.port = config.port;
module.exports.publicdir = path.resolve(__dirname, config.publicdir);
module.exports.viewdir = path.resolve(__dirname, config.viewdir);
module.exports.blogCacheDir = path.resolve(__dirname, config.blogdir, config.blogCacheDir);
module.exports.dropboxCfg = dropboxCfg;