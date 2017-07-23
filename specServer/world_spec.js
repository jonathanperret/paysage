var World = require('../world');

describe("The world", function() {
  it("knows the places to be", function() {
    var world = World();
    world.playground("Miami beach");
    expect(world.tour()).toEqual(["Miami beach"]);
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
  var playground, bob;

  beforeEach(function() {
    playground = World().playground("Miami beach");
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

  it(",when it is new, has empty code", function () {
    expect(bob.code()).toEqual("");
  });

  it("can update its code", function() {
    bob.updateCode("// hello");
    expect(bob.code()).toEqual("// hello");
  });

  it("'s code is the one another's", function() {
    bob.updateCode("// hello");
    bill = playground.creature("bill");
    bill.updateCode("// world");
    expect(bob.code()).toEqual("// hello");
    expect(bill.code()).toEqual("// world");
  });

  it("can be created with code",function() {
    var bill = playground.creature("bill","// hello");
    expect(bill.code()).toEqual("// hello");
  });
});

