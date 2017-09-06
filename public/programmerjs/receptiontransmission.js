/* global $ */
var Paysage = window.Paysage || {};

(function () {
  'use strict';

  // Require a sourcebuilder script defining Paysage.getCompleteCodeObject()
  // Require a codeinitialization script defining Paysage.setCodeId()

  var playgroundid = document.getElementById('playgroundid').value;
  var clientType = document.getElementById('clientType').value;

  var io = window.io({ query: {
    playgroundId: playgroundid,
    client: clientType
  }}).connect();

  document.getElementById('go-live').addEventListener('click', function () {
    var emitData = function (data) {
      console.log(data);
      io.emit('code update', data);
    };
    Paysage.getCompleteCodeObject(emitData);
  });

  Paysage.requestCode = function (codeObjectId) {
    var data = {
      codeObjectId: codeObjectId
    };
    io.emit('request code', data);
  };

  function deleteCode (codeObjectId) {
    var data = {
      codeObjectId: codeObjectId
    };
    io.emit('code delete', data);
  }

  io.on('objects list', function (data) {
    var objectIds = data.objectIds;
    var $objects = $('#objects');
    $objects.empty();
    $objects.append(objectIds.map(function (objectId) {
      var $openLink = $("<a href='#'>").text(objectId);
      $openLink.click(function (event) {
        event.preventDefault();
        Paysage.requestCode(objectId);
      });
      var $deleteLink = $('<a class="glyphicon glyphicon-trash" href="#">');
      $deleteLink.click(function (event) {
        event.preventDefault();
        deleteCode(objectId);
      });
      return $('<li>').append($openLink).append(' - ').append($deleteLink);
    }));
  });

  io.on('source code', function (data) {
    Paysage.setCodeId(data.codeObjectId);
    Paysage.setCode(data.code);
  });
}());
