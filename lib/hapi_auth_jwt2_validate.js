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
    console.log(' - - - - - - - REDIS reply - - - - - - - ', reply);
    var session;
    if(reply) {
      session = JSON.parse(reply);
    }
    else { // unable to find session in redis ... reply is null
      return callback(rediserror, false);
    }

    if (session.valid === true) {
      return callback(rediserror, true);
    }
    else {
      return callback(rediserror, false);
    }
  });
};
