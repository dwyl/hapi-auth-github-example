var Wreck  = require('wreck');
var wreck = Wreck.defaults({
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0' }
});

module.exports = function profile_handler (req, reply) {
 // console.log(' - - - - - - - - - - - - - - - - - - credentials:');
 // console.log(req.auth.credentials)
 var access_token = req.auth.credentials.tokens.access_token;
 console.log(access_token);
 var url = ' https://api.github.com/user?access_token='+access_token;
 console.log(' - - - - - - - - - - - - - - - - - - url:');
 console.log(url);

 wreck.get(url, function (err, res, payload) {
   payload = JSON.parse(payload.toString());
   // console.log(' - - - - - - - - - - - - - - - - - - PAYLOAD:');
   // console.log(payload);
   // reply('<pre><code>' + payload + '</code></pre>' );
   return reply.view('profile', payload);
 });
}
