"use strict";

const EventEmitter = require('events');
const Playground = require('./Playground')

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
    var playground = new Playground(this,id);
    this.playgrounds[id] = playground;
    return playground;
  }

  return World;
}();

