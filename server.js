require('env2')('.env');
var assert = require('assert');
var Hapi   = require('hapi');
var Handlebars = require('handlebars');
var Wreck  = require('wreck');
var wreck = Wreck.defaults({
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0' }
});

var server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: Number(process.env.PORT)
});

var opts = {
  REDIRECT_URL: '/githubauth',  // must match google app redirect URI
  handler: require('./lib/github_oauth_handler.js'), // your handler
  SCOPE: 'user, repo, read:org' // see: developer.github.com/v3/oauth/#scopes
};

var hapi_auth_github = require('hapi-auth-github');
var hapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
// list our require plugins
var plugins = [
	{ register: hapi_auth_github, options:opts },
	hapiAuthJWT,
  require('vision')
];
server.register(plugins, function (err) {
  // handle the error if the plugin failed to load:
  assert(!err, "FAILED TO LOAD PLUGIN!!! :-("); // fatal error
	// see: http://hapijs.com/api#serverauthschemename-scheme
  server.auth.strategy('jwt', 'jwt', true,
  { key: process.env.JWT_SECRET,
    validateFunc: require('./lib/hapi_auth_jwt2_validate.js'),
    verifyOptions: { ignoreExpiration: true } // session is valid for evs
  });
});

server.views({
  engines: {
    html: Handlebars
  },
  path: __dirname + '/views/',
  layout: 'layout',
  // helpersPath: 'helpers',
  // partialsPath: 'partials'
});

server.route([
{
  method: 'GET',
  path: '/',
	config: { auth: { strategy: 'jwt', mode:'try' } },
  handler: function(req, reply) {
    console.log('  - - - - - - - - > req.auth.credentials:')
    console.log(req.auth.credentials);
		var url = hapi_auth_github.login_url();
    console.log(url);
		var src = 'https://cloud.githubusercontent.com/assets/194400/11214293/4e309bf2-8d38-11e5-8d46-b347b2bd242e.png';
		var btn = '<a href="' + url + '"><img src="' + src + '" alt="Login With GitHub"></a>';
    reply(btn);
  }
},
{
	method: 'GET',
  path: '/issues',
	config: { auth: 'jwt' },
  handler: function(req, reply) {
    console.log(' - - - - - - - - - - - - - - - - - - access_token:');
    var access_token = req.auth.credentials.tokens.access_token;
    console.log(access_token);
    var url = ' https://api.github.com/issues?page=2&access_token='+access_token;
    console.log(' - - - - - - - - - - - - - - - - - - url:');
    console.log(url);
    wreck.get(url, function (err, res, payload) {
      console.log(' - - - - - - - - - - - - - - - - - - PAYLOAD:');
      console.log(payload);
      console.log(' - - - - - - - - - - - - - - - - - - RESPONSE:');
      console.log(res);
      // console.log(res.headers['link']);
      // var links = parse_links(res.headers);
      // console.log(links);
      // var issues = JSON.parse(payload);
      // console.log(' - - - - - - - - - - >>> count: '+issues);
      reply('<pre><code>' + payload + '</code></pre>' );
    });
  }
},
{
	method: 'GET',
  path: '/profile',
	config: { auth: 'jwt' },
  handler: require('./lib/profile_handler.js')
}
]);

server.start(function(err){ // boots your server
  assert(!err, "FAILED TO Start Server");
	console.log('Now Visit: http://localhost:'+server.info.port);
});

module.exports = server;
