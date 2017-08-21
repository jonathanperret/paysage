var debug = require('debug')('paysage:app');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

module.exports = function(someCodeObjects) {

  var codeObjects = someCodeObjects || {};
  var app = express();

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

  if (! process.env.TESTING) app.use(logger('dev'));
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

  var server = require('http').createServer(app);
  var io = require('socket.io')(server);

  function getCode(playgroundId, objectId) {
    if (!codeObjects[playgroundId]) return "";
    if (!codeObjects[playgroundId][objectId]) return "";

    return codeObjects[playgroundId][objectId].code;
  }

  function getListOfAllObjects(playgroundId) {
    var objectIds = Object.keys(codeObjects[playgroundId]);
    return {objectIds: objectIds};
  }

  function broadcastObjectList(playgroundId) {
    io.to(playgroundId).emit('objects list', getListOfAllObjects(playgroundId));
  }

  io.on('connection', function(socket) {
    var query = socket.handshake.query;
    var playgroundId = query.playgroundId;
    var client =  query.client;

    socket.join(playgroundId);

    if (client == 'renderer')
      rendererUp();
    else
      programmerUp();

    function programmerUp() {
      debug("a new programmer is up for " + playgroundId);

      if (!codeObjects[playgroundId]) return;
      socket.emit('objects list', getListOfAllObjects(playgroundId));
    }

    function rendererUp() {
      debug("a new renderer is up for " + playgroundId);

      if (!codeObjects[playgroundId]) return;
      socket.emit('playground full update', codeObjects[playgroundId]);
    }

    socket.on('code update', function(data) {
      var objectId = data.objectId;

      debug(objectId + " for " + playgroundId + " from " + client);

      if (!codeObjects[playgroundId]) codeObjects[playgroundId] = {};

      codeObjects[playgroundId][objectId] = {
        mediatype: data.mediatype,
        client: client,
        code: data.code
      };

      socket.broadcast.to(playgroundId).emit('code update', data);
      broadcastObjectList(playgroundId);
    });

    socket.on('code delete', function(data) {
      var objectId = data.objectId;

      if (!codeObjects[playgroundId]) return;

      debug("deleting " + objectId + " from playground " + playgroundId);

      delete codeObjects[playgroundId][objectId];

      socket.broadcast.to(playgroundId).emit('code delete', data);
      broadcastObjectList(playgroundId);
    });

    socket.on('request code', function(data) {
      var objectId = data.objectId;
      var code = getCode(playgroundId, objectId);

      var data = { playgroundId: playgroundId, objectId: objectId, code: code };

      debug(objectId + " for " + playgroundId + " programmer" ) ;

      socket.emit('source code', data);
    });
  });
  return server;
}
