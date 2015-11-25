var requestCode;

(function() {
  "use strict";

  // Require a sourcebuilder script defining getCompleteSource()

  io = io.connect();

  document.getElementById('bouton').addEventListener('click',

    function() {
      var emitData = function(code) {
        var codeid = document.getElementById('codeid').value||document.getElementById('codeid').textContent;
        var playgroundid = document.getElementById('playgroundid').value;
        var data = {
          codeid: codeid,
          playgroundid: playgroundid,
          code: code
        };
        setCodeId(codeid);
        console.log(data);
        io.emit('code update', data);
      };

      getCompleteSource(emitData);
    });

  requestCode = function(playgroundId, objectId) {
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

  io.on('objects full update', function(data) {
    var playgroundId = data.playgroundId,
      objectIds = data.objectIds,
      $objects = $("#objects");
    $objects.empty();
    $objects.append(objectIds.map(function(objectId) {
      var $item = $("<a href='#'>").text(objectId);
      $item.click(function(event) {
        event.preventDefault();
        requestCode(playgroundId, objectId);
      });
      return $('<li>').append($item);
    }));
  });

  io.on('source code', function(data) {
    $("#playgroundid").val(data.playgroundId);
    setCodeId(data.objectId);
    $("#code").val(data.code);
  });

  io.emit('programmer up', document.getElementById('playgroundid').value);


}());
