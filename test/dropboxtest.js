var http = require('https');
var _ = require('underscore');
_.str = require('underscore.string');

var urlComponents = {
  url: 'https://www.dropbox.com',
  api: '/1/oauth2/authorize',
  responseType: 'code',
  clientId: 'ndd7wtqyiu0y4vb',
  redirectUri: 'http://localhost:18080/dropboxAuth',
  state: 'narksdropboxapp'
};

var combinedUrl = _.str.sprintf('%(api)s?response_type=%(responseType)s&client_id=%(clientId)s&redirect_uri=%(redirectUri)s', urlComponents);

// var options = {
//   hostname: urlComponents.url,
//   path: combinedUrl,
//   method: 'GET',
//   port: 443
// };

// var req = http.request(options, function (res) {
//   var result = '';
// });

// var url = 'https://api.dropbox.com/1/oauth2/token?code=yQvSrFDOkPYAAAAAAAAAECtW3wQIx6SBkaMqRzgmaQU&grant_type=authorization_code&client_id=ndd7wtqyiu0y4vb&client_secret=p4gqaj9sn2yjkol';

// var options = {
//   hostname: 'api.dropbox.com',
//   path: '/1/oauth2/token?code=yQvSrFDOkPYAAAAAAAAAEWTpQRKhAwz_Nlxy-ytkTsE&grant_type=authorization_code&client_id=ndd7wtqyiu0y4vb&client_secret=p4gqaj9sn2yjkol&redirect_uri=http://localhost:18080/dropboxAuth',
//   method: 'POST',
//   port: 443
// };

// var req = http.request(options, function (res) {
//   var result = '';
//   res.on('data', function (chunk) {
//     result += chunk;
//   });
//   res.on('end', function () {
//     console.log(result);
//   });
// });
// req.write('');
// req.end();

module.exports.authUrl = urlComponents.url + combinedUrl;