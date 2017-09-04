"use strict";

const util = require('util');
const EventEmitter = require('events');
const CodeObject = require('./CodeObject');

function Playground(id) {
  EventEmitter.call(this);
  this.id = id;
  this.codeObjects = Object.create(null);
}

util.inherits(Playground, EventEmitter);

Playground.prototype.getOrCreateCodeObject = function(codeObjectId) {
  if (this.codeObjects[codeObjectId]) return this.codeObjects[codeObjectId];

  var codeObject = new CodeObject(codeObjectId,
                                  (co) => this.emit('codeObjectUpdated', co));
  this.codeObjects[codeObjectId] = codeObject;
  return codeObject;
}

Playground.prototype.deleteCodeObject = function(codeObjectId) {
  if (!this.contains(codeObjectId)) return;
  var codeObject = this.codeObjects[codeObjectId];
  delete this.codeObjects[codeObjectId];
  this.emit('codeObjectDeleted',codeObject);
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

Playground.prototype.getData = function() {
  var data = Object.create(null);
  this.population().forEach((codeObjectId)=>{
    data[codeObjectId] = this.codeObjects[codeObjectId].getData();
  });
  return data;
}

Playground.prototype.getDataFor = function(codeObjectId) {
  var codeObject =
    this.codeObjects[codeObjectId]
    || new CodeObject(codeObjectId);
  return codeObject.getData();
}

module.exports = Playground;
