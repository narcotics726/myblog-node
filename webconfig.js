var path = require('path');

var config = {
  "blogdir": "blog",
  "port": 18080
};

module.exports.blogdir = path.resolve(__dirname, config.blogdir);
module.exports.port = config.port;