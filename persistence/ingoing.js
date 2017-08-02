"use strict";

const Path = require('./path');

module.exports = function(aWorld, anAdapter) {

  var world = aWorld,
      adapter = anAdapter;

  var refreshListener = function() {},
      removeListener = function() {};

  function notifyRefresh(refreshed) {
    refreshListener(refreshed)
  };

  function onCreatureCodeRefresh(fn) {
    refreshListener = fn;
  }

  function notifyRemove(playgroundName, creatureName) {
    removeListener(playgroundName,creatureName);
  };

  function onCreatureRemove(fn) {
    removeListener = fn;
  }

  function fileAddedOrModified(path) {
    if (!Path.isAPathForACreature(path)) return;
    var playgroundName = Path.playgroundName(path);
    var creatureName = Path.creatureName(path);
    var refreshCreature = function(content,fileSha) {
      var creature = world.playground(playgroundName)
                      .creature(creatureName)
      creature.refreshCode(content);
      creature.sha = fileSha;
      notifyRefresh(creature);
    };
    adapter.fetchFileContent(path,
                             refreshCreature);
  }

  function fileRemoved(path) {
    if (!Path.isAPathForACreature(path)) return;
    var playgroundName = Path.playgroundName(path);
    var creatureName = Path.creatureName(path);
    world.playground(playgroundName).creature(creatureName).remove();
    notifyRemove(playgroundName,creatureName);
  }

  return {
    notifyRefresh: notifyRefresh,
    onCreatureCodeRefresh: onCreatureCodeRefresh,
    notifyRemove: notifyRemove,
    onCreatureRemove: onCreatureRemove,
    fileAddedOrModified: fileAddedOrModified,
    fileRemoved: fileRemoved,
  }
}

