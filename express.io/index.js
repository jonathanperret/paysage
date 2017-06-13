var express = require('express');
var http = require('http');
var io = require ('socket.io');
var _ = require ('underscore');
var expressSession = require('express-session')
var RequestIO = require('./request').RequestIO;
var RoomIO = require('./room').RoomIO;

express.io = io;

var session = expressSession;
delete express.session;
var sessionConfig = new Object;
express.session = function(options) {
  return session();
};

express.application.http = function() {
  this.server = http.createServer(this);
  return this;
};

express.application.io = function(options) {

  if (options == null) {
    options = new Object;
  }
  // To all options, add the elements in defaultOptions
  var defaultOptions = {
    log: false
  };
  _.defaults(options, defaultOptions);

  this.io = io.listen(this.server, options);
  this.io.router = new Object;

  // This responds to the route called by app.js
  this.io.route = function(route, next) {
      return this.router[route] = next;
    };

  this.io.sockets.on('connection', (function(_this) {
    return function(socket) {
      return initRoutes(socket, _this.io);
    };
  })(this));

  this.io.room = (function(_this) {
    return function(room) {
      return new RoomIO(room, _this.io.sockets);
    };
  })(this);
};

var listen = express.application.listen;

express.application.listen = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  if (this.server != null) {
    return this.server.listen.apply(this.server, args);
  } else {
    return listen.apply(this, args);
  }
};

var initRoutes = function(socket, io) {
  var setRoute = function(key, callback) {
    return socket.on(key, function(data, respond) {
      if (typeof data === 'function') {
        respond = data;
        data = void 0;
      }
      var request = {
        data: data,
        session: socket.handshake.session,
        sessionID: socket.handshake.sessionID,
        sessionStore: sessionConfig.store,
        socket: socket,
        headers: socket.handshake.headers,
        cookies: socket.handshake.cookies,
        handshake: socket.handshake
      };
      var session = socket.handshake.session;
      if (session != null) {
        request.session = new expressSession.Session(request, session);
      }
      socket.handshake.session = request.session;
      request.io = new RequestIO(socket, request, io);
      request.io.respond = respond;
      var base;
      if ((base = request.io).respond == null) {
        base.respond = function() {};
      }
      return callback(request);
    });
  };
  var ref = io.router;
  var results = [];
  for (var key in ref) {
    var value = ref[key];
    results.push(setRoute(key, value));
  }
  return results;
};
module.exports = express;
