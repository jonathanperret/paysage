"use strict";

const World = require('../world');

describe("Persistence restore, at startup,", function() {

  var restore, adapter, loadCreature, world;

  beforeEach(function() {
    adapter = jasmine.createSpyObj("adapter",
                    ['init']);

    adapter.fetchRootDirectories =
      jasmine.createSpy("adapter.fetchRootDirectories")
      .and.callFake(function(callback){ callback(["dirpg1", "dirpg2"]); });

    adapter.fetchFilenames =
      jasmine.createSpy("adapter.fetchFilenames")
      .and.callFake(function(dirname, callback){ 
        callback(["file1.pde", "file2.pde", "file3.txt", "s"]);
      });

    world = World();

    loadCreature = jasmine.createSpy('loadCreature')
      .and.callFake(function(pn,cn) {world.playground(pn).creature(cn).updateCode("code"); });

    restore = require('../persistence/outgoing-restore')(adapter,loadCreature);
  });

  it("restores a playground for every directory at root", function(){

    restore(world);

    expect(adapter.fetchRootDirectories).toHaveBeenCalled();
    expect(world.tour()).toContain("dirpg1");
    expect(world.tour()).toContain("dirpg2");
  });

  it("restores a creature per file matching /\*/<basename>.pde", function(){

    restore(world);

    expect(adapter.fetchFilenames).toHaveBeenCalledWith(
        'dirpg1', jasmine.anything());
    var playground = world.playground('dirpg1');
    expect(playground.population()).toContain('file1');
    expect(playground.population()).toContain('file2');
    expect(playground.population()).not.toContain('file3.txt');
  });

  it("restores creature", function(){

    restore(world);

    function expectLoaded(playgroundName, creatureName) {
      expect(loadCreature)
            .toHaveBeenCalledWith(playgroundName, creatureName);
    }
    expectLoaded('dirpg1','file1');
    expectLoaded('dirpg1','file2');
    expectLoaded('dirpg2','file1');
    expectLoaded('dirpg2','file2');
    expect(loadCreature).toHaveBeenCalledTimes(4);
  });
});

