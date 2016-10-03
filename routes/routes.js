module.exports = function(app, passport){

  // Routes
  // router middelware
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    res.redirect('/')
  }

  // Sign up
  app.get('/', function(req, res){
    res.render('signup', { message: req.flash('loginMessage') });
  });

  // Sign up
  app.post('/', passport.authenticate('local-signup', {
    successRedirect : '/home',
    failureRedirect : '/',
    failureFlash: true
  }));

  // Login
  app.get('/login', function(req, res){
    res.render('login', { message: req.flash('loginMessage') });
  });

  // Login
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home',
    failureRedirect : '/login',
    failureFlash: true
  }));

  //fb login
  app.get('/auth/facebook', passport.authenticate('facebook'));

  //fb callback
  app.get('/auth/facebook/callback', passport.authenticate('facebook',{
      successRedirect : '/home',
      failureRedirect : '/login',
      failureFlash: true
    }));

      // Secret
  app.get('/home', isLoggedIn, function(req, res){
    res.render('home', { message: req.flash('loginMessage') });
  });

  // logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}