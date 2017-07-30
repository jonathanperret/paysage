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
    persistence = Persistence(World()),
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
  });

  it("use specific environment variables", function() {
    setEnvironmentUp();

    var started = persistence.maybeStart(adapter);

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

describe("Persistence, at startup,", function() {

  var persistence, adapter, world;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
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

    adapter.fetchFileContent =
      jasmine.createSpy("adapter.fetchFileContent")
      .and.callFake(function(path,callback){ callback("// content","sha"); });
  });

  it("restores a playground for every directory at root", function(){

    persistence.maybeStart(adapter);

    expect(adapter.fetchRootDirectories).toHaveBeenCalled();
    expect(world.tour()).toContain("dirpg1");
    expect(world.tour()).toContain("dirpg2");
  });

  it("restores a creature per file maching /*/<basename>.pde", function(){

    persistence.maybeStart(adapter);

    expect(adapter.fetchFilenames).toHaveBeenCalledWith(
        'dirpg1', jasmine.anything());
    var playground = world.playground('dirpg1');
    expect(playground.population()).toContain('file1');
    expect(playground.population()).toContain('file2');
    expect(playground.population()).not.toContain('file3.txt');
  });

  it("restores creature's code and sha", function(){

    persistence.maybeStart(adapter);

    expect(adapter.fetchFileContent).toHaveBeenCalledWith(
        'dirpg1/file1.pde', jasmine.anything());
    var creature = world.playground('dirpg1').creature('file1');
    expect(creature.code()).toEqual("// content");
    expect(creature.sha).toEqual("sha");
  });
});

describe("Persistence", function() {
  var world, adapter, persistence;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
  });

  it("can save new creatures", function() {
    adapter.createFile = jasmine.createSpy("adapter.createFile")
      .and.callFake(function(path,content,callback){callback("sha");});
    persistence.maybeStart(adapter);
    var creature = world.playground("here").creature("that");

    creature.updateCode("my code");

    expect(adapter.createFile).toHaveBeenCalledWith(
        "here/that.pde",
        "my code",
        jasmine.anything());
    expect(creature.sha).toEqual("sha");
  });

  it("can update creatures code", function() {
    adapter.updateFile = jasmine.createSpy("adapter.updateFile")
      .and.callFake(function(path,content,sha,callback){callback("newsha");});
    persistence.maybeStart(adapter);
    var creature = world.playground("here").creature("that","my code");
    creature.sha = "sha";

    creature.updateCode("new code");

    expect(adapter.updateFile).toHaveBeenCalledWith(
        "here/that.pde",
        "new code",
        "sha",
        jasmine.anything());
    expect(creature.sha).toEqual("newsha");
  });

  it("can delete a creature", function() {
    adapter.deleteFile = jasmine.createSpy("adapter.deleteFile");
    persistence.maybeStart(adapter);
    var creature = world.playground("here").creature("that","my code");
    creature.sha = "sha";

    creature.delete();
    expect(adapter.deleteFile).toHaveBeenCalledWith("here/that.pde","sha");
  });
});
