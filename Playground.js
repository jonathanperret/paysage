"use strict";

const CodeObject = require('./CodeObject');

module.exports = function() {
  function Playground(world, id) {
    this.world = world;
    this.id = id;
    this.codeObjects = Object.create(null);
  }

  Playground.prototype.getOrCreateCodeObject = function(codeObjectId,code) {
    if (this.codeObjects[codeObjectId]) return this.codeObjects[codeObjectId];
    var codeObject = new CodeObject(this.world,this,codeObjectId,code);
    this.codeObjects[codeObjectId]= codeObject;
    return codeObject;
  }

  Playground.prototype.deleteCodeObject = function(codeObjectId) {
    var codeObject = this.deleteSilentlyCodeObject(codeObjectId);
    if (codeObject) this.world.emit('codeObjectDeleted',codeObject);
  }
  Playground.prototype.deleteSilentlyCodeObject = function(codeObjectId) {
    if (!this.contains(codeObjectId)) return;
    var codeObject = this.codeObjects[codeObjectId];
    delete this.codeObjects[codeObjectId];
    return codeObject;
  }
  Playground.prototype.population = function() {
    return Object.keys(this.codeObjects);
  }
  Playground.prototype.isEmpty = function() {
    return Object.keys(this.codeObjects).length == 0;
  }
  Playground.prototype.contains = function(id) {
    return Object.keys(this.codeObjects).indexOf(id)>=0;
  }

  return Playground;
}();

