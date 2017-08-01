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

describe("Persitence", function() {
  it("won't remember a commit it has never seen", function(){
    var persistence = Persistence("world");

    expect(persistence.knowsCommit("commitSha")).toBeFalsy();
  });

  it("remembers last seen commit", function(){
    var persistence = Persistence("world");

    persistence.rememberCommit("commitSha");

    expect(persistence.knowsCommit("commitSha")).toBeTruthy();
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
      .and.callFake(function(path,callback){ callback("// content","fileSha"); });
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
    expect(creature.sha).toEqual("fileSha");
  });
});

describe("Persistence, to github,", function() {
  var world, adapter, persistence;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
  });

  it("creates a file when a new creature's code is updated", function() {
    adapter.createFile = jasmine.createSpy("adapter.createFile")
      .and.callFake(function(path,content,callback){callback("commitSha","fileSha");});
    persistence.maybeStart(adapter);
    var creature = world.playground("here").creature("that");

    creature.updateCode("my code");

    expect(adapter.createFile).toHaveBeenCalledWith(
        "here/that.pde",
        "my code",
        jasmine.anything());
    expect(creature.sha).toEqual("fileSha");
    expect(persistence.knowsCommit("commitSha")).toBeTruthy();
  });

  it("updates a file  when a existing creature's code is updated", function() {
    adapter.updateFile = jasmine.createSpy("adapter.updateFile")
      .and.callFake(function(path,content,sha,callback){callback("commitSha", "newFileSha");});
    persistence.maybeStart(adapter);
    var creature = world.playground("here").creature("that","my code");
    creature.sha = "fileSha";

    creature.updateCode("new code");

    expect(adapter.updateFile).toHaveBeenCalledWith(
        "here/that.pde",
        "new code",
        "fileSha",
        jasmine.anything());
    expect(creature.sha).toEqual("newFileSha");
  });

  it("can delete a creature", function() {
    adapter.deleteFile = jasmine.createSpy("adapter.deleteFile")
      .and.callFake(function(fullpath,fileSha,callback){callback("commitSha")});
    persistence.maybeStart(adapter);
    var creature = world.playground("here").creature("that","my code");
    creature.sha = "sha";

    creature.delete();
    expect(adapter.deleteFile).toHaveBeenCalledWith("here/that.pde","sha",
        jasmine.anything());
    expect(persistence.knowsCommit("commitSha")).toBeTruthy();
  });
});

describe("Perstistence check", function() {
  var world, adapter, persistence;

  beforeEach(function() {
    setEnvironmentUp();
    world = World();
    persistence = Persistence(world);
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
  });

  it("refresh creature with a fetched file if its path matches */*.pde", function() {
    adapter.fetchFileContent =
      jasmine.createSpy("adapter.fetchFileContent")
      .and.callFake(function(path,callback){ callback("// content","sha"); });
    var watcher = jasmine.createSpy("creature.refreshCode");
    var creature = world.playground('dir').creature('file');
    creature.refreshCode = watcher;
    persistence.maybeStart(adapter);

    persistence.check("dir/file.pde")

    expect(adapter.fetchFileContent).toHaveBeenCalledWith(
        'dir/file.pde', jasmine.anything());
    var creature = world.playground('dir').creature('file');
    expect(watcher).toHaveBeenCalledWith("// content");
    expect(creature.sha).toEqual("sha");
  });

  it("does nothing if path does not matches */*.pde", function() {
    adapter.fetchFileContent = jasmine.createSpy("adapter.fetchFileContent");
    persistence.maybeStart(adapter);

    persistence.check("dir/fileWithTheWrongExtension.md");
    persistence.check("fileAtRoot.md");
    persistence.check("file/with/to/many/subdirs.pde");

    expect(adapter.fetchFileContent).not.toHaveBeenCalled()
  });
});
