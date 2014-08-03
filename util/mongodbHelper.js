var mongo = require('mongodb').MongoClient;

function insertBlogInfo(data, callback) {
  mongo.connect("mongodb://localhost:27017/myblog-node", function (err, db) {
    if (err) { console.log('mongoErr: ' + err); return callback(err, null); }
    var collection = db.collection('blog');
    collection.insert(data, {w: 1}, function (err2, result) {
      if (err2) { console.log('mongoErr: ' + err2); return callback(err2, null); }
      return callback(null, result);
    });
  });
}

module.exports.insertBlogInfo = insertBlogInfo;