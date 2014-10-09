var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function schema() {
  this.blogListSchema = new Schema({
    current_cursor: String,
    items: [String]
  });

  this.BlogList = mongoose.model('BlogList', this.blogListSchema);
}

module.exports = schema;