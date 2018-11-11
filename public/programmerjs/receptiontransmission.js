var Paysage = window.Paysage || {};

(function () {
  'use strict';

  var playgroundid = document.getElementById('playgroundid').value;
  var clientType = document.getElementById('clientType').value;

  var io = window.io({
    query: {
      playgroundId: playgroundid,
      client: clientType
    }
  }).connect();

  // Transmission

  Paysage.requestCode = function (codeObjectId) {
    io.emit('request code', {
      codeObjectId: codeObjectId
    });
  };

  Paysage.emitCodeUpdate = function (data) {
    console.log(data);
    io.emit('code update', data);
  };

  Paysage.deleteCode = function (codeObjectId) {
    var data = {
      codeObjectId: codeObjectId
    };
    io.emit('code delete', data);
  };

  // Reception

  // Requires a editingcode script defining Paysage.setCodeId(),
  // Paysage.setObjectList(data), Paysage.setCodeName() and Paysage.setCode()

  io.on('objects list', function (population) {
    Paysage.setObjectList(population, Paysage.deleteCode);
  });

  io.on('source code', function (data) {
    Paysage.setCodeId(data.codeObjectId);
    Paysage.setCodeName(data.name);
    Paysage.setCode(data.code);
  });
}());
