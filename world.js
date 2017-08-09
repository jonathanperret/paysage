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

  function playground(id)  {
    if (playgrounds[id]) return playgrounds[id];
    var codeObjects = {};
    var playground = {
      id: id,
      codeObject: function(id,initCode) {
        if (codeObjects[id]) return codeObjects[id];
        var code = initCode ? initCode : "";
        var codeObject = {
          id: id,
          playground: playground,
          code: function() { return code; },
          updateCode: function(updatedCode, silently) {
            code = updatedCode;
            if (! silently) notifyUpdate(this);
          },
          delete: function(silently) {
            delete codeObjects[id];
            if (playground.isEmpty())
              delete playgrounds[playground.id];
            if (!silently) notifyDelete(this);
          },
        };
        codeObjects[id]=(codeObject);
        return codeObject;
      },
      population: function() {
        return Object.keys(codeObjects);
      },
      isEmpty: function() {
        return Object.keys(codeObjects).length == 0;
      }
    };
    playgrounds[id] = playground;
    return playground;
  }

  return {
    tour: tour,
    playground: playground,
    onCodeObjectUpdate: onCodeObjectUpdate,
    onCodeObjectDelete : onCodeObjectDelete,
  };

}

