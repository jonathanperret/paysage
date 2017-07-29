var codeObjects = {};

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

var server = require('http').createServer(app);
var io = require('socket.io')(server);

function getCode(playground, objectId) {
  if (!codeObjects[playground]) return "";
  if (!codeObjects[playground][objectId]) return "";

  return codeObjects[playground][objectId].code;
};

function getListOfAllObjects(playground) {
  var objectIds = Object.keys(codeObjects[playground]);
  return {playgroundId: playground, objectIds: objectIds};
};

io.on('connection', function(client) {
  client.on('programmer up', function(playground) {
    console.log("a new programmer is up for " + playground);

    client.join(playground); // have client join the room named after Playground Id

    if (codeObjects[playground]) {
      client.emit('objects list', getListOfAllObjects(playground));
    }
  });

  client.on('playground up', function(playground) {
    console.log(playground + " playground: a new renderer page is up");
    client.join(playground);

    if (!codeObjects[playground]) return;
    client.emit('playground full update', codeObjects[playground]);
  });

  client.on('code update', function(data) {
    var playgroundId = data.playgroundId;
    var objectId = data.objectId;

    console.log(objectId + " for " + playgroundId + " from " + client);
    client.join(playgroundId); // we join the room to broadcast

    if (!codeObjects[playgroundId]) codeObjects[playgroundId] = {};

    codeObjects[playgroundId][objectId] = {
      mediatype: data.mediatype,
      client: data.client,
      code: data.code
    };

    client.broadcast.to(playgroundId).emit('code update', data);
    io.to(playgroundId).emit('objects list', getListOfAllObjects(playgroundId));
  });

  client.on('request code', function(data) {
    var playground = data.playgroundId;
    var objectId = data.objectId;
    var code = getCode(playground, objectId);

    var data = { playgroundId: playground, objectId: objectId, code: code };

    console.log(objectId + " for " + playground + " programmer" ) ;

    client.emit('source code', data);
  });
});

module.exports = server;
