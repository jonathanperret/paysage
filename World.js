'use strict';

const Playground = require('./Playground');
const persistence = require('./persistence');

function World () {
  this._playgrounds = new Map();
}

World.prototype.tour = function () {
  return Array.from(this._playgrounds.keys());
};

World.prototype.contains = function (id) {
  return this._playgrounds.has(id);
};

World.prototype.getOrCreatePlayground = function (id) {
  let playground;
  if (this._playgrounds.has(id)) {
    playground = this._playgrounds.get(id);
    playground.refCount++;
  } else {
    playground = new Playground(id);
    this._playgrounds.set(id, playground);
    playground.refCount = 1;

    persistence.setup(playground);
  }
  return playground;
};

World.prototype.releasePlayground = function (playground) {
  playground.refCount--;
  if (playground.refCount <= 0 && playground.isEmpty()) {
    this._playgrounds.delete(playground.id);
  }
};

module.exports = World;
