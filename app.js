var codeObjects = {};

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var expressio = require('./express.io');
var app = expressio();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    socketioClient: function() {
      if(process.env.NODE_ENV == 'production') {
        return 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/' + require('socket.io/package').version + '/socket.io.js';
      } else {
        return '/socket.io/socket.io.js';
      }
    },
  },
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.reference_url = process.env.REFERENCE_URL || "http://processingjs.org/reference/";

// routes setup 
var list = require('./routes/list')(codeObjects);
var playground = require('./routes/playground');
var create = require('./routes/create');
var workshop = require('./routes/workshop');

app.use('/', create);
app.use('/playground/', playground);
app.use('/list', list);
app.use('/workshop', workshop);

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
