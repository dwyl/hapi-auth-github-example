var redisClient = require('redis-connection')(); // instantiate redis-connection
// bring your own validation function
module.exports = function validate (decoded, request, callback) {
  console.log(" - - - - - - - DECODED token:");
  console.log(decoded);
  // do your checks to see if the session is valid
  redisClient.get(decoded.id, function (rediserror, reply) {
    if(rediserror) {
      console.log(rediserror);
    }
    console.log(' - - - - - - - REDIS reply - - - - - - - ');
    var profile;
    if(reply) {
      profile = JSON.parse(reply);
      console.log( JSON.stringify(profile, null, 2) );
      return callback(rediserror, true);
    }
    else { // unable to find session in redis ... reply is null
      return callback(rediserror, false);
    }
  });
};
