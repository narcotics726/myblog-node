var express = require('express');
var markdown = require('markdown').markdown;
var fs = require('fs');
var app = express();

app.get('/', function (req, res) {
  fs.readdir('./blog/', function (err, files) {
    if (files.length) {
      var html = '';
      files.forEach(function (item) {
        if (item.length > 15) {
          var dateStr = item.substring(0, 10);
          var title = item.substring(11, item.lastIndexOf('.'));
          var blogdate = new Date();
          blogdate.setTime(Date.parse(dateStr));
          var link = '/blog/' + blogdate.getFullYear() + '/' + pad((blogdate.getMonth()+1),2) + '/' + blogdate.getDate() + '/' + title;
          html += '<a href="' + link + '">' + title + '</a><br />';
        }
      });
      res.send(html);
    }
  });
});

app.get('/blog/:year/:month/:day/:title', function (req, res) {
  console.log(req.params.title);
  var filename = './blog/' + req.params.year + '-' + req.params.month + '-' +req.params.day+'-' + req.params.title + '.md';
  console.log(filename);
  fs.exists(filename, function (exists) {
    if (exists) {
      console.log(filename, ' exists');
      fs.readFile(filename, 'utf-8', function (err, data) {
        res.send(markdown.toHTML(data));
      });
    } else {
      res.send(filename + 'Page Not Found');
    }
  });
});

function pad (num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
//  fs.readFile('./blog/blog1.md', 'utf-8', function (err, data) {
//    if (err) {
//      console.log(err);
//    } else {
//      res.send(markdown.toHTML(data));
//    }
//  })

app.listen(3000, '0.0.0.0');