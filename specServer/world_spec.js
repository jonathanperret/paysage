"use strict";

var World = require('../world');

describe("World tour", function() {
  it("lists all the playground", function() {
    var world = World();
    world.playground("Miami beach");
    expect(world.tour()).toEqual(["Miami beach"]);
  });
})

describe("World notifies", function() {
  it("when a creature code is updated", function() {
    var world = World();
    var spy = jasmine.createSpy("'update' listener");
    var creature = world.playground("any").creature("ugly");
    world.onCreatureCodeUpdate(spy);

    creature.updateCode("// hello");

    expect(spy).toHaveBeenCalledWith(creature);
  });

  it("not when a creature code is updated silently", function() {
    var world = World();
    var spy = jasmine.createSpy("'update' listener");
    var creature = world.playground("any").creature("ugly");
    world.onCreatureCodeUpdate(spy);

    creature.updateCode("// hello",true);

    expect(spy).not.toHaveBeenCalled();
  });

  it("when a creature is deleted", function() {
    var world = World();
    var spy = jasmine.createSpy("'delete' listener");
    var creature = world.playground("any").creature("ugly");
    world.onCreatureDelete(spy);

    creature.delete();

    expect(spy).toHaveBeenCalledWith(creature);
  });

  it("not when a creature is deleted silently", function() {
    var world = World();
    var spy = jasmine.createSpy("'delete' listener");
    var creature = world.playground("any").creature("ugly");
    world.onCreatureDelete(spy);

    creature.delete(true);

    expect(spy).not.toHaveBeenCalled();
  });

});

describe("A playground", function() {
  var world, playground;

  beforeEach(function() {
    world = World();
    playground = world.playground("Miami beach");
  });

  it(", when it's new, has no creature", function () {
    expect(playground.creatures()).toEqual([]);
  });

  it("can name its creatures", function () {
    playground.creature("bob");
    playground.creature("jack");
    expect(playground.population())
      .toEqual(jasmine.objectContaining(["bob","jack"]));
  });

  it("can tell if it is empty", function () {
    expect(playground.isEmpty()).toBeTruthy();
  });

  it("can tell if it is not empty", function () {
    playground.creature("bob");
    expect(playground.isEmpty()).toBeFalsy();
  });

  it("has a name", function () {
    expect("Miami beach", playground.name).toBe("Miami beach");
  });

  it("has a unique name", function () {
    var anotherPlayground = world.playground("Miami beach");
    expect(anotherPlayground).toBe(playground);
  });
});

describe("A creature", function () {
  var world, playground, bob;

  beforeEach(function() {
    world = World(),
    playground = world.playground("Miami beach"),
    bob = playground.creature("bob");
  });

  it("knows its name", function() {
    expect(bob.name).toEqual("bob");
  });

  it("knows where it is", function() {
    expect(bob.playground).toBe(playground);
  });

  it("has a unique name", function () {
    var theOtherBob = playground.creature("bob");
    expect(theOtherBob).toBe(bob);
  });

  it("when it is new, has empty code", function () {
    expect(bob.code()).toEqual("");
  });

  it("can update its code", function() {
    bob.updateCode("// hello");
    expect(bob.code()).toEqual("// hello");
  });

  it("'s code is the one another's", function() {
    bob.updateCode("// hello");
    var bill = playground.creature("bill");
    bill.updateCode("// world");
    expect(bob.code()).toEqual("// hello");
    expect(bill.code()).toEqual("// world");
  });

  it("can be created with code",function() {
    var bill = playground.creature("bill","// hello");

    expect(bill.code()).toEqual("// hello");
  });

  it("can be deleted", function() {
    bob.delete();

    expect(playground.population()).not.toContain("bob");
    expect(world.tour()).not.toContain("Miami beach");
  });

});


