'use strict';

const util = require('util');
const EventEmitter = require('events');
const CodeObject = require('./CodeObject');

function Playground (id) {
  EventEmitter.call(this);
  this.id = id;
  this._codeObjects = new Map();
}

util.inherits(Playground, EventEmitter);

Playground.prototype.getOrCreateCodeObject = function (codeObjectId) {
  if (this._codeObjects.has(codeObjectId)) {
    return this._codeObjects.get(codeObjectId);
  }

  var codeObject = new CodeObject(codeObjectId,
                                  (co) => this.emit('codeObjectUpdated', co));
  this._codeObjects.set(codeObjectId, codeObject);
  return codeObject;
};

Playground.prototype.deleteCodeObject = function (codeObjectId) {
  if (!this.contains(codeObjectId)) return;
  const codeObject = this._codeObjects.get(codeObjectId);
  this._codeObjects.delete(codeObjectId);
  this.emit('codeObjectDeleted', codeObject);
  return codeObject;
};

Playground.prototype.renameCodeObject = function (oldCodeObjectId, newCodeObjectId) {
  const codeObject = this._codeObjects.get(oldCodeObjectId);
  this._codeObjects.delete(oldCodeObjectId);
  this._codeObjects.set(newCodeObjectId, codeObject);
  this.emit('codeObjectUpdated', codeObject);
};

Playground.prototype.population = function () {
  return Array.from(this._codeObjects.keys());
};

Playground.prototype.isEmpty = function () {
  return this._codeObjects.size === 0;
};

Playground.prototype.contains = function (id) {
  return this._codeObjects.has(id);
};

Playground.prototype.getData = function () {
  return Array.from(this._codeObjects.values())
    .map((codeObject) => codeObject.getData());
};

Playground.prototype.getDataFor = function (codeObjectId) {
  var codeObject =
    this._codeObjects.get(codeObjectId) ||
    new CodeObject(codeObjectId);
  return codeObject.getData();
};

module.exports = Playground;
