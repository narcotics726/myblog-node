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
      this.dateYear = this.dateStr.slice(0, 4);
      this.dateMonth = this.dateStr.slice(5, 7);
      this.dateDate = this.dateStr.slice(-2);
      this.title = arg.substring(11, arg.lastIndexOf('.'));
      this.fileName = arg;
    } else {
      this.title = undefined;
    }
  } else if (argType === 'reqParams') {
    this.dateYear = arg.year;
    this.dateMonth = arg.month;
    this.dateDate = arg.day;
    this.title = arg.title;
    this.fileName = _.str.sprintf('%(dateYear)s-%(dateMonth)s-%(dateDate)s-%(title)s.md', this);
  }
  this.location = location;
}

module.exports = Blog;
