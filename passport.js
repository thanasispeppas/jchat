/*
 * passport.js
 * 
 * configure passport
 * http://passportjs.org/guide/configure/
 * use local strategy with persistent sessions
*/ 
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function(passport) {

  
  // login
  passport.use('local-login', new LocalStrategy({ passReqToCallback : true },
    function(req, username, password, done) {
      User.findOne({ username: username }, function (err, user) {
	if (err) { return done(err); }
	if (!user) {
	  return done(null, false, { message: "incorrect username" });
	}
	if (!user.validPassword(password)) {
	  return done(null, false, { message: "incorrect password" });
	}
	return done(null, user);
      });
    }
  ));


  // signup
  passport.use('local-signup', new LocalStrategy({ passReqToCallback : true },
    function(req, username, password, done) {
      if (req.body.username && req.body.email) {
	User.findOne({ username:  req.body.username }, function(err, user) {
	  if (err) {
	    console.log(err);
	    return done(null, false, { message: err });
	  }
	  // check if username already exists
	  if (user) {
	    return done(null, false, { message: "Username exists" });
	  } else {
	    // create new user
	    console.log("Creating new user...");
	    var newUser = new User();
	    newUser.username = req.body.username;
	    newUser.email = req.body.email;
	    newUser.password = newUser.generateHash(req.body.password);
	    newUser.save(function(err) {
	      if (err) {
		console.log(err);
		return done(null, false, { message: err });
	      }
	      console.log("New user created: " + newUser.username);
	      return done(null, newUser);
	    });
	  }
	});
      }
    }
  ));
  

  // serialize User
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  
  // deserialize User
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
};
