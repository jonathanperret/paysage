var Paysage = Paysage || {};

(function() {
  "use strict";

  // Require a sourcebuilder script defining Paysage.getCompleteCodeObject()
  // Require a codeinitialization script defining Paysage.setCodeId()

  io = io.connect();

  document.getElementById('bouton').addEventListener('click', function() {
    var emitData = function(data) {
      console.log(data);
      io.emit('code update', data);
    };
    Paysage.getCompleteCodeObject(emitData);
  });

  Paysage.requestCode = function(playgroundId, objectId) {
    if (typeof objectId == "undefined") {
      objectId = playgroundId;
      playgroundId = document.getElementById('playgroundid').value;
    }
    var data = {
      playgroundId: playgroundId,
      objectId: objectId
    };
    io.emit('request code', data);
  };

  function deleteCode(playgroundId, objectId) {
    var data = {
      playgroundId: playgroundId,
      objectId: objectId
    };
    io.emit('code delete', data);
  }

  io.on('objects list', function(data) {
    var playgroundId = data.playgroundId,
    objectIds = data.objectIds,
    $objects = $("#objects");
    $objects.empty();
    $objects.append(objectIds.map(function(objectId) {
      var $openLink = $("<a href='#'>").text(objectId);
      $openLink.click(function(event) {
        event.preventDefault();
        Paysage.requestCode(playgroundId, objectId);
      });
      var $deleteLink = $("<a href='#'>").text("trash");
      $deleteLink.click(function(event) {
        event.preventDefault();
        deleteCode(playgroundId, objectId);
      });
      return $('<li>').append($openLink).append(" - ").append($deleteLink);
    }));
  });

  io.on('source code', function(data) {
    $("#playgroundid").val(data.playgroundId);
    Paysage.setCodeId(data.objectId);
    Paysage.setCode(data.code);
  });

  io.emit('programmer up', document.getElementById('playgroundid').value);

}());
