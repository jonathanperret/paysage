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

/* app.use(function(req, res, next) {
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
// }); */

// attach socket.io to the http server
app.http().io();


var getCode = function (playground, objectId) {
    if (!codeObjects[playground]) return "";
    if (!codeObjects[playground][objectId]) return "";

    return codeObjects[playground][objectId].code;
};



var getListOfAllObjects = function (playground) {
    var objectIds = Object.keys(codeObjects[playground]);
    return {playgroundId: playground, objectIds: objectIds};
};

var getListOfObjectsFromClient = function (playground, client) {

    var allObjects = codeObjects[playground];
    var selectedObjects = {playgroundId: playground, objectIds: [] };

    for (var object in allObjects) {
        if (object.client == client) {
            var ID = Object.keys(object)[0];
            selectedObjects.objectIds.push(ID);
        }
    }
    return selectedObjects;
};


app.io.route('programmer up',
    function sendProgrammerTheObjectsList(req) {
        var playground = req.data;
        console.log("a new programmer is up for " + playground);

        req.io.join(req.data); // have client (req) join the room named after Playground Id

        if (codeObjects[playground]) {
            req.io.emit('objects list', getListOfAllObjects(playground));
        }
    });

app.io.route('playground up',
    function sendPlaygroundAllCodeObjects (req) {
        console.log(req.data + " playground: a new renderer page is up");
        req.io.join(req.data);

        if (!codeObjects[req.data]) return;

        req.io.emit('playground full update', codeObjects[req.data]);
    });

app.io.route('code update',
    function saveNewCodeThenBroadcastCodeAndList(req) {
        var playgroundId = req.data.playgroundId;
        var objectId = req.data.objectId;

        console.log(objectId + " for " + playgroundId + " from " + req.data.client);
        req.io.join(playgroundId); // we join the room to broadcast

        if (!codeObjects[playgroundId]) codeObjects[playgroundId] = {};
        
        codeObjects[playgroundId][objectId] = {};
        codeObjects[playgroundId][objectId].mediatype = req.data.mediatype;
        codeObjects[playgroundId][objectId].client = req.data.client;
        codeObjects[playgroundId][objectId].code = req.data.code;

        req.io.room(playgroundId).broadcast('code update', req.data);
        app.io.room(playgroundId).broadcast('objects list', getListOfAllObjects(playgroundId));
    });

app.io.route('request code',
    function sendProgrammerTheCodeObject(req) { 
        var playground = req.data.playgroundId;
        var objectId = req.data.objectId;
        var code = getCode(playground, objectId);
    
        var data = { playgroundId: playground, objectId: objectId, code: code };
    
        console.log(objectId + " for " + playground + " programmer" ) ;

        req.io.emit('source code', data);
    });

module.exports = app;