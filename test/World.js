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

  it("not on attempt to delete an unkwown codeObject", function() {
    var world = new World();
    var spy = sinon.spy();
    var playground = world.getOrCreatePlayground("any")
    world.on('codeObjectDeleted',spy);

    playground.deleteCodeObject('nobody');

    expect(spy).not.to.have.been.called;
  });

});

