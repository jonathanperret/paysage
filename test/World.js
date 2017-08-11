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

describe("World notifies", function() {
  it("when a codeObject code is set", function() {
    var world = new World();
    var spy = sinon.spy();
    var codeObject = world.getOrCreatePlayground("any").getOrCreateCodeObject("ugly");
    world.on('codeObjectUpdated',spy);

    codeObject.setCode("// hello");

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it("not when a codeObject code is set silently", function() {
    var world = new World();
    var spy = sinon.spy();
    var codeObject = world.getOrCreatePlayground("any").getOrCreateCodeObject("ugly");
    world.on('codeObjectUpdated',spy);

    codeObject.setCodeSilently("// hello");

    expect(spy).not.to.have.been.called;
  });

  it("when a codeObject is deleted", function() {
    var world = new World();
    var spy = sinon.spy();
    var playground = world.getOrCreatePlayground("any")
    var codeObject = playground.getOrCreateCodeObject("ugly");
    world.on('codeObjectDeleted',spy);

    playground.deleteCodeObject('ugly');

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it("not when a codeObject is deleted silently", function() {
    var world = new World();
    var spy = sinon.spy();
    var playground = world.getOrCreatePlayground("any")
    var codeObject = playground.getOrCreateCodeObject("ugly");
    world.on('codeObjectDeleted',spy);

    playground.deleteSilentlyCodeObject('ugly');

    expect(spy).not.to.have.been.called;
  });

});

describe("A playground", function() {
  var world, playground;

  beforeEach(function() {
    world = new World();
    playground = world.getOrCreatePlayground("Miami beach");
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
    expect(playground.id).to.equal("Miami beach");
  });

  it("has a unique id", function () {
    var anotherPlayground = world.getOrCreatePlayground("Miami beach");
    expect(anotherPlayground).to.equal(playground);
  });

  it("has only on code object per id", function () {
    var bob = playground.getOrCreateCodeObject("bob");
    var theOtherBob = playground.getOrCreateCodeObject("bob");
    expect(theOtherBob).to.equal(bob);
  });

  it("can delete a codeObject", function() {
    var bob = playground.getOrCreateCodeObject("bob");
    playground.deleteCodeObject('bob');

    expect(playground.population()).not.to.contain("bob");
    expect(world.tour()).not.to.contain("Miami beach");
  });

  it("can delete silently a codeObject", function() {
    var bob = playground.getOrCreateCodeObject("bob");
    playground.deleteSilentlyCodeObject('bob');

    expect(playground.population()).not.to.contain("bob");
    expect(world.tour()).not.to.contain("Miami beach");
  });

});
