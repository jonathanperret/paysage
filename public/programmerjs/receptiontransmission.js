var Paysage = window.Paysage || {};

(function () {
  'use strict';

  // Requires a sourcebuilder script defining Paysage.getCompleteCodeObject()
  // Requires a editingcode script defining Paysage.setCodeId(), Paysage.setCode() and Paysage.setObjectList(data)

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

  io.on('objects list', function (data) {
    var deleteCode = function (codeObjectId) {
      var deleteData = {
        codeObjectId: codeObjectId
      };
      io.emit('code delete', deleteData);
    };
    Paysage.setObjectList(data, deleteCode);
  });

  io.on('source code', function (data) {
    Paysage.setCodeId(data.codeObjectId);
    Paysage.setCode(data.code);
  });
}());
