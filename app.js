var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var THREE= require('three');

// var index = require('./routes/index');
var users = require('./routes/users');
var routes = require('./routes/main.js');

var settings=require('./settings');

var flash=require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.use(flash());
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge:1000*60*60*24*30}, //30days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port,
    url:'mongodb://localhost/blog' //要加一个url,
  })
}));

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
