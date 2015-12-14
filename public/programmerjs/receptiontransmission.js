var requestCode;

(function() {
  "use strict";

  // Require a sourcebuilder script defining getCompleteCodeObject()
  // Require a codeinitialization script defining setCodeId()

  io = io.connect();

  document.getElementById('bouton').addEventListener('click',
    function sendCode () {
      var emitData = function(data) {
        console.log(data);
        io.emit('code update', data);
      };
      getCompleteCodeObject(emitData);
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

  io.on('objects list',
     function buildObjectsList(data) {
         var playgroundId = data.playgroundId,
             objectIds = data.objectIds,
             $objects = $("#objects");
         $objects.empty();
         $objects.append(objectIds.map(
             function buildObjectLink (objectId) {
                 var $item = $("<a href='#'>").text(objectId);
                 $item.click(
                     function attachRequestCodeToLink(event) {
                         event.preventDefault();
                         requestCode(playgroundId, objectId);
                     });
                 return $('<li>').append($item);
             }));
     });

  io.on('source code',
     function showCodeReceived (data) {
         $("#playgroundid").val(data.playgroundId);
         setCodeId(data.objectId);
         $("#code").val(data.code);
     });

  io.emit('programmer up', document.getElementById('playgroundid').value);

}());