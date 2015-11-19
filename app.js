var codeObjects = {};

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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

// routes setup 

var list = require('./routes/list')(codeObjects);
var playground = require('./routes/playground');
var create = require('./routes/create');
var workshop = require('./routes/workshop');

app.use('/', create);
app.use('/playground/', playground);
app.use('/list', list);
app.use('/workshop', workshop);

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

function makeFullUpdate(playground) {
  var objectIds = Object.keys(codeObjects[playground]);
  return {playgroundId: playground, objectIds: objectIds};
}

app.io.route('programmer up', function (req) { // server gets notified when programmer.html page is loaded
  var playground = req.data;

  req.io.join(req.data); // have client (req) join the room named after Playground Id

  if (codeObjects[playground]) {
    req.io.emit('objects full update', makeFullUpdate(playground));
  }
});

app.io.route('playground up', function(req) {
  console.log(req.data + " from playground renderer");
  req.io.join(req.data);

  if (!codeObjects[req.data]) return;

  req.io.emit('playground full update', codeObjects[req.data]);
});

app.io.route('code update', function(req) { // Broadcast the code update event on the playground up route, only to the room (playground) concerned.
  var playground = req.data.playgroundid;

  console.log(playground + " from programmer");
  req.io.join(playground); // it seems we need to join the room to broadcast

  if (!codeObjects[playground]) codeObjects[playground] = {};
  codeObjects[playground][req.data.codeid] = req.data.code;

  req.io.room(playground).broadcast('code update', req.data);
  app.io.room(playground).broadcast('objects full update', makeFullUpdate(playground));
});

app.io.route('request code', function (req) {
  var playground = req.data.playgroundId,
      objectId = req.data.objectId,
      code = getCode(playground, objectId),
      data = {playgroundId: playground, objectId: objectId, code: code};

  req.io.emit('source code', data);
});

var getCode = function (playground, objectId) {
  if (! codeObjects[playground]) return "";
  if (! codeObjects[playground][objectId]) return "";

  return codeObjects[playground][objectId];
};

module.exports = app;
