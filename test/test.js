var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var assert = require('assert');

var db = new Db('myblog-node', new Server('localhost', 27017), { w: 1});

db.open(function (err, db) {
  var collection = db.collection('blog');
  collection.insert({ title: 'my-first-blog', author: 'Nark' }, {w: 1}, function (err, result) {
    collection.findOne({ title: 'my-first-blog' }, function (err, item) {
      assert.equal(null, err);
      assert.equal('Nark', item.author);
      db.close();
    });
  });
});