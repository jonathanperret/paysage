var world = require("./world")();

const github = require("./github")();
github.init(process.env.GITHUB_OWNER, process.env.GITHUB_REPO, process.env.GITHUB_TOKEN);

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
var list = require('./routes/list')(world);
var playground = require('./routes/playground');
var create = require('./routes/create');
var workshop = require('./routes/workshop');

app.use('/', create);
app.use('/playground/', playground);
app.use('/list', list);
app.use('/workshop', workshop);

// attach socket.io to the http server
app.http().io();

function populateCreature(playground, name, code, sha) {
  codeObjects[playground][name] = { code: code, sha: sha};
}

function populatePlayground(playground,creatures) {
  creatures.forEach(function(name) {
    github.loadCreature(playground,name,populateCreature);
  });
}

github.loadPlaygrounds(function(playgrounds) {
  playgrounds.forEach(function(playground) {
    codeObjects[playground] = {};
    github.loadPlayground(playground, populatePlayground);
  });
});

var getCode = function (playground, objectId) {
    return world.playground(playground).creature(objectId).code();
};



var getListOfAllCreatures = function (playground) {
    return {playgroundId : playground.name,
            objectIds : playground.population() }
};

app.io.route('programmer up',
    function sendProgrammerTheObjectsList(req) {
        var playground = world.playground(req.data);
        console.log("a new programmer is up for " + playground.name);

        req.io.join(playground.name); // have client (req) join the room named after Playground Id

        if (! playground.isEmpty()) {
          req.io.emit('objects list',
                      getListOfAllCreatures(playground));
        }
    });

app.io.route('playground up',
    function sendPlaygroundAllCodeObjects (req) {
        var name = req.data;
        console.log(name + " playground: a new renderer page is up");
        req.io.join(name);
        var playground = world.playground(name);
        if (playground.isEmpty()) return
        var creatures = {};
        playground.population().forEach(function(name) {
          creatures[name] = { code: playground.creature(name).code()};
        });
        req.io.emit('playground full update', creatures);
    });

app.io.route('code update',
    function saveNewCodeThenBroadcastCodeAndList(req) {
        var creature = world
                       .playground(req.data.playgroundId)
                       .creature(req.data.objectId)
        console.log(creature.name + " for " + creature.playground.name + " from " + req.data.client);
        req.io.join(creature.playground.name); // we join the room to broadcast

        creature.updateCode(req.data.code);
        req.io.room(creature.playground.name).broadcast('code update', req.data);
        app.io.room(creature.playground.name).broadcast('objects list', getListOfAllCreatures(creature.playground));
    });

app.io.route('request code',
    function sendProgrammerTheCodeObject(req) {
        var creature = world.playground(req.data.playgroundId)
                            .creature(req.data.objectId);

        var data = { playgroundId: creature.playground.name,
                     objectId: creature.name,
                     code: creature.code() };

        console.log(creature.name + " for " + creature.playground.name + " programmer" ) ;

        req.io.emit('source code', data);
    });

module.exports = app;
