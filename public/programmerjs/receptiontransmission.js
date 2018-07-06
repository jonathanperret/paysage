var Paysage = window.Paysage || {};

(function () {
  'use strict';

  // Requires a sourcebuilder script defining Paysage.getCompleteCodeObject()
  // Requires a editingcode script defining Paysage.setCodeId(),
  // Paysage.setObjectList(data), Paysage.setCodeName() and Paysage.setCode()

  Paysage.requestCode = function (codeObjectId) {
    var data = {
      codeObjectId: codeObjectId
    };
    io.emit('request code', data);
  };

  var playgroundid = document.getElementById('playgroundid').value;
  var clientType = document.getElementById('clientType').value;

  var io = window.io({ query: {
    playgroundId: playgroundid,
    client: clientType
  }}).connect();

  Paysage.goLive = function () {
    function emitData (data) {
      console.log(data);
      io.emit('code update', data);
    }
    Paysage.getCompleteCodeObject(emitData);
  };
  document.getElementById('go-live').addEventListener('click', Paysage.goLive);

  Paysage.deleteCode = function (codeObjectId) {
    var data = {
      codeObjectId: codeObjectId
    };
    io.emit('code delete', data);
  };

  io.on('objects list', function (population) {
    Paysage.setObjectList(population, Paysage.deleteCode);
  });

  io.on('source code', function (data) {
    Paysage.setCodeId(data.codeObjectId);
    Paysage.setCodeName(data.name);
    Paysage.setCode(data.code);
  });
}());
