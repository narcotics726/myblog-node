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

module.exports.authUrl = urlComponents.url + combinedUrl;