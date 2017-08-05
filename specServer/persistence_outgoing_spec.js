"use strict";

const World = require('../world');

describe("Persistence outgoing events :", function() {
  var world, adapter, state, outgoing;

  beforeEach(function() {
    world = World();
    adapter = jasmine.createSpyObj("adapter",
                    ['init','fetchRootDirectories']);
    adapter.fetchFileContent =
      jasmine.createSpy("adapter.fetchFileContent")
      .and.callFake(function(path,callback){ callback("// content","fileSha"); });

    state = require('../persistence/state')();
    outgoing = require('../persistence/outgoing')(world, adapter, state);
  });

  describe("Creature loading", function() {

    beforeEach(function() {
      adapter.fetchFileContent =
        jasmine.createSpy("adapter.fetchFileContent")
        .and.callFake(function(path,callback){ callback("// content","fileSha"); });
    });

    it("restores creature's code and sha from a file", function() {

      outgoing.loadCreature('here','that');

      expect(adapter.fetchFileContent).toHaveBeenCalledWith(
          'here/that.pde', jasmine.anything());
      var creature = world.playground('here').creature('that');
      expect(creature.code()).toEqual("// content");
      expect(creature.sha).toEqual("fileSha");
    });

    it("can refresh an existing creature", function() {
      var creature = world.playground('here').creature('that');

      outgoing.loadCreature('here','that');

      expect(adapter.fetchFileContent).toHaveBeenCalledWith(
          'here/that.pde', jasmine.anything());
      expect(creature.code()).toEqual("// content");
      expect(creature.sha).toEqual("fileSha");
    });


    it("does it silently", function() {
      var spy = jasmine.createSpy("'update' listener");
      world.onCreatureCodeUpdate(spy);

      outgoing.loadCreature('here','that');

      expect(spy).not.toHaveBeenCalled();
    });

    it("calls back when done", function() {
      var whenDone = jasmine.createSpy("whenDone");

      outgoing.loadCreature('here','that', whenDone);

      var creature = world.playground('here').creature('that');
      expect(whenDone).toHaveBeenCalledWith(creature);
    });
  });

  describe("Creature creation", function() {

    beforeEach(function() {
      adapter.createFile = jasmine.createSpy("adapter.createFile")
        .and.callFake(function(path,content,callback){callback("commitSha","fileSha");});
    });

    it("triggers a file creation", function() {
      var creature = world.playground("here").creature("that","my code");

      outgoing.creatureCodeUpdated(creature);

      expect(adapter.createFile).toHaveBeenCalledWith(
          "here/that.pde",
          "my code",
          jasmine.anything());
      expect(creature.sha).toEqual("fileSha");
    });

    it("remembers of the commit where the file was created", function(){
      var creature = world.playground("here").creature("that","my code");

      outgoing.creatureCodeUpdated(creature);

      expect(state.knowsCommit("commitSha")).toBeTruthy();
    });
  });

  describe("Creature update", function() {
    beforeEach(function() {
      adapter.updateFile = jasmine.createSpy("adapter.updateFile")
        .and.callFake(function(path,content,sha,callback){callback("commitSha", "newFileSha");});
    });

    it("triggers a file update", function() {
      var creature = world.playground("here").creature("that","my code");
      creature.sha = "fileSha";

      outgoing.creatureCodeUpdated(creature);

      expect(adapter.updateFile).toHaveBeenCalledWith(
          "here/that.pde",
          "my code",
          "fileSha",
          jasmine.anything());
      expect(creature.sha).toEqual("newFileSha");
    });

    it("remembers of the commit where the file was updated", function(){
      var creature = world.playground("here").creature("that","my code");
      creature.sha = "fileSha";

      outgoing.creatureCodeUpdated(creature);

      expect(state.knowsCommit("commitSha")).toBeTruthy();
    });
  });

  describe("Creature deletion", function() {

    beforeEach(function() {
      adapter.deleteFile = jasmine.createSpy("adapter.deleteFile")
        .and.callFake(function(fullpath,fileSha,callback){callback("commitSha")});
    });

    it("triggers a file delete", function() {
      var creature = world.playground("here").creature("that","my code");
      creature.sha = "fileSha";

      outgoing.creatureDeleted(creature);

      expect(adapter.deleteFile).toHaveBeenCalledWith("here/that.pde","fileSha",
          jasmine.anything());
    });

    it("remembers of the commit where the file was deleted", function(){
      var creature = world.playground("here").creature("that","my code");
      creature.sha = "fileSha";

      outgoing.creatureDeleted(creature);

      expect(state.knowsCommit("commitSha")).toBeTruthy();
    });
  });
});
