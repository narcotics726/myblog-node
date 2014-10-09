var db = require('../util/dbHelper');

var Blog = db.model('Blog', { name: String });

var first = new Blog({ name: 'First' });

first.save(function (err) {
  if (err) { return console.error(err); }
  console.log('ok');
});

first.save(function (err) {
  if (err) { return console.error(err); }
  console.log('ok');
});

first.save(function (err) {
  if (err) { return console.error(err); }
  console.log('ok');
});