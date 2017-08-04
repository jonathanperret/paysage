"use strict";

const Path = require('./path');

module.exports = function(aWorld, loadCreature) {

  var world = aWorld;

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
    loadCreature(playgroundName,creatureName, function(creature){
      notifyRefresh(creature);
    });
  }

  function fileRemoved(path) {
    if (!Path.isAPathForACreature(path)) return;
    var playgroundName = Path.playgroundName(path);
    var creatureName = Path.creatureName(path);
    world.playground(playgroundName).creature(creatureName).delete(true);
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

