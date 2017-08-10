"use strict";

module.exports = function() {

  function World() {
    this.playgrounds = Object.create(null),
    this.notifyUpdate = function(){},
    this.notifyDelete = function(){}
  }

  World.prototype.tour = function() {
    return Object.keys(this.playgrounds);
  }

  World.prototype.contains = function(id) {
    return Object.keys(this.playgrounds).indexOf(id)>=0;
  }

  World.prototype.onCodeObjectUpdate = function(fn) {
    this.notifyUpdate = fn;
  }

  World.prototype.onCodeObjectDelete = function(fn) {
    this.notifyDelete = fn;
  }

  World.prototype.playground = function(id)  {
    if (this.playgrounds[id]) return this.playgrounds[id];
    var world = this;
    var codeObjects = Object.create(null);
    var playground = {
      id: id,
      codeObject: function(id,initCode) {
        if (codeObjects[id]) return codeObjects[id];
        var code = initCode ? initCode : "";
        var codeObject = {
          id: id,
          playground: playground,
          code: function() { return code; },
          setCode: function(newCode) {
            code = newCode;
            world.notifyUpdate(this);
          },
          setCodeSilently: function(newCode) {
            code = newCode;
          },
          delete: function(silently) {
            delete codeObjects[id];
            if (playground.isEmpty())
              delete world.playgrounds[playground.id];
            if (!silently) world.notifyDelete(this);
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

