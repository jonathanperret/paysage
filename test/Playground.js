
"use strict";

var World = require('../World');
var Playground = require('../Playground');

describe("A playground", function() {
  var world, playground;

  beforeEach(function() {
    world = new World();
    playground = new Playground(world,'here');
  });

  it(", when it's new, has no codeObject", function () {
    expect(playground.population()).to.deep.equal([]);
  });

  it("can list its codeObject's ids", function () {
    playground.getOrCreateCodeObject("bob");
    playground.getOrCreateCodeObject("jack");
    expect(playground.population()).to.have.members(["bob","jack"]);
  });

  it("can tell if it is empty", function () {
    expect(playground.isEmpty()).to.be.true;
  });

  it("can tell if it is not empty", function () {
    playground.getOrCreateCodeObject("bob");
    expect(playground.isEmpty()).to.be.false;
  });

  it("can tell when it does not contain a codeObject, based on its id", function () {
    expect(playground.contains("bob")).to.be.false;
  });

  it("can tell when it contains a codeObject, based on its id", function () {
    playground.getOrCreateCodeObject("bob");
    expect(playground.contains("bob")).to.be.true;
  });

  it("has a id", function () {
    expect(playground.id).to.equal('here');
  });

  it("has only one code object per id", function () {
    var bob = playground.getOrCreateCodeObject("bob");
    var theOtherBob = playground.getOrCreateCodeObject("bob");
    expect(theOtherBob).to.equal(bob);
  });

  it("can delete a codeObject", function() {
    var bob = playground.getOrCreateCodeObject("bob");
    playground.deleteCodeObject('bob');

    expect(playground.codeObjects).to.deep.equal({});
    expect(playground.contains("bob")).to.be.false;
  });

  it("can delete silently a codeObject", function() {
    var bob = playground.getOrCreateCodeObject("bob");
    playground.deleteSilentlyCodeObject('bob');

    expect(playground.codeObjects).to.deep.equal({});
    expect(playground.contains("bob")).to.be.false;
  });

});
