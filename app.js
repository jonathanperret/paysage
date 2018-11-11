var debug = require('debug')('paysage:app');

var World = require('./World');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var lessMiddleware = require('less-middleware');

module.exports = function (maybeWorld) {
  var app = express();
  var world = maybeWorld || new World();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.engine('hbs', exphbs({
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      socketioClient: function () {
        if (process.env.NODE_ENV === 'production') {
          return 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/' + require('socket.io/package').version + '/socket.io.js';
        } else {
          return '/socket.io/socket.io.js';
        }
      }
    }
  }));
  app.set('view engine', 'hbs');

  if (!process.env.TESTING) app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(lessMiddleware(path.join(__dirname, 'source'), {
    dest: path.join(__dirname, 'public')
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.locals.reference_url = process.env.REFERENCE_URL || 'http://processingjs.org/reference/';

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

  io.on('connection', function (socket) {
    var query = socket.handshake.query;
    var playground = world.getOrCreatePlayground(query.playgroundId);
    var client = query.client;

    if (client === 'renderer') {
      rendererUp();
    } else {
      programmerUp();
    }

    function sendListOfAllObjects () {
      socket.emit('objects list', { data: playground.getData() });
    }

    function programmerUp () {
      debug('a new programmer is up for ' + playground.id);

      sendListOfAllObjects();
    }

    function rendererUp () {
      debug('a new renderer is up for ' + playground.id);

      socket.emit('playground full update', playground.getData());
    }

    socket.on('code update', function (data) {
      debug(data.codeObjectId + ' for ' + playground.id + ' from ' + client);

      var codeObject = playground.getOrCreateCodeObject(data.codeObjectId);
      codeObject.setData(data);
    });

    socket.on('code delete', function (data) {
      debug('deleting ' + data.codeObjectId + ' from playground ' + playground.id);

      if (playground.contains(data.codeObjectId)) {
        playground.deleteCodeObject(data.codeObjectId);
      }
    });

    socket.on('request code', function (data) {
      debug(data.codeObjectId + ' for ' + playground.id + ' programmer');
      socket.emit('source code', playground.getDataFor(data.codeObjectId));
    });

    function codeObjectUpdated (codeObject) {
      socket.emit('code update', codeObject.getData());
      sendListOfAllObjects();
    }

    playground.on('codeObjectUpdated', codeObjectUpdated);

    function codeObjectDeleted (codeObject) {
      socket.emit('code delete', {
        codeObjectId: codeObject.id
      });
      sendListOfAllObjects();
    }
    playground.on('codeObjectDeleted', codeObjectDeleted);

    socket.on('disconnect', function () {
      playground.removeListener('codeObjectUpdated', codeObjectUpdated);
      playground.removeListener('codeObjectDeleted', codeObjectDeleted);
      world.releasePlayground(playground);
    });
  });

  return server;
};
