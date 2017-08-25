"use strict";

var World = require('../World');

describe("World", function() {
  var world;

  beforeEach(function() {
    world = new World();
  });

  it("lists all the playgrounds ids", function() {
    world.getOrCreatePlayground("Miami beach");
    expect(world.tour()).to.deep.equal(["Miami beach"]);
  });
  it("can tell when it does not contain a playground, based on its id", function () {
    expect(world.contains("Miami beach")).to.be.false;
  });

  it("can tell when it contains a codeObject, based on its id", function () {
    world.getOrCreatePlayground("Miami beach");
    expect(world.contains("Miami beach")).to.be.true;
  });
})
