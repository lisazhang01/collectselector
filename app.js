var express      = require('express');
var path         = require('path');
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// Init app
var app = express();

// Init middel-ware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect with Mongo DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/passport');

//Require models
var User = require('./model/user');
// var Colleges = require('./model/collegesdb');

//support static files
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set( 'views', path.join(__dirname, 'views'));
app.set( 'view engine', 'pug');

// Setup sessions
app.use(session( {
  secret: 'ilovewdi',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Setup local-strategy
require('./config/passport')(passport);

// Routes
require('./routes/routes')(app, passport);

//listen
app.listen( process.env.PORT || 3000 , function(){
  console.log('listening on port ' + process.env.PORT || 3000);
});


