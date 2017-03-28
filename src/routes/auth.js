var jwt = require('jwt-simple');
var logger = require('../utils/logger');
var mongodb = require('../mongodb');

var auth = {

  login: function(req, res) {
    logger.debug("***** login ********");

    var username = req.body.username || '';
    var password = req.body.password || '';
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    var dbUserObj = null;

    auth.validate(username, password, function(err, user){
      dbUserObj = user;

      if (!dbUserObj) { // If authentication fails, we send a 401 back
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }

      if (dbUserObj) {

        // If authentication is success, we will generate a token
        // and dispatch it to the client

        res.json(genToken(dbUserObj));
      }
    });

  },

  validate: function(username, password, callback) {
    logger.debug("***** validate " + username + "********");
    // spoofing the DB response for simplicity
    var dbUserObj = null;

    mongodb.mongoFindUser(username, function(err, userArray) {
      if (err){
        callback(err);
      }

      var user = userArray[0];

      if (user.pswd === password && user.username === username){
        dbUserObj = {
          name: user.name,
          role: user.role,
          username: user.username
        };
      };
      callback(null, dbUserObj);
    });

  },

  validateUser: function(username) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB.
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };
    console.log("*******************************************");
    console.log("  IN VALIDATE USER " + username );
    console.log("*******************************************");
    return dbUserObj;
  },
}

// private method
function genToken(user) {
  logger.debug("***** getToken ********");
  var expires = expiresIn(0.01); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  logger.debug("***** expiresIn ********");
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
