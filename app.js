var world = require("./world")();

var persisted = require('./persistence')(world).maybeStart();
if (persisted) console.log("Pesistence on github is enabled.");

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
var list = require('./routes/list')(world);
var playground = require('./routes/playground');
var create = require('./routes/create');
var workshop = require('./routes/workshop');
var webhook = require('./routes/githubwebhook');

app.use('/', create);
app.use('/playground/', playground);
app.use('/list', list);
app.use('/workshop', workshop);
app.use('/webhook', webhook);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var getCode = function (playground, objectId) {
    return world.playground(playground).creature(objectId).code();
};

function toData(creature) {
  return { playgroundId: creature.playground.name,
           objectId: creature.name,
           code: creature.code() };
}

function fromData(data) {
  return world
         .playground(data.playgroundId)
         .creature(data.objectId);
}
var getListOfAllCreatures = function (playground) {
    return {playgroundId : playground.name,
            objectIds : playground.population() }
};

io.on('connection', function(client) {

client.on('programmer up',
    function sendProgrammerTheObjectsList(playgroundName) {
        console.log("a new programmer is up for " + playgroundName);
        var playground = world.playground(playgroundName);
        client.join(playground.name); // have client join the room named after Playground Id
        if (! playground.isEmpty()) {
          client.emit('objects list',
                      getListOfAllCreatures(playground));
        }
    });

client.on('playground up',
    function sendPlaygroundAllCodeObjects (playgroundName) {
        console.log(playgroundName + " playground: a new renderer page is up");
        client.join(playgroundName);
        var playground = world.playground(playgroundName);
        if (playground.isEmpty()) return
        var creatures = {};
        playground.population().forEach(function(name) {
          creatures[name] = { code: playground.creature(name).code()};
        });
        client.emit('playground full update', creatures);
    });

client.on('delete code',
    function deleteCodeThenList(data) {
        var creature = fromData(data);
        creature.delete();
        client.join(creature.playground.name); // we join the room to broadcast
        client.broadcast.to(creature.playground.name).emit('code delete', data);
        io.to(creature.playground.name).emit('objects list', getListOfAllCreatures(creature.playground));
    });


client.on('code update',
    function saveNewCodeThenBroadcastCodeAndList(data) {
        var creature = fromData(data);
        console.log(creature.name + " for " + creature.playground.name + " from " + client.id);

        creature.updateCode(data.code);

        client.join(creature.playground.name); // we join the room to broadcast
        client.broadcast.to(creature.playground.name).emit('code update', data);
        io.to(creature.playground.name).emit('objects list', getListOfAllCreatures(creature.playground));
    });

world.onCreatureCodeRefresh(function(creature){
  console.log(creature.playground.name + '/' + creature.name);
  io.to(creature.playground.name).emit('code update', toData(creature));
  io.to(creature.playground.name).mit('objects list', getListOfAllCreatures(creature.playground));


})


client.on('request code',
    function sendProgrammerTheCodeObject(data) {
        var creature = fromData(data);

        console.log(creature.name + " for " + creature.playground.name + " programmer" ) ;

        client.emit('source code', toData(creature));
    });

});

module.exports = server;
