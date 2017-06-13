var express = require('express');
var http = require('http');
var io = require ('socket.io');
var _ = require ('underscore');
var expressLayer = require ('express/lib/router/layer');
var expressSession = require('express-session')
var async = require ('async');
var middleware = require ('./middleware');
var RequestIO = require('./request').RequestIO;
var RoomIO = require('./room').RoomIO;

express.io = io;

var key, value;

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
  var defaultOptions, layer;
  if (options == null) {
    options = new Object;
  }
  defaultOptions = {
    log: false
  };
  _.defaults(options, defaultOptions);
  this.io = io.listen(this.server, options);
  this.io.router = new Object;
  this.io.middleware = [];
  // This responds to the route called by app.js
  this.io.route = function(route, next) {
      return this.router[route] = next;
    };

  this.io.configure = (function(_this) {
    console.log("this is configuration")
    return function() {
      console.log("this is configuration 2")
      return _this.io.set('authorization', function(data, next) {
        console.log("this is configuration 3")
        var cookieParser;
        if (sessionConfig.store == null) {
          return async.forEachSeries(_this.io.middleware, function(callback, next) {
            return callback(data, next);
          }, function(error) {
            console.log("this is configuration donction error 1")
            if (error != null) {
              return next(error);
            }
            return next(null, true);
          });
        }
        cookieParser = cookieParser();
        return cookieParser(data, null, function(error) {
          console.log("this is configuration donction error ")
          var rawCookie, request, sessionId;
          if (error != null) {
            return next(error);
          }
          rawCookie = data.cookies[sessionConfig.key];
          if (rawCookie == null) {
            request = {
              headers: {
                cookie: data.query.cookie
              }
            };
            return cookieParser(request, null, function(error) {
              var sessionId;
              data.cookies = request.cookies;
              rawCookie = data.cookies[sessionConfig.key];
              if (rawCookie == null) {
                return next("No cookie present", false);
              }
              sessionId = cookieParserUtils.signedCookies(rawCookie, sessionConfig.secret);
              data.sessionID = sessionId;
              return sessionConfig.store.get(sessionId, function(error, session) {
                if (error != null) {
                  return next(error);
                }
                data.session = new expressSession.Session(data, session);
                return next(null, true);
              });
            });
          }
          sessionId = cookieParserUtils.signedCookies(rawCookie, sessionConfig.secret);
          data.sessionID = sessionId;
          return sessionConfig.store.get(sessionId, function(error, session) {
            if (error != null) {
              return next(error);
            }
            data.session = new expressSession.Session(data, session);
            return next(null, true);
          });
        });
      });
    };
  })(this);
  this.io.use = (function(_this) {
    return function(callback) {
      return _this.io.middleware.push(callback);
    };
  })(this);
  this.io.sockets.on('connection', (function(_this) {
    return function(socket) {
      return initRoutes(socket, _this.io);
    };
  })(this));
  this.io.broadcast = (function(_this) {
    return function() {
      var args;
      args = Array.prototype.slice.call(arguments, 0);
      return _this.io.sockets.emit.apply(_this.io.sockets, args);
    };
  })(this);
  this.io.room = (function(_this) {
    return function(room) {
      return new RoomIO(room, _this.io.sockets);
    };
  })(this);
  layer = new expressLayer('', {
    sensitive: void 0,
    strict: void 0,
    end: false
  }, (function(_this) {
    return function(request, response, next) {
      request.io = {
        route: function(route) {
          var ioRequest, key, value;
          ioRequest = new Object;
          for (key in request) {
            value = request[key];
            ioRequest[key] = value;
          }
          ioRequest.io = {
            broadcast: _this.io.broadcast,
            respond: function() {
              var args;
              args = Array.prototype.slice.call(arguments, 0);
              return response.json.apply(response, args);
            },
            route: function(route) {
              return _this.io.route(route, ioRequest, {
                trigger: true
              });
            },
            data: request.body
          };
          return _this.io.route(route, ioRequest, {
            trigger: true
          });
        },
        broadcast: _this.io.broadcast
      };
      return next();
    };
  })(this));
  this._router.stack.push(layer);
  return this;
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
  var key, ref, results, value;
  var setRoute = function(key, callback) {
    return socket.on(key, function(data, respond) {
      var base, request, session;
      if (typeof data === 'function') {
        respond = data;
        data = void 0;
      }
      request = {
        data: data,
        session: socket.handshake.session,
        sessionID: socket.handshake.sessionID,
        sessionStore: sessionConfig.store,
        socket: socket,
        headers: socket.handshake.headers,
        cookies: socket.handshake.cookies,
        handshake: socket.handshake
      };
      session = socket.handshake.session;
      if (session != null) {
        request.session = new expressSession.Session(request, session);
      }
      socket.handshake.session = request.session;
      request.io = new RequestIO(socket, request, io);
      request.io.respond = respond;
      if ((base = request.io).respond == null) {
        base.respond = function() {};
      }
      return callback(request);
    });
  };
  ref = io.router;
  results = [];
  for (key in ref) {
    value = ref[key];
    results.push(setRoute(key, value));
  }
  return results;
};
module.exports = express;
