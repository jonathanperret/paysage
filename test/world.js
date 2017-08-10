"use strict";

var World = require('../world');

describe("World", function() {
  var world;

  beforeEach(function() {
    world = new World();
  });

  it("lists all the playgrounds ids", function() {
    world.playground("Miami beach");
    expect(world.tour()).to.deep.equal(["Miami beach"]);
  });
  it("can tell when it does not contain a playground, based on its id", function () {
    expect(world.contains("Miami beach")).to.be.false;
  });

  it("can tell when it contains a codeObject, based on its id", function () {
    world.playground("Miami beach");
    expect(world.contains("Miami beach")).to.be.true;
  });
})

describe("World notifies", function() {
  it("when a codeObject code is set", function() {
    var world = new World();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.on('codeObjectUpdated',spy);

    codeObject.setCode("// hello");

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it("not when a codeObject code is set silently", function() {
    var world = new World();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.on('codeObjectUpdated',spy);

    codeObject.setCodeSilently("// hello");

    expect(spy).not.to.have.been.called;
  });

  it("when a codeObject is deleted", function() {
    var world = new World();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.on('codeObjectDeleted',spy);

    codeObject.delete();

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it("not when a codeObject is deleted silently", function() {
    var world = new World();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.on('codeObjectDeleted',spy);

    codeObject.deleteSilently();

    expect(spy).not.to.have.been.called;
  });

});

describe("A playground", function() {
  var world, playground;

  beforeEach(function() {
    world = new World();
    playground = world.playground("Miami beach");
  });

  it(", when it's new, has no codeObject", function () {
    expect(playground.population()).to.deep.equal([]);
  });

  it("can list its codeObject's ids", function () {
    playground.codeObject("bob");
    playground.codeObject("jack");
    expect(playground.population()).to.have.members(["bob","jack"]);
  });

  it("can tell if it is empty", function () {
    expect(playground.isEmpty()).to.be.true;
  });

  it("can tell if it is not empty", function () {
    playground.codeObject("bob");
    expect(playground.isEmpty()).to.be.false;
  });

  it("can tell when it does not contain a codeObject, based on its id", function () {
    expect(playground.contains("bob")).to.be.false;
  });

  it("can tell when it contains a codeObject, based on its id", function () {
    playground.codeObject("bob");
    expect(playground.contains("bob")).to.be.true;
  });

  it("has a id", function () {
    expect(playground.id).to.equal("Miami beach");
  });

  it("has a unique id", function () {
    var anotherPlayground = world.playground("Miami beach");
    expect(anotherPlayground).to.equal(playground);
  });
});

describe("A codeObject", function () {
  var world, playground, bob;

  beforeEach(function() {
    world = new World(),
    playground = world.playground("Miami beach"),
    bob = playground.codeObject("bob");
  });

  it("knows its id", function() {
    expect(bob.id).to.equal("bob");
  });

  it("knows where it is", function() {
    expect(bob.playground).to.equal(playground);
  });

  it("has a unique id", function () {
    var theOtherBob = playground.codeObject("bob");
    expect(theOtherBob).to.equal(bob);
  });

  it("when it is new, has empty code", function () {
    expect(bob.code()).to.equal("");
  });

  it("can set its code", function() {
    bob.setCode("// hello");
    expect(bob.code()).to.equal("// hello");
  });

  it("can set silently its code", function() {
    bob.setCodeSilently("// hello");
    expect(bob.code()).to.equal("// hello");
  });

  it("'s code is not the one another's", function() {
    bob.setCode("// hello");
    var bill = playground.codeObject("bill");
    bill.setCode("// world");
    expect(bob.code()).to.equal("// hello");
    expect(bill.code()).to.equal("// world");
  });

  it("can be created with code",function() {
    var bill = playground.codeObject("bill","// hello");

    expect(bill.code()).to.equal("// hello");
  });

  it("can be deleted", function() {
    bob.delete();

    expect(playground.population()).not.to.contain("bob");
    expect(world.tour()).not.to.contain("Miami beach");
  });

});


