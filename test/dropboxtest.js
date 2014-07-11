var http = require('https');

var url = 'https://api.dropbox.com/1/oauth2/token?code=yQvSrFDOkPYAAAAAAAAAECtW3wQIx6SBkaMqRzgmaQU&grant_type=authorization_code&client_id=ndd7wtqyiu0y4vb&client_secret=p4gqaj9sn2yjkol';

var options = {
  hostname: 'api.dropbox.com',
  path: '/1/oauth2/token?code=yQvSrFDOkPYAAAAAAAAAEWTpQRKhAwz_Nlxy-ytkTsE&grant_type=authorization_code&client_id=ndd7wtqyiu0y4vb&client_secret=p4gqaj9sn2yjkol&redirect_uri=http://localhost:18080/dropboxAuth',
  method: 'POST',
  port: 443
};

var req = http.request(options, function (res) {
  var result = '';
  res.on('data', function (chunk) {
    result += chunk;
  });
  res.on('end', function () {
    console.log(result);
  });
});
req.write('');
req.end();