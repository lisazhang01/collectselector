// Load passport local
var localStrategy = require('passport-local').Strategy;

//load passport fb
var facebookStrategy = require('passport-facebook').Strategy;

//load passport twitter
var twitterStrategy = require('passport-twitter').Strategy;

// Load validator
var validator = require('validator');

// Load user model
var User = require('../model/user');

module.exports = function( passport ) {

  // Serialize user
  passport.serializeUser( function( user, done){
      done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user);
      });
  });

  // Passport signup
  passport.use('local-signup', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function( req, email, password, done){

        // Check that the email is in the right format
        if( !validator.isEmail(email) ){
          return done(null, false, req.flash('loginMessage','That is not a valid email address'));
        }

        // Check that the password is at least 8 chars
        if( password.length < 8 ){
          return done(null, false, req.flash('loginMessage','The password needs to be 8 chars long'));
        }

        process.nextTick(function(){
          User.findOne( {'local.email' : email }, function(err, user){
            if(err){
              return done(err);
            }
            if(user){
              return done(null, false, req.flash('loginMessage','That email is already in use'));
            }else{
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);
              newUser.save(function(err){
                if(err){
                  console.log(err);
                }
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }
          });
        });
    }));

  // Passport login
  passport.use('local-login', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function( req, email, password, done){
        process.nextTick(function(){
          User.findOne( {'local.email' : email }, function(err, user){
            if(err){
              return done(err);
            }

            if(!user){
              return done(null,false, req.flash('loginMessage', 'sorry no one by that email'));
            }

            if(!user.validPassword(password)){
              return done(null,false, req.flash('loginMessage', 'sorry wrong password'));
             }

            return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
          });
        });
    }));

//fb strategy
  passport.use(new facebookStrategy({
    clientID: '1768552963414827',
    clientSecret: '2c88da7bd0bba554aa633a0d9df8d4d4',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback:true
  }, function(req, accessToken, refreshToken, profile, done){

      process.nextTick(function(){
        User.findOne( {'facebook.id': profile.id}, function(err, user){
          if(err){
            return done(err);
          }
          if(user){
            return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
          }else{
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name = profile.displayName;

            newUser.save(function(err){
              if(err){
                console.log(err);
              }
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }
          });
      });
    }));

  //twitter strategy
  passport.use(new twitterStrategy({
    consumerKey: 'XqqFkWeaAxxCcgjowoFgMfsdS',
    consumerSecret: 'Q5oZYwQia4d95zJAQdCCE2iHhcG5sqyREKDGwcIYeGFzR8WTgu',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
    passReqToCallback:true
  }, function(req, token, tokenSecret, profile, done){

      console.log(profile);

      process.nextTick(function(){
        User.findOne({'twitter.id': profile.id}, function(err, user){
          if(err){
            return done(err);
          }
          if(user){
            return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
          }else{
            var newUser = new User();
            newUser.twitter.id       = profile.id;
            newUser.twitter.token    = token;
            newUser.twitter.secret   = tokenSecret;
            newUser.twitter.name     = profile.displayName;
            newUser.twitter.username = profile.username;
            newUser.twitter.img      = profile.photos[0].value;
            newUser.save(function(err){
              if(err){
                console.log(err);
              }
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }
          });
      });
    }));

}