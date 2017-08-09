"use strict";

module.exports = function() {

  var playgrounds = {},
      notifyUpdate = function(){},
      notifyDelete = function(){}

  function tour() {
    return Object.keys(playgrounds);
  }

  function onCodeObjectUpdate(fn) {
    notifyUpdate = fn;
  }

  function onCodeObjectDelete(fn) {
    notifyDelete = fn;
  }

  function playground(name)  {
    if (playgrounds[name]) return playgrounds[name];
    var codeObjects = {};
    var playground = {
      name: name,
      codeObject: function(name,initCode) {
        if (codeObjects[name]) return codeObjects[name];
        var code = initCode ? initCode : "";
        var codeObject = {
          name: name,
          playground: playground,
          code: function() { return code; },
          updateCode: function(updatedCode, silently) {
            code = updatedCode;
            if (! silently) notifyUpdate(this);
          },
          delete: function(silently) {
            delete codeObjects[name];
            if (playground.isEmpty())
              delete playgrounds[playground.name];
            if (!silently) notifyDelete(this);
          },
        };
        codeObjects[name]=(codeObject);
        return codeObject;
      },
      population: function() {
        return Object.keys(codeObjects);
      },
      isEmpty: function() {
        return Object.keys(codeObjects).length == 0;
      }
    };
    playgrounds[name] = playground;
    return playground;
  }

  return {
    tour: tour,
    playground: playground,
    onCodeObjectUpdate: onCodeObjectUpdate,
    onCodeObjectDelete : onCodeObjectDelete,
  };

}

