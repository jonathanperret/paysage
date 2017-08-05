"use strict";

const Persistence = require('../persistence');
const World = require('../world');

function setEnvironmentUp() {
    process.env.GITHUB_OWNER="owner";
    process.env.GITHUB_REPO="repo";
    process.env.GITHUB_TOKEN="token";
}

describe("Persistence initialisation", function() {

  var persistence, adapter;

  beforeEach(function() {
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
    persistence = Persistence(World(),adapter);
  });

  it("use specific environment variables", function() {
    setEnvironmentUp();

    var started = persistence.maybeStart();

    expect(adapter.init).toHaveBeenCalledWith("owner","repo","token");
    expect(started).toBeTruthy();
  });

  it("won't start if some environment variables are not set", function() {
    delete(process.env.GITHUB_TOKEN);

    var started = persistence.maybeStart(adapter);

    expect(adapter.init).not.toHaveBeenCalled();
    expect(started).toBeFalsy();
  });
});

describe("Persistence", function() {

  var persistence, adapter, outgoing, world;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    adapter = jasmine.createSpyObj("adapter", ['init']);
    outgoing = jasmine.createSpyObj("outgoing", ['restore']);
    persistence = Persistence(world,adapter,outgoing);
  });

  it("restores the world at startup", function(){

    persistence.maybeStart(adapter);

    expect(outgoing.restore).toHaveBeenCalledWith(world);
  });

  it('provides a router to webhook', function() {

    expect(typeof(persistence.router)).toEqual("function");
  });
});

describe("Persistence detects ", function() {

  var world, outgoing, persistence;

  beforeEach(function() {
    world = World();
    outgoing = jasmine.createSpyObj('outgoing', ['restore','creatureCodeUpdated','creatureDeleted']);
    persistence = Persistence(world, null, outgoing);
    setEnvironmentUp(); // trouver un moyen de virer ça
    persistence.maybeStart();
  });

  it("creature updates", function() {
    var creature = world.playground('here').creature('that');

    creature.updateCode('// new code');

    expect(outgoing.creatureCodeUpdated).toHaveBeenCalledWith(creature);
  });

  it("creatures deletes", function() {
    var creature = world.playground('here').creature('that');

    creature.delete();

    expect(outgoing.creatureDeleted).toHaveBeenCalledWith(creature);
  });

});
