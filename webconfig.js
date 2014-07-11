var path = require('path');

var config = {
  "blogdir": "blog",
  "blogCacheDir": "cached",
  "port": 18080,
  "publicdir": "public",
  "viewdir": "view",
  "admin": "nark",
  "pwd": "200436"
};

module.exports.blogdir = path.resolve(__dirname, config.blogdir);
module.exports.port = config.port;
module.exports.publicdir = path.resolve(__dirname, config.publicdir);
module.exports.viewdir = path.resolve(__dirname, config.viewdir);
module.exports.blogCacheDir = path.resolve(__dirname, config.blogdir, config.blogCacheDir);