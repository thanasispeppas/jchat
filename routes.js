/*
 * routes.js
 */

module.exports = function(app, passport, passportSocketIo, io) {
  

  // middleware
  app.use(function(req, res, next) {
    // log request
    user = (req.isAuthenticated() ? req.user.username : "no user" );
    console.log('%s %s %s %s', req.ip, user, req.method, req.url);
    next();
  });


  // signup
  app.route('/signup')
  
    .get(notAuthenticated, function(req, res) {
      res.render('signup.ejs');
    })
    .post(notAuthenticated, function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
	if (err) { return next(err); }
	if (!user) {
	  return res.render('signup.ejs', { flashMessage: info.message });
	}
	req.login(user, function(err) {
	  if (err) { return next(err); }
	  return res.redirect('/profile');
	});
      })(req, res, next);
    });


  // login
  app.route('/login')
  
    .get(notAuthenticated, function(req, res) {
      res.render('login.ejs');
    })
    .post(notAuthenticated, function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
	if (err) { return next(err); }
	if (!user) {
	  return res.render('login.ejs', { flashMessage: info.message });
	}
	req.login(user, function(err) {
	  if (err) { return next(err); }
	  return res.redirect('/');
	});
      })(req, res, next);
    });
  
  
  // logout
  app.route('/logout').get(authenticated, function(req, res){
    username = req.user.username;
    req.logout();
    res.render('login.ejs', { flashMessage: "logout successful"});
    
    // send the logged out message to any other open tabs by user
    passportSocketIo.filterSocketsByUser(io, function(user){
      return user.username === username;
    }).forEach(function(socket){
      socket.emit('logged out');
    });
  });
  

  // get home page
  app.route('/').get(authenticated, function(req, res) {
    res.render('index.ejs', { user : req.user });
  });

  
  // get profile page
  app.route('/profile').get(authenticated, function(req, res) {
    res.render('profile.ejs', { user : req.user });
  });

};

  
/*
 * middleware to check if user is authedicated before running a route handler
 */
function authenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};


function notAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) { return next(); }
  res.redirect('/');
};
