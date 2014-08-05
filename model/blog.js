var _ = require('underscore');
_.str = require('underscore.string');
var webconfig = require('../webconfig');

/** @Blog class
@param filename {string}
@return {Blog} the filename must 
match the regax or the constructor 
will return a instance with undefined title
**/
function Blog(arg, argType, location) {
  if (argType === 'filename') {
    var regPattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}-.{1,}\.md$/;
    if (arg !== null && arg.search(regPattern) !== -1) {
      this.dateStr = arg.substring(0, 10);
      var dateYear = this.dateStr.slice(0, 4);
      var dateMonth = this.dateStr.slice(5, 7);
      var dateDate = this.dateStr.slice(-2);
      this.title = arg.substring(11, arg.lastIndexOf('.'));
      this.fileName = arg;
    } else {
      this.title = undefined;
    }
  } else if (argType === 'reqParams') {
    var dateYear = arg.year;
    var dateMonth = arg.month;
    var dateDate = arg.day;
    this.dateStr = _.str.sprintf('%s-%s-%s', dateYear, dateMonth, dateDate);
    this.title = arg.title;
    this.fileName = _.str.sprintf('%(dateStr)s-%(title)s.md', this);
  }
  this.location = location;
}

module.exports = Blog;
