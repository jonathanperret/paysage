/* global $ */
var Paysage = window.Paysage || {};

(function () {
  'use strict';

  // Requires a sourcebuilder script defining Paysage.getCompleteCodeObject()
  // Requires a editingcode script defining Paysage.setCodeId(),
  // Paysage.setCodeName() and Paysage.setCode()

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

  Paysage.renameCode = function (codeObjectId, newName) {
    var data = {
      codeObjectId: codeObjectId,
      newName: newName
    };
    io.emit('code rename', data);
  };

  io.on('objects list', function (data) {
    var objectIdsNames = data.objectIdsAndNames;
    var $objects = $('#objects');
    $objects.empty();
    $objects.append(objectIdsNames.reverse().map(function (objectIdName) {
      var $openLink = $("<a href='#'>").text(objectIdName.name);
      $openLink.click(function (event) {
        event.preventDefault();
        Paysage.requestCode(objectIdName.id);
      });
      var $deleteLink = $('<a class="glyphicon glyphicon-trash" href="#">');
      $deleteLink.click(function (event) {
        event.preventDefault();
        Paysage.deleteCode(objectIdName.id);
      });
      return $('<li>').append($openLink).append(' - ').append($deleteLink);
    }));
  });

  io.on('source code', function (data) {
    Paysage.setCodeId(data.codeObjectId);
    Paysage.setCodeName(data.name ? data.name : data.codeObjectId);
    Paysage.setCode(data.code);
  });
}());
