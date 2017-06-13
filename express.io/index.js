var express = require('express');
var http = require('http');
io = require ('socket.io');
_ = require ('underscore');
expressLayer = require ('express/lib/router/layer');
expressSession = require('express-session')
async = require ('async');
middleware = require ('./middleware');

express.io = io;

var RequestIO;
RequestIO = require('./request').RequestIO;

var RoomIO;
RoomIO = require('./room').RoomIO;

var key, session, sessionConfig, value;

session = expressSession;

delete express.session;

sessionConfig = new Object;

express.session = function(options) {
  if (options == null) {
    options = new Object;
  }
  if (options.key == null) {
    options.key = 'express.sid';
  }
  if (options.store == null) {
    options.store = new session.MemoryStore;
  }
  if (options.cookie == null) {
    options.cookie = new Object;
  }
  sessionConfig = options;
  return session(options);
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
  this.io.route = function(route, next, options) {
  	console.log(route);
    var key, results, split, value;
    if ((options != null ? options.trigger : void 0) === true) {
      if (route.indexOf(':' === -1)) {
        this.router[route](next);
      } else {
        split = route.split(':');
        this.router[split[0]][split[1]](next);
      }
    }
    if (_.isFunction(next)) {
      return this.router[route] = next;
    } else {
      results = [];
      for (key in next) {
        value = next[key];
        results.push(this.router[route + ":" + key] = value);
      }
      return results;
    }
  };
  this.io.configure = (function(_this) {
    return function() {
      return _this.io.set('authorization', function(data, next) {
        var cookieParser;
        if (sessionConfig.store == null) {
          return async.forEachSeries(_this.io.middleware, function(callback, next) {
            return callback(data, next);
          }, function(error) {
            if (error != null) {
              return next(error);
            }
            return next(null, true);
          });
        }
        cookieParser = cookieParser();
        return cookieParser(data, null, function(error) {
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

var initRoutes, listen;

listen = express.application.listen;

express.application.listen = function() {
  var args;
  args = Array.prototype.slice.call(arguments, 0);
  if (this.server != null) {
    return this.server.listen.apply(this.server, args);
  } else {
    return listen.apply(this, args);
  }
};

initRoutes = function(socket, io) {
  var key, ref, results, setRoute, value;
  setRoute = function(key, callback) {
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
