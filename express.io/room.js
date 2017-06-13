exports.RoomIO = (function() {
  function RoomIO(name, socket) {
    this.name = name;
    this.socket = socket;
  }

  RoomIO.prototype.broadcast = function(event, message) {
    if (this.socket.broadcast != null) {
      return this.socket.broadcast.to(this.name).emit(event, message);
    } else {
      return this.socket["in"](this.name).emit(event, message);
    }
  };

  return RoomIO;

})();