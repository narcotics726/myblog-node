var _ = require('underscore');
_.str = require('underscore.string');

var mongoose = require('mongoose');
mongoose.connect(_.str.sprintf('%(db)s://%(host)s:%(port)s/%(name)s', require('../webconfig').dbCfg));

module.exports = mongoose;