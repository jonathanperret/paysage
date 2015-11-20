(function() {
  "use strict";

  // Require a sourcebuilder script defining getCompleteSource()

  io = io.connect();

  document.getElementById('bouton').addEventListener('click',
    function() {
      
      var emitData = function(code) {
        var codeid = document.getElementById('codeid').value;
        var playgroundid = document.getElementById('playgroundid').value;
        var data = {
          codeid: codeid,
          playgroundid: playgroundid,
          code: code
        };
        console.log(data);
        io.emit('code update', data);
      };

      getCompleteSource(emitData);
    });

  io.on('objects full update', function(data) {
    var playgroundId = data.playgroundId,
      objectIds = data.objectIds,
      $objects = $("#objects");
    $objects.empty();
    $objects.append(objectIds.map(function(objectId) {
      var $item = $("<a href='#'>").text(objectId);
      $item.click(function(event) {
        event.preventDefault();
        var data = {
          playgroundId: playgroundId,
          objectId: objectId
        };
        io.emit('request code', data);
      });
      return $('<li>').append($item);
    }));
  });

  io.on('source code', function(data) {
    $("#playgroundid").val(data.playgroundId);
    $("#codeid").val(data.objectId);
    $("#code").val(data.code);
  });

  io.emit('programmer up', document.getElementById('playgroundid').value);


}());