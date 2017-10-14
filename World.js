'use strict';

const Playground = require('./Playground');

function World () {
  this.playgrounds = Object.create(null);
}

World.prototype.tour = function () {
  var tour = Object.keys(this.playgrounds);
  var i = tour.length;
  while (i--) {
    if (this.playgrounds[tour[i]].isEmpty()) {
      tour.splice(i, 1);
    }
  }
  return tour;
};

World.prototype.contains = function (id) {
  return Object.keys(this.playgrounds).indexOf(id) >= 0;
};

World.prototype.getOrCreatePlayground = function (id) {
  if (this.playgrounds[id]) return this.playgrounds[id];
  var playground = new Playground(id);
  this.playgrounds[id] = playground;
  return playground;
};

module.exports = World;
