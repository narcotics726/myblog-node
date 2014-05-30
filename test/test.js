var http = require('http');

var blogUrl = 'http://localhost:18080/blog/2014/04/21/node.js_+_express_%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2_1';

var startTime = new Date().getTime();


http.get(blogUrl, function (res) {
  console.log('ok1', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok2', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok3', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok4', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok5', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok6', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok7', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok8', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok9', new Date().getTime() - startTime);
});

http.get(blogUrl, function (res) {
  console.log('ok10', new Date().getTime() - startTime);
});
