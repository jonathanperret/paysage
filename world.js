module.exports = function() {

  var playgrounds = {};

  function tour() {
    return Object.keys(playgrounds);
  }

  function playground(name)  {
    if (playgrounds[name]) return playgrounds[name];
    var creatures = {};
    var playground = {
      name: name,
      creatures: function() { return []; },
      creature: function(name,initCode) {
        if (creatures[name]) return creatures[name];
        var code = initCode ? initCode : "";
        var creature = {
          name: name,
          playground: playground,
          code: function() { return code; },
          updateCode: function(updatedCode) { code = updatedCode; },
        };
        creatures[name]=(creature);
        return creature;
      },
      population: function() {
        return Object.keys(creatures);
      },
      isEmpty: function() {
        return Object.keys(creatures).length == 0;
      }
    };
    playgrounds[name] = playground;
    return playground;
  }

  return {
    tour: tour,
    playground: playground
  };

}
