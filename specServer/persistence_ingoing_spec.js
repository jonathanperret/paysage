"use strict";

const Persistence = require('../persistence');
const World = require('../world');

function setEnvironmentUp() {
    process.env.GITHUB_OWNER="owner";
    process.env.GITHUB_REPO="repo";
    process.env.GITHUB_TOKEN="token";
}

describe("Persistence ingoing",function(){
  var world, persistence, adapter, creature;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
    creature = world.playground("any").creature("ugly");
    adapter = jasmine.createSpyObj('adapter',
        ['init', 'fetchRootDirectories']);
  });
  it("notifies when it refreshes a creature",function() {
    var spy = jasmine.createSpy('creature refresh listener');
    adapter.fetchFileContent =
      jasmine.createSpy("adapter.fetchFileContent")
      .and.callFake(function(path,callback){ callback("// content","fileSha");});
    persistence.maybeStart(adapter);

    persistence.onCreatureCodeRefresh(spy);
    persistence.fileAddedOrModified("any/ugly.pde");

    expect(spy).toHaveBeenCalledWith(creature);
  });

  it("notifies when a creature is removed",function() {
    var spy = jasmine.createSpy('creature remove listener');
    adapter.fetchFileContent =
      jasmine.createSpy("adapter.deleteFile")
      .and.callFake(function(fullpath,fileSha,callback){callback("commitSha")});
    persistence.maybeStart(adapter);

    persistence.onCreatureRemove(spy);
    persistence.fileRemoved("any/ugly.pde");

    expect(spy).toHaveBeenCalledWith("any","ugly");
  });
});

describe("Perstistence, when a file is added or modified,", function() {
  var world, adapter, persistence;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
  });

  it("refreshes creature if file path matches */*.pde", function() {
    adapter.fetchFileContent =
      jasmine.createSpy("adapter.fetchFileContent")
      .and.callFake(function(path,callback){ callback("// content","fileSha"); });
    var watcher = jasmine.createSpy("creature.refreshCode");
    var creature = world.playground('dir').creature('file');
    creature.refreshCode = watcher;
    persistence.maybeStart(adapter);

    persistence.fileAddedOrModified("dir/file.pde")

    expect(adapter.fetchFileContent).toHaveBeenCalledWith(
        'dir/file.pde', jasmine.anything());
    var creature = world.playground('dir').creature('file');
    expect(watcher).toHaveBeenCalledWith("// content");
    expect(creature.sha).toEqual("fileSha");
  });

  it("does nothing if path does not match */*.pde", function() {
    adapter.fetchFileContent = jasmine.createSpy("adapter.fetchFileContent");
    persistence.maybeStart(adapter);

    persistence.fileAddedOrModified("dir/fileWithTheWrongExtension.md");
    persistence.fileAddedOrModified("fileAtRoot.md");
    persistence.fileAddedOrModified("file/with/to/many/subdirs.pde");

    expect(adapter.fetchFileContent).not.toHaveBeenCalled()
  });
});

describe("Perstistence. when a file is removed,", function() {
  var world, adapter, persistence, creature;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
    persistence.maybeStart(adapter);
    creature = world.playground('dir').creature('file');
    creature.remove = jasmine.createSpy("creature.remove");
  });

  it("removes creature if the file path matches */*.pde", function() {
    persistence.fileRemoved("dir/file.pde")

    expect(creature.remove).toHaveBeenCalled();
  });

  it("does nothing if path does not match */*.pde", function() {
    var spy = jasmine.createSpy('notifyRemove');
    adapter.deleteFile = jasmine.createSpy("adapter.deleteFile")
      .and.callFake(function(fullpath,fileSha,callback){callback("commitSha")});
    persistence.onCreatureRemove(spy);

    persistence.fileRemoved("dir/fileWithTheWrongExtension.md");
    persistence.fileRemoved("fileAtRoot.md");
    persistence.fileRemoved("file/with/to/many/subdirs.pde");

    expect(spy).not.toHaveBeenCalled();
  });
});
