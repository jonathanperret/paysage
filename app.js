var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var playground = require('./routes/playground');

var app = require('express.io')();

var cons = require('consolidate');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', cons.handlebars);
app.set('view engine', 'hbs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/users', users);

// for any URL other than static route use routes/playground.js
app.use('/', playground);


// /// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// /// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

// attach socket.io to the http server
app.http().io();

// Broadcast the code update event on the playground up route, only to the room (playground) concerned.

var codeObjects = {};

app.io.route('playground up', function(req) {
    console.log(req.data + " from playground renderer");
    req.io.join(req.data);

    if (!codeObjects[req.data]) return;

    req.io.emit('full update', codeObjects[req.data]);
});

app.io.route('code update', function(req) {
    var playground = req.data.playgroundid;

    console.log(playground + " from programmer");
    req.io.join(playground); // it seems we need to join the room to broadcast

    if (!codeObjects[playground]) codeObjects[playground] = {};
    codeObjects[playground][req.data.codeid] = req.data.code;

    req.io.room(playground).broadcast('code update', req.data);
});

// Broadcast the code update event on ready route.
// app.io.route('ready', function(req) {
//   console.log(req.data);
//   req.io.broadcast('code update', req.data);
// });

module.exports = app;
