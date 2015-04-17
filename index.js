/*
 * index.js
 */ 

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var port = process.env.PORT || 3000;
var dbUrl = "mongodb://localhost/jchat";
var secret = "asecretphrase";


// connect to database
mongoose.connect(dbUrl);

// configure passport
require('./passport.js')(passport);

// use the ejs template engine
app.set('view engine', 'ejs');

// use bodyParser to read data from html forms
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// use the cookieParser
app.use(cookieParser(secret));

// configure session
var sessionStore = new MongoStore({ url : dbUrl });
app.use(session({
  secret: secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// configure socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);
var passportSocketIo = require("passport.socketio");

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: secret,
  store: sessionStore
}));

require('./socket.js')(io);

// routing
app.use(express.static(__dirname + '/public'));
require('./routes.js')(app, passport, passportSocketIo, io);

// start the server
server.listen(port);
console.log('express server started on port ' + port);
