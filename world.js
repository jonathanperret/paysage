"use strict";

const EventEmitter = require('events');

module.exports = function() {

  function World() {
    this.playgrounds = Object.create(null);
  }

  World.prototype = Object.create( EventEmitter.prototype );

  World.prototype.tour = function() {
    return Object.keys(this.playgrounds);
  }

  World.prototype.contains = function(id) {
    return Object.keys(this.playgrounds).indexOf(id)>=0;
  }


  World.prototype.getOrCreatePlayground = function(id)  {
    if (this.playgrounds[id]) return this.playgrounds[id];
    var world = this;
    var codeObjects = Object.create(null);
    function deleteCodeObject(id) {
      delete codeObjects[id];
      if (playground.isEmpty())
        delete world.playgrounds[playground.id];
    }
    var playground = {
      id: id,
      getOrCreateCodeObject: function(id,initCode) {
        if (codeObjects[id]) return codeObjects[id];
        var code = initCode ? initCode : "";
        var codeObject = {
          id: id,
          playground: playground,
          code: function() { return code; },
          setCode: function(newCode) {
            code = newCode;
            world.emit('codeObjectUpdated',this);
          },
          setCodeSilently: function(newCode) {
            code = newCode;
          },
          delete: function() {
            deleteCodeObject(id)
            world.emit('codeObjectDeleted',this);
          },
          deleteSilently: function() {
            deleteCodeObject(id)
          },
        };
        codeObjects[id]=(codeObject);
        return codeObject;
      },
      population: function() {
        return Object.keys(codeObjects);
      },
      isEmpty: function() {
        return Object.keys(codeObjects).length == 0;
      },
      contains: function(id) {
        return Object.keys(codeObjects).indexOf(id)>=0;
      }
    };
    this.playgrounds[id] = playground;
    return playground;
  }

  return World;
}();

