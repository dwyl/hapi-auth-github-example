var redisClient = require('redis-connection')(); // instantiate redis-connection
var JWT         = require('jsonwebtoken'); // session stored as a JWT cookie

module.exports = function custom_handler(req, reply, tokens, profile) {
  if(profile) {
    console.log(JSON.stringify(profile, null, 2));
    // extract the relevant data from Profile to store in JWT object
    var session = {
      fistname : profile.name,          // the person's name e.g: Anita
      image    : profile.avatar_url,    // profile image url
      id       : profile.id,            // their github id
      // exp      : Math.floor(new Date().getTime()/1000) + 7*24*60*60, // Epiry in seconds!
      agent    : req.headers['user-agent']
    }
    // create a JWT to set as the cookie:
    var token = JWT.sign(session, process.env.JWT_SECRET);
    // store the Profile and Oauth tokens in the Redis DB using github id as key
    profile.tokens = tokens; // save the OAuth Token for later
    redisClient.set(profile.id, JSON.stringify(profile), function(err){
      // reply to client with a view
      var link = '<a href="/issues">see issues</a>'
      return reply("Hello " +profile.name + ", You Logged in Using GitHub! "+link)
      .state('token', token); // see: http://hapijs.com/tutorials/cookies
    })
  }
  else {
    return reply("Sorry, something went wrong, please try again.").code(401);
  }
}
