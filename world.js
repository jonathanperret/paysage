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
    function deleteCodeObjectX(id) {
      delete codeObjects[id];
      if (playground.isEmpty())
        delete world.playgrounds[playground.id];
    }
    function deleteCodeObject(codeObjectId) {
      var codeObject = codeObjects[codeObjectId];
      delete codeObjects[codeObjectId];
      if (Object.keys(codeObjects).length==0)
        delete world.playgrounds[playground.id];
      return codeObject;
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
        };
        codeObjects[id]=(codeObject);
        return codeObject;
      },
      deleteCodeObject: function(codeObjectId) {
        if (Object.keys(codeObjects).indexOf(codeObjectId)<0) return;
        var codeObject = deleteCodeObject(codeObjectId);
        world.emit('codeObjectDeleted',codeObject);
      },
      deleteSilentlyCodeObject: function(codeObjectId) {
        if (Object.keys(codeObjects).indexOf(codeObjectId)<0) return;
        deleteCodeObject(codeObjectId);
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

