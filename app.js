var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var THREE = require('three');

// var index = require('./routes/index');
var users = require('./routes/users');
var routes = require('./routes/main.js');

var settings = require('./settings');

var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

//chat room added @author mjt
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//game class added @author mjt
var MovableObject = require('./ServerClasses/MovableObject');
var Boat = require('./ServerClasses/Boat');

//global vars @author mjt
var boatMap = {};
var bulletMap = {};
var staticMap = {};

app.use(flash());
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, //30days
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port,
        url: 'mongodb://localhost/player' //要加一个url,
    })
}));

// view engine setup
app.set('port', process.env.PORT || 2017);
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

server.listen(app.get('port'), function() {
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

//char room added @author mjt
var numUsers = 0;
io.on('connection', function(socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function(data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function(username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function() {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function() {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });

            //退出用 @author mjt
            //退出时 将船数据记录在数据库中 taishi!!!
            console.log(socket.username + " quit");
            delete boatMap[socket.username];
            io.emit('quit', socket.username);
        }
    });


    //同步用
    socket.on('start', function(playerID) {
        //get corresponding boat info 
        //若db中无相应的船，返回一个新船（如下）taishi!!!

        var boat = new Boat(playerID);
        var boatData = boat.getData();
        boatMap[playerID] = boat;
        console.log(playerID + ' start');
        io.emit('get boat', boatData);

        //
        socket.emit("static update", staticMap); //自己获取static数组
    });

    socket.on('update', function(data) {
        //整合信息
        //Boat, 已实现对当前船进行更新
        var userBoatData = data;
        var userBoatId = userBoatData.playerID;
        if (boatMap[userBoatId] === undefined) {
            boatMap[userBoatId] = new Boat(userBoatId);
        }
        boatMap[userBoatId].update(userBoatData);

        //staticHit 同理

        var boatMapData = generateData(boatMap);
        io.emit('load', {
            boatMap: boatMapData,
            bulletMap: bulletMap,
            staticMap: staticMap
        });
    });
    var generateData = function(map) {
        var ret = {};
        for (var id in map) {
            ret[id] = map[id].getData();
        }
        return ret;
    };

    // operations of bullets
    socket.on('fire', function(bulletData) {
        //将该子弹传给每个client
        bulletMap[bulletData.playerID] = bulletData;
        io.emit('fire', bulletData);
    });


    socket.on('delete static', function(staticID) {
        delete boatMap[staticID];
        io.emit('delete static', staticID);
    });



});


refreshStaticMap(1500, 1500);
setInterval(function() {
    refreshStaticMap(1500, 1500);
    io.emit("static update", staticMap);
}, 50000);

function refreshStaticMap(length, width) {
    staticMap = {};
    var i, len = Object.getOwnPropertyNames(boatMap).length;
    if (len === 0) len = 1;

    for (i = 0; i < len * 13; i++) {
        var x = length * Math.random();
        var z = width * Math.random();
        staticMap[i] = { x: x, z: z };
    }
}


//船同步 completed
//子弹同步 completed
//