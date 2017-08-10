"use strict";

module.exports = function() {

  var playgrounds = Object.create(null),
      notifyUpdate = function(){},
      notifyDelete = function(){}

  function tour() {
    return Object.keys(playgrounds);
  }

  function contains(id) {
    return Object.keys(playgrounds).indexOf(id)>=0;
  }

  function onCodeObjectUpdate(fn) {
    notifyUpdate = fn;
  }

  function onCodeObjectDelete(fn) {
    notifyDelete = fn;
  }

  function playground(id)  {
    if (playgrounds[id]) return playgrounds[id];
    var codeObjects = Object.create(null);
    var playground = {
      id: id,
      codeObject: function(id,initCode) {
        if (codeObjects[id]) return codeObjects[id];
        var code = initCode ? initCode : "";
        var codeObject = {
          id: id,
          playground: playground,
          code: function() { return code; },
          updateCode: function(updatedCode) {
            code = updatedCode;
            notifyUpdate(this);
          },
          updateCodeSilently: function(updatedCode) {
            code = updatedCode;
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
      },
      contains: function(id) {
        return Object.keys(codeObjects).indexOf(id)>=0;
      }
    };
    playgrounds[id] = playground;
    return playground;
  }

  return {
    tour: tour,
    contains: contains,
    playground: playground,
    onCodeObjectUpdate: onCodeObjectUpdate,
    onCodeObjectDelete : onCodeObjectDelete,
  };

}

