"use strict";

module.exports = function(aWorld) {
  var world = aWorld,
      enabled = false,
      adapter,
      ingoing;


  function maybeStart(anAdapter) {
    adapter = anAdapter ? anAdapter : require('./github');
    ingoing = require('./ingoing')(world,adapter);
    var owner = process.env.GITHUB_OWNER,
        repo = process.env.GITHUB_REPO,
        token = process.env.GITHUB_TOKEN;
    enabled = owner && repo && token;
    if (enabled)
      start(adapter, owner, repo, token);
    return enabled;
  }

  function start(adapter, owner, repo, token) {
    adapter.init(owner, repo, token);
    world.onCreatureCodeUpdate(creatureCodeUpdated);
    world.onCreatureDelete(creatureDeleted);
    loadPlaygrounds();
  }

  function loadPlaygrounds() {
    adapter.fetchRootDirectories(function(names){
      names.forEach( function(name) {
        loadPlayground(name);
      });
    });
  }

  function loadPlayground(playgroundName) {
    var dirname = playgroundName;
    adapter.fetchFilenames(playgroundName, function(filenames) {
      filenames.forEach(function(filename) {
        if ( filename.indexOf('.pde', filename.length-4) > 0) {
          var creatureName = filename.substring(0, filename.length-4);
          loadCreature(playgroundName, creatureName);
        }
      });
    });
  }

  function path(playgroundName,creatureName) {
    return playgroundName + "/" + creatureName + '.pde';
  }

  function matchCreaturePath(path) {
    return path.match(/^[^/]+\/[^/]+\.pde/);
  }

  function playgroundNameFromPath(path) {
    return path.substring(0, path.indexOf('/'));
  }

  function creatureNameFromPath(path) {
    return path.substring(path.indexOf('/')+1,path.length-4)
  }

  function loadCreature(playgroundName, creatureName) {
    var createCreature = function(content,fileSha) {
      var creature = world.playground(playgroundName)
                      .creature(creatureName, content);
      creature.sha = fileSha;
    };
    adapter.fetchFileContent(path(playgroundName, creatureName),
                             createCreature);
  }

  function creatureCodeUpdated(creature) {
    var fullPath = path(creature.playground.name, creature.name);
    var updateSha = function(commitSha, fileSha) {
      rememberCommit(commitSha);
      creature.sha = fileSha;
    }
    if (creature.sha)
      adapter.updateFile(fullPath,
                         creature.code(),
                         creature.sha,
                         updateSha);
    else
      adapter.createFile(fullPath,
                         creature.code(),
                         updateSha);
  }

  function creatureDeleted(creature) {
    var fullPath = path(creature.playground.name, creature.name);
    adapter.deleteFile(fullPath, creature.sha, rememberCommit);
  }

  var lastSeenCommit;

  function knowsCommit(id) {
    return lastSeenCommit == id;
  }

  function rememberCommit(id) {
    lastSeenCommit = id;
  }

  return {
    maybeStart: maybeStart,
    rememberCommit: rememberCommit,
    knowsCommit: knowsCommit,
    fileAddedOrModified: function(path) { return ingoing.fileAddedOrModified(path); },
    fileRemoved: function(path) { return ingoing.fileRemoved(path); } ,
    onCreatureCodeRefresh: function(fn) { ingoing.onCreatureCodeRefresh(fn); },
    onCreatureRemove: function(fn) { ingoing.onCreatureRemove(fn); },
  }
}
