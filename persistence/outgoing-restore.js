"use strict";

module.exports = function(adapter, loadCreature) {
  return function(world) {

    loadPlaygrounds(loadCreature);

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

  };
}
