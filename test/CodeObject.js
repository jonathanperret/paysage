"use strict";

const CodeObject = require('../CodeObject');
const World = require('../World');

describe("A code object", function () {
  var world, playground, bob;

  beforeEach(function() {
    world = new World;
    playground = world.getOrCreatePlayground('any');
    bob = new CodeObject(world,playground,'bob');
  });

  it("knows its id", function() {
    expect(bob.id).to.equal("bob");
  });

  it("knows where it is", function() {
    expect(bob.playground).to.equal(playground);
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
    var bill = playground.getOrCreateCodeObject("bill");
    bill.setCode("// world");
    expect(bob.code()).to.equal("// hello");
    expect(bill.code()).to.equal("// world");
  });

  it("can be created with code",function() {
    var bill = playground.getOrCreateCodeObject("bill","// hello");

    expect(bill.code()).to.equal("// hello");
  });

});


