var debug = require('debug')('paysage:app');

var World = require('./World');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

module.exports = function(world) {
  var app = express();
  var world = world ? world : new World();

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
  var list = require('./routes/list')(world);
  var playground = require('./routes/playground');
  var create = require('./routes/create');
  var workshop = require('./routes/workshop');

  app.use('/', create);
  app.use('/playground/', playground);
  app.use('/list', list);
  app.use('/workshop', workshop);

  var server = require('http').createServer(app);
  var io = require('socket.io')(server);


  function getListOfAllObjects(playground) {
    return {playgroundId: playground.id, objectIds: playground.population()};
  }

  function broadcastObjectList(playground) {
    io.to(playground.id).emit('objects list', getListOfAllObjects(playground));
  }

  io.on('connection', function(socket) {
    var query = socket.handshake.query;
    var playgroundId = query.playgroundId;
    var client =  query.client;

    if (client == 'programmer' || client == 'workshop')
      programmerUp();
    else
      rendererUp();

    function programmerUp() {
      debug("a new programmer is up for " + playgroundId);

      socket.join(playgroundId);

      if (!world.contains(playgroundId)) return;
      var playground = world.getOrCreatePlayground(playgroundId);

      socket.emit('objects list', getListOfAllObjects(playground));
    }


    function rendererUp() {
      debug("a new renderer is up for " + playgroundId);

      socket.join(playgroundId);

      if (!world.contains(playgroundId)) return;
      var playground = world.getOrCreatePlayground(playgroundId);

      var data = Object.create(null);
      playground.population().forEach(function(codeObjectId) {
        data[codeObjectId] = { code: playground.getOrCreateCodeObject(codeObjectId).code() };
      });
      socket.emit('playground full update', data);
    }

    socket.on('code update', function(data) {
      debug(data.objectId + " for " + data.playgroundId + " from " + data.client);

      var codeObject = world.getOrCreatePlayground(data.playgroundId).getOrCreateCodeObject(data.objectId);

      codeObject.mediatype = data.mediatype;
      codeObject.client = data.client;
      codeObject.setCode(data.code);
    });

    socket.on('code delete', function(data) {
      debug("deleting " + data.objectId + " from playground " + data.playgroundId);

      if (!world.contains(data.playgroundId)) return;
      var playground = world.getOrCreatePlayground(data.playgroundId);

      playground.deleteCodeObject(data.objectId);
    });

    socket.on('request code', function(data) {
      debug(data.objectId + " for " + data.playground + " programmer" ) ;

      if (!world.contains(data.playgroundId)) return;
      var playground = world.getOrCreatePlayground(data.playgroundId);
      if (!playground.contains(data.objectId)) return;
      var codeObject = playground.getOrCreateCodeObject(data.objectId);

      var data = {
        playgroundId: codeObject.playground.id,
        objectId: codeObject.id,
        code: codeObject.code()
      }
      socket.emit('source code', data);
    });
  });

  world.on('codeObjectUpdated',function(codeObject) {
    var playground = codeObject.playground;
    io.to(playground.id).emit('code update', {
      objectId: codeObject.id,
      code: codeObject.code()
    });
    broadcastObjectList(codeObject.playground);
  });

  world.on('codeObjectDeleted',function(codeObject) {
    var playground = codeObject.playground;
    io.to(playground.id).emit('code delete', {
      playgroundId: playground.id,
      objectId: codeObject.id
    });
    broadcastObjectList(playground);
  });

  return server;
}
