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

// Connect with Mongo DB
mongoose.connect('mongodb://127.0.0.1/passport');

// Init middel-ware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// //Twitter controller
// require('./controller/twitter')(app,passport);

//listen
app.listen( 3000, function(){
  console.log('listening on port 3000');
});

// //Setting up data collecting system
// var http = require('http');
// var fs   = require('fs');

// var file = fs.createWriteStream("tmp/file.csv"); //Create new empty file
// var request = http.get("http://nces.ed.gov/collegenavigator/default.aspx?s=AK&l=91+92+93+94&ic=1&xp=2", function(response) {
//   response.pipe(file); //Request info from website, using code for each variable

//   var colleges = []; //Create empty array
//   require("fast-csv").fromPath("tmp/file.csv", {headers: true}).on("data", function(data){
//     if (data["Name"]) {
//       colleges.push(data); //Push data into array if college has name
//     }
//   }).on("end", function(){
//     console.log(colleges)
//     res.send(colleges) //Send array to front end
//   });
// });
