module.exports = function(app, passport){

// router middelware
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/home')
  }

// Sign up
  app.get('/login', function(req, res){
    res.render('signup', { message: req.flash('loginMessage') });
  });

// Sign up
  app.post('/login', passport.authenticate('local-signup', {
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

//twitter login
  app.get('/auth/twitter', passport.authenticate('twitter'));

//twitter callback
  app.get('/auth/twitter/callback', passport.authenticate('twitter',{
      successRedirect : '/home',
      failureRedirect : '/login',
      failureFlash: true
    }));

// logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

//Check if key exists in obj
  var hasKey = function (obj) {
    for (var key in obj) {
      return true
    }
    return false
  };

// Getting query info from selection
  app.get('/home', function(req, res){
    var query     = hasKey(req.query) ? req.query : {s: "all", hs: 1}; // If query doesn't exist, use all for selection
    var ncesQuery = "";

    for (var key in query) {
      ncesQuery += key + "=" + query[key] + "&"; //Query string to pass into nces website
    }

//Setting up data collecting system
    var http = require('http');
    var fs   = require('fs');

    var file    = fs.createWriteStream("tmp/file.csv"); //Create new empty file ?s=all&tv=200&xv=380
    var request = http.get("http://nces.ed.gov/collegenavigator/default.aspx?"+ncesQuery + "xp=2", function(response) {
      var contentType = response.headers['content-type']; //To store the content type from the response e.g. text/html

      if (contentType.toLowerCase().includes("html")) { //Check if respnse is html or csv
        res.render('home', {colleges: [], message: "No Results, Please Refine Your Search"}); //if html render error msg
      } else {
        file.on("close", function(){ //Else if file is csv run code to gather and store search results
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

        file.on("error", function(err){ //If there is an error, return empty and err msg
          console.log(err)
          res.render('home', {colleges: [], message: "No Results, Please Refine Your Search"});
        });

        response.pipe(file); //Request info from website, using code for each variable
      }
    });
  });

//Saves each shortlisted college into user db
  app.post('/shortlist', function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var url = req.body.url;

    req.user.shortlist.push({
      'name': name,
      'address': address,
      'url': url
    });

    req.user.save(function(err, newUser){
      res.json(newUser.shortlist);
    });
  });

//Gets saved colleges for each user and renders onto shorlist page
  app.get('/shortlist', isLoggedIn, function(req,res){
    res.render('shortlist',{shortlist: req.user.shortlist});
  });

//Deletes item from shorlist
  app.delete('/shortlist/:id', isLoggedIn, function(req,res){
    var id        = req.params.id;
    var user      = req.user;
    var shortlist = user.shortlist;

    var listIndex = shortlist.findIndex(function(elem){
      console.log(elem._id == id, elem._id, id);
      if (elem._id == id) { //Checks if selected elem id is matched in db
        return true;
      } else {
        return false;
      }
    });

    if (listIndex >= 0) { //If elem index is found
      shortlist.splice(listIndex, 1); //Splice item
      user.shortlist = shortlist; //Update new list
      user.save(function(err, updatedUser){ //Save updated list
        res.json(updatedUser.shortlist);
      });
    } else {
      res.json({message: "Cannot find list"}).status(400);
    }
  });

} //end of module.export func
