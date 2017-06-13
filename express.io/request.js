var RoomIO;

RoomIO = require('./room').RoomIO;

exports.RequestIO = (function() {
  function RequestIO(socket, request, io) {
    this.socket = socket;
    this.request = request;
    this.manager = io;
  }

  RequestIO.prototype.broadcast = function(event, message) {
    return this.socket.broadcast.emit(event, message);
  };

  RequestIO.prototype.emit = function(event, message, cb) {
    return this.socket.emit(event, message, cb);
  };

  RequestIO.prototype.get = function(key, cb) {
    return this.socket.get(key, cb);
  };

  RequestIO.prototype.set = function(key, val, cb) {
    return this.socket.set(key, val, cb);
  };

  RequestIO.prototype.room = function(room) {
    return new RoomIO(room, this.socket);
  };

  RequestIO.prototype.join = function(room) {
    return this.socket.join(room);
  };

  RequestIO.prototype.route = function(route) {
    return this.manager.route(route, this.request, {
      trigger: true
    });
  };

  RequestIO.prototype.leave = function(room) {
    return this.socket.leave(room);
  };

  RequestIO.prototype.on = function() {
    var args;
    args = Array.prototype.slice.call(arguments, 0);
    return this.socket.on.apply(this.socket, args);
  };

  RequestIO.prototype.disconnect = function(callback) {
    return this.socket.disconnect(callback);
  };

  return RequestIO;

})();