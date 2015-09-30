(function() {
  "use strict";

  io = io.connect();

  document.getElementById('bouton').addEventListener('click',
    function(){
      var codeid = document.getElementById('codeid').value;
      var playgroundid = document.getElementById('playgroundid').value;
      var code = document.getElementById('code').value;
      var data = {codeid: codeid, playgroundid: playgroundid, code: code}
      io.emit('code update', data);
    });

  io.on('objects full update', function (data) {
    var playgroundId = data.playgroundId,
        objectIds = data.objectIds,
        $objects = $("#objects");
    $objects.empty();
    $objects.append(objectIds.map(function (objectId) {
      var $item = $("<a href='#'>").text(objectId);
      $item.click(function (event) {
        event.preventDefault();
        var data = {playgroundId: playgroundId, objectId: objectId};
        io.emit('request code', data);
      });
      return $('<li>').append($item);
    }));
  });

  io.on('source code', function (data) {
    $("#playgroundid").val(data.playgroundId);
    $("#codeid").val(data.objectId);
    $("#code").val(data.code);
  });

  io.emit('programmer up', document.getElementById('playgroundid').value);

  $('.example').click(function () {
    $('#codeid').val(chance.word());
    $('#code').val($('script', this).html());
  });

  $(function() { $('#codeid').val(chance.word()); });

  var frozenpreview = null;

  var switchframe = function (event) {
    event.preventDefault();
    if (frozenpreview) {
      $('.viewer-part').show(150);
      frozenpreview.appendTo('#viewercontainer');
      frozenpreview = null;
    } else {
      frozenpreview = $( '#viewerframe' ).detach();
      $('.viewer-part').hide(150);
    }
  }

  var frameoff = function () {
    if (frozenpreview === null) {
      frozenpreview = $('#viewerframe').detach();
      $('.viewer-part').hide(150);
    }
  }

  $('#previewonoff').click(switchframe);
  $('#openinnewwindow').click(frameoff);
}());
