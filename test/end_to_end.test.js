var dir  = __dirname.split('/')[__dirname.split('/').length-1];
var file = dir + __filename.replace(__dirname, '') + " > ";
var test = require('tape');
var nock = require('nock');
var fs   = require('fs');
var JWT  = require('jsonwebtoken');
var redisClient = require('redis-connection')(); // instantiate redis-connection

var server = require('../server.js');

test(file+'Visit / root url expect to see a login link', function(t) {
  var options = {
    method: "GET",
    url: "/"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    console.log(response.result);
    t.ok(response.result.indexOf('Login With GitHub') > -1, 'Login with GitHub Link on Page')
    setTimeout(function(){ server.stop(t.end); }, 100);
  });
});

// test a bad code does not crash the server!
test(file+'GET /githubauth?code=oauth2codehere', function(t) {
  var options = {
    method: "GET",
    url: "/githubauth?code=badcode"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 401, "Bad Code is Rejected (as expected)");
    t.ok(response.payload.indexOf('something went wrong') > -1,
          'Got: '+response.payload + ' (as expected)');
    server.stop(t.end);
  });
});

var COOKIE; // we get this in the response in the next test:

test(file+'MOCK GitHub OAuth2 Flow /githubauth?code=mockcode', function(t) {
  // google oauth2 token request url:
  var token_fixture = fs.readFileSync('./test/fixtures/sample_access_token.json');
  nock('https://github.com')
    .persist() // https://github.com/pgte/nock#persist
    .post('/login/oauth/access_token')
    .reply(200, token_fixture);

  // see: http://git.io/v4nTR for google plus api url
  // https://www.googleapis.com/plus/v1/people/{userId}
  var sample_profile = fs.readFileSync('./test/fixtures/sample_profile.json');
  nock('https://api.github.com')
    .get('/user')
    .reply(200, sample_profile);

  var options = {
    method: "GET",
    url: "/githubauth?code=mockcode"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Profile retrieved (Mock)");
    var expected = 'Logged in Using GitHub';
    t.ok(response.payload.indexOf(expected) > 1, "Got: " + expected + " (as expected)");
    COOKIE = response.headers['set-cookie'][0]; //.split('=')[1];
    // console.log(' - - - - - - - - - - - - - - - - - - COOKIE:');
    // console.log(COOKIE);
    // console.log(' - - - - - - - - - - - - - - - - - - decoded:');
    // console.log(JWT.decode(COOKIE));
    server.stop(t.end);
  });
});

test(file+'Visit /issues using JWT Cookie', function(t) {
  var options = {
    method: "GET",
    url: "/issues",
    headers: { cookie: COOKIE }
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    // setTimeout(function(){ server.stop(t.end); }, 100);
    server.stop(function(){
      t.end()
    });
  });
});

test(file+'Visit /issues with invalid JWT Cookie', function(t) {
  var token = JWT.sign({ id: 321, "name": "Charlie" }, process.env.JWT_SECRET);
  var options = {
    method: "GET",
    url: "/issues",
    headers: { cookie: "token=" + token }
  };
  server.inject(options, function(response) {
    console.log(' - - - - - - - - - - - - - - - - - - result:');
    console.log(response.result);
    t.equal(response.statusCode, 401, "Auth Blocked by bad Cookie JWT");
    // setTimeout(function(){ server.stop(t.end); }, 100);
    server.stop(function(){
      t.end()
    });
  });
});

test(file+'View /profile', function(t) {
  // console.log(' - - - - - - - - - - - - - - - - - - COOKIE:');
  // console.log(COOKIE);

  var decoded = JWT.decode(COOKIE.replace('token=',''));

  // console.log(' - - - - - - - - - - - - - - - - - - DECODED:');
  // console.log(decoded);

  redisClient.get(decoded.id, function(rediserror, redisreply){
    var profile = JSON.parse(redisreply);
    var access_token = profile.tokens.access_token;
    // console.log(' - - - - - - - REDIS reply - - - - - - - ');
    // console.log( JSON.stringify(profile, null, 2) );

    var sample_profile = fs.readFileSync('./test/fixtures/sample_profile.json');
    nock('https://api.github.com')
      .get('/user?access_token='+access_token)
      .reply(200, sample_profile);

    var options = {
      method: "GET",
      url: "/profile",
      headers: { cookie: COOKIE }
    };

    server.inject(options, function(response) {
      // console.log(' - - - - - - - - - - - - - - - - - - result:');
      // console.log(response.result);
      t.equal(response.statusCode, 200, "Profile");
      // setTimeout(function(){ server.stop(t.end); }, 100);
      server.stop(function(){
        redisClient.end();   // ensure redis con closed! - \\
        t.equal(redisClient.connected, false, "✓ Connection to Redis Closed");
        t.end()
      });
    });

  }); // end redisClient.get
});
