/* global $ */
var Paysage = window.Paysage || {};

// thanks https://gist.github.com/jlong/2428561
var creaturename = window.location.hash.slice(1);

function goLive () {
  Paysage.getCompleteCodeObjectAsync(Paysage.emitCodeUpdate);
}
$('#go-live').on('click', goLive);

Paysage.setCodeId = function (codeId) {
  window.location.hash = codeId;
  $('#codeid').html(creaturename);
};

Paysage.getCode = function () {
  return $('#code').val();
};

Paysage.setCode = function (code) {
  $('#code').val(code);
};

Paysage.setObjectList = function (data, deleteCodeCb) {
  // noting to do, the list is not displayed.
};

if (!creaturename) {
  creaturename = window.chance.word();
  window.location.hash = creaturename;
}

// loading code from an example

$('.example').click(function () {
  $.get($(this).data('src'), function putExampleInField (data) {
    Paysage.setCode(data);
  });
});

$(function () {
  $('#codeid').html(creaturename);
});
