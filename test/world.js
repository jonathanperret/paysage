"use strict";


var createWorld = require('../world');

describe("createWorld tour", function() {
  it("lists all the playgrounds", function() {
    var world = createWorld();
    world.playground("Miami beach");
    expect(world.tour()).to.deep.equal(["Miami beach"]);
  });
})

describe("createWorld notifies", function() {
  it("when a codeObject code is updated", function() {
    var world = createWorld();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.onCodeObjectUpdate(spy);

    codeObject.updateCode("// hello");

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it("not when a codeObject code is updated silently", function() {
    var world = createWorld();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.onCodeObjectUpdate(spy);

    codeObject.updateCode("// hello",true);

    expect(spy).not.to.have.been.called;
  });

  it("when a codeObject is deleted", function() {
    var world = createWorld();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.onCodeObjectDelete(spy);

    codeObject.delete();

    expect(spy).to.have.been.calledWith(codeObject);
  });

  it("not when a codeObject is deleted silently", function() {
    var world = createWorld();
    var spy = sinon.spy();
    var codeObject = world.playground("any").codeObject("ugly");
    world.onCodeObjectDelete(spy);

    codeObject.delete(true);

    expect(spy).not.to.have.been.called;
  });

});

describe("A playground", function() {
  var world, playground;

  beforeEach(function() {
    world = createWorld();
    playground = world.playground("Miami beach");
  });

  it(", when it's new, has no codeObject", function () {
    expect(playground.population()).to.deep.equal([]);
  });

  it("can name its codeObjects", function () {
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

  it("has a name", function () {
    expect(playground.name).to.equal("Miami beach");
  });

  it("has a unique name", function () {
    var anotherPlayground = world.playground("Miami beach");
    expect(anotherPlayground).to.equal(playground);
  });
});

describe("A codeObject", function () {
  var world, playground, bob;

  beforeEach(function() {
    world = createWorld(),
    playground = world.playground("Miami beach"),
    bob = playground.codeObject("bob");
  });

  it("knows its name", function() {
    expect(bob.name).to.equal("bob");
  });

  it("knows where it is", function() {
    expect(bob.playground).to.equal(playground);
  });

  it("has a unique name", function () {
    var theOtherBob = playground.codeObject("bob");
    expect(theOtherBob).to.equal(bob);
  });

  it("when it is new, has empty code", function () {
    expect(bob.code()).to.equal("");
  });

  it("can update its code", function() {
    bob.updateCode("// hello");
    expect(bob.code()).to.equal("// hello");
  });

  it("'s code is not the one another's", function() {
    bob.updateCode("// hello");
    var bill = playground.codeObject("bill");
    bill.updateCode("// world");
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


