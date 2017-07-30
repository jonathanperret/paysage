"use strict";

module.exports = function(aWorld) {
  var world = aWorld;
  var enabled = false;
  var adapter;

  function maybeStart(anAdapter) {
    adapter = anAdapter ? anAdapter : require('./github');
    var owner = process.env.GITHUB_OWNER,
        repo = process.env.GITHUB_REPO,
        token = process.env.GITHUB_TOKEN;
    enabled = owner && repo && token;
    if (enabled)
      start(adapter,owner,repo,token);
    return enabled;
  }

  function start(adapter,owner,repo,token) {
    adapter.init(owner, repo, token);
    world.onCreatureCodeUpdate(saveCreature);
    world.onCreatureDelete(deleteCreature);
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

  function loadCreature(playgroundName, creatureName) {
    var createCreature = function(content,sha) {
      var creature = world.playground(playgroundName)
                      .creature(creatureName, content);
      creature.sha = sha;
    };
    adapter.fetchFileContent(path(playgroundName, creatureName),
                             createCreature);
  }

  function saveCreature(creature) {
    var fullPath = path(creature.playground.name, creature.name);
    var updateSha = function(sha) { creature.sha = sha; }
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

  function deleteCreature(creature) {
    var fullPath = path(creature.playground.name, creature.name);
    adapter.deleteFile(fullPath, creature.sha);
  }

  return {
    maybeStart: maybeStart,
  }
}
