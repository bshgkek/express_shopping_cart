var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
// has to be req after session
var mongoStore = require('connect-mongo')(session);
var credentials = require('./credentials');
var routes = require('./routes/index');
var userRoutes = require('./routes/user');



var app = express();


mongoose.connect('localhost:27017/shopping');

// runs through passport.js and runs code
require('./config/passport');


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// express-validator must be started after body parser 
// bc it requires a parsed body in order to validate it
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: credentials.sessionSecret, 
  resave: false, 
  saveUninitialized: false,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  // set to 3 hours, maxAge expects value in miliseconds
  cookie: {maxAge: 3 * 60 * 60 * 1000 }

}));
// flash needs to be initialized after session, bc flash uses session to store messages
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// if logged in, set global variable 
app.use(function(req, res, next) {
  // isAuthenticated provided by passport
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// other routes have to be before '/' 
// everything matches '/' and userRoutes wouldnt get used
app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
