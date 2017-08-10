var debug = require('debug')('paysage:app');

var world = require('./world')();

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

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

io.on('connection', function(client) {
  client.on('programmer up', function(playgroundId) {
    debug("a new programmer is up for " + playgroundId);

    client.join(playgroundId);

    if (!world.contains(playgroundId)) return;
    var playground = world.playground(playgroundId);

    client.emit('objects list', getListOfAllObjects(playground));
  });

  client.on('playground up', function(playgroundId) {
    debug("a new renderer is up for " + playgroundId);

    client.join(playgroundId);

    if (!world.contains(playgroundId)) return;
    var playground = world.playground(playgroundId);

    var data = Object.create(null);
    playground.population().forEach(function(codeObjectId) {
      data[codeObjectId] = { code: playground.codeObject(codeObjectId).code() };
    });
    client.emit('playground full update', data);
  });

  client.on('code update', function(data) {
    debug(data.objectId + " for " + data.playgroundId + " from " + data.client);

    var codeObject = world.playground(data.playgroundId).codeObject(data.objectId);

    codeObject.updateCode(data.code);
    codeObject.mediatype = data.mediatype;
    codeObject.client = data.client;

    client.broadcast.to(codeObject.playground.id).emit('code update', {
      objectId: codeObject.id,
      code: codeObject.code()
    });
    broadcastObjectList(codeObject.playground);
  });

  client.on('code delete', function(data) {
    debug("deleting " + data.objectId + " from playground " + data.playgroundId);

    if (!world.contains(data.playgroundId)) return;
    var playground = world.playground(data.playgroundId);
    if (!playground.contains(data.objectId)) return;

    var codeObject = playground.codeObject(data.objectId);
    codeObject.delete();

    client.broadcast.to(playground.id).emit('code delete', {
      playgroundId: playground.id,
      objectId: codeObject.id
    });
    broadcastObjectList(playground);
  });

  client.on('request code', function(data) {
    debug(data.objectId + " for " + data.playground + " programmer" ) ;

    if (!world.contains(data.playgroundId)) return;
    var playground = world.playground(data.playgroundId);
    if (!playground.contains(data.objectId)) return;
    var codeObject = playground.codeObject(data.objectId);

    var data = {
      playgroundId: codeObject.playground.id,
      objectId: codeObject.id,
      code: codeObject.code()
    }

    client.emit('source code', data);
  });
});

module.exports = server;
