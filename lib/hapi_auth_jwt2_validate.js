var redisClient = require('redis-connection')(); // instantiate redis-connection
// bring your own validation function
module.exports = function validate (decoded, request, callback) {
  console.log(" - - - - - - - DECODED token:");
  console.log(decoded);
  // do your checks to see if the session is valid
  redisClient.get(decoded.id, function (rediserror, reply) {
    var profile;
    if(!rediserror && reply) {
      profile = JSON.parse(reply);
      console.log(' - - - - - - - REDIS reply - - - - - - - ');
      console.log( JSON.stringify(profile, null, 2) );
      return callback(rediserror, true);
    }
    else { // unable to find session in redis ... reply is null
      console.log(rediserror);
      return callback(rediserror, false);
    }
  });
};
