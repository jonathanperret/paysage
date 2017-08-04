"use strict";

const Ingoing = require('../persistence/ingoing');
const World = require('../world');

describe("When a file is added or modified,", function() {
  var world, ingoing, loadCreature, creature;

  beforeEach(function() {
    world = World();
    creature = world.playground('any').creature('ugly');
    loadCreature = jasmine.createSpy(loadCreature).
      and.callFake(function(pgname, creatureName, callback) {
        callback(creature)
      });
    ingoing = Ingoing(world,loadCreature);
  });

  it("nothing happens if path does not match */*.pde", function() {

    ingoing.fileAddedOrModified("dir/fileWithTheWrongExtension.md");
    ingoing.fileAddedOrModified("fileAtRoot.md");
    ingoing.fileAddedOrModified("file/with/to/many/subdirs.pde");

    expect(loadCreature).not.toHaveBeenCalled();
  });

  it("a creature is refreshed",function() {

    ingoing.fileAddedOrModified("any/ugly.pde");

    expect(loadCreature).toHaveBeenCalledWith(
        "any","ugly", jasmine.anything());
  });

  it("the creature refresh is notified about",function() {
    var notifyRefresh = jasmine.createSpy('notifyRefresh');
    ingoing.onCreatureCodeRefresh(notifyRefresh);

    ingoing.fileAddedOrModified("any/ugly.pde");

    expect(notifyRefresh).toHaveBeenCalledWith(creature);
  });
});

describe("When a file is removed,", function() {
  var world, ingoing, loadCreature, creature;

  beforeEach(function() {
    world = World();
    creature = world.playground('any').creature('ugly');
    loadCreature = jasmine.createSpy(loadCreature).
      and.callFake(function(pgname, creatureName, callback) {
        callback(creature)
      });
    ingoing = Ingoing(world,loadCreature);
  });

  it("a creature is deleted",function() {
    creature.delete = jasmine.createSpy('creature.delete');

    ingoing.fileRemoved("any/ugly.pde");

    expect(creature.delete).toHaveBeenCalledWith(true);
  });

  it("the creature deleted is notified about",function() {
    var notifyRemove = jasmine.createSpy('notifyRemove');
    ingoing.onCreatureRemove(notifyRemove);

    ingoing.fileRemoved("any/ugly.pde");

    expect(notifyRemove).toHaveBeenCalledWith("any","ugly");
  });

  it("does nothing if path does not match */*.pde", function() {
    var notifyRemove = jasmine.createSpy('notifyRemove');
    ingoing.onCreatureRemove(notifyRemove);

    ingoing.fileRemoved("dir/fileWithTheWrongExtension.md");
    ingoing.fileRemoved("fileAtRoot.md");
    ingoing.fileRemoved("file/with/to/many/subdirs.pde");

    expect(notifyRemove).not.toHaveBeenCalled();
  });
});
