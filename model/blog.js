var _ = require('underscore');
_.str = require('underscore.string');
var webconfig = require('../webconfig');

/** @Blog class
@param filename {string}
@return {Blog} the filename must 
match the regax or the constructor 
will return a instance with undefined title
**/
function Blog(arg, argType) {
  if (argType === 'filename') {
    var regPattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}-.{1,}\.md$/;
    if (arg !== null && arg.search(regPattern) !== -1) {
      this.dateStr = arg.substring(0, 10);
      this.title = arg.substring(11, arg.lastIndexOf('.'));
      this.blogdate = new Date();
      this.blogdate.setTime(Date.parse(this.dateStr));
      this.dateYear = this.blogdate.getFullYear();
      this.dateMonth = _.str.pad(this.blogdate.getMonth() + 1, 2, '0');
      this.dateDate = _.str.pad(this.blogdate.getDate(), 2, '0');
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
}

module.exports = Blog;
