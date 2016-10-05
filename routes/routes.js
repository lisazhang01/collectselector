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

  var hasKey = function (obj) {
    for (var key in obj) {
      return true
    }

    return false
  };

// Getting query info from selection
  app.get('/test', function(req, res){
    var query     = hasKey(req.query) ? req.query : {s: "all", hs: 1};
    var ncesQuery = "";

    for (var key in query) {
      ncesQuery += key + "=" + query[key] + "&";
    }

    console.log(ncesQuery);

    //Setting up data collecting system
    var http = require('http');
    var fs   = require('fs');

    var file    = fs.createWriteStream("tmp/file.csv"); //Create new empty file ?s=all&tv=200&xv=380
    var request = http.get("http://nces.ed.gov/collegenavigator/default.aspx?"+ncesQuery + "xp=2", function(response) {
      file.on("close", function(){
        var colleges = []; //Create empty array

        require("fast-csv").fromPath("tmp/file.csv", {headers: true}).on("data", function(data){
          if (data["Name"]) {
            colleges.push(data); //Push data into array if college has name
          }
        }).on("end", function(){
          res.render('home', {colleges: colleges}); //Send array to front end
          // res.send(colleges); //Send array to front end
        });
      });

      response.pipe(file); //Request info from website, using code for each variable
    });
  });


}

