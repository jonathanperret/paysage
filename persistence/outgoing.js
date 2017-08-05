const path = require('./path');

module.exports = function(world, adapter, state) {

  function loadCreature(playgroundName, creatureName, callback) {
    var createCreature = function(content,fileSha) {
      var creature = world.playground(playgroundName)
                      .creature(creatureName);
      creature.updateCode(content,true);
      creature.sha = fileSha;
      if (callback) callback(creature);
    };
    adapter.fetchFileContent(path.forCreature(playgroundName, creatureName),
                             createCreature);;
  }

  function creatureCodeUpdated(creature) {
    var fullpath = path.forCreature(creature.playground.name, creature.name);
    var updateSha = function(commitSha, fileSha) {
      state.rememberCommit(commitSha);
      creature.sha = fileSha;
    }
    if (creature.sha)
      adapter.updateFile(fullpath,
                         creature.code(),
                         creature.sha,
                         updateSha);
    else
      adapter.createFile(fullpath,
                         creature.code(),
                         updateSha);
  }

  function creatureDeleted(creature) {
    var fullpath = path.forCreature(creature.playground.name, creature.name);
    adapter.deleteFile(fullpath, creature.sha, state.rememberCommit);
  }

  return {
    loadCreature: loadCreature,
    creatureCodeUpdated: creatureCodeUpdated,
    creatureDeleted: creatureDeleted,
    restore: require('./outgoing-restore')(adapter,loadCreature)
  };
}
