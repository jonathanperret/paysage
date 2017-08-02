module.exports.forCreature =  function forCreature(playgroundName,creatureName) {
  return playgroundName + "/" + creatureName + '.pde';
}

module.exports.isAPathForACreature = function isAPathForACreature(path) {
  return path.match(/^[^/]+\/[^/]+\.pde/);
}

module.exports.playgroundName = function playgroundName(path) {
  return path.substring(0, path.indexOf('/'));
}

module.exports.creatureName = function creatureName(path) {
  return path.substring(path.indexOf('/')+1,path.length-4)
}
