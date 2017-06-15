var Paysage = Paysage || {};

// thanks https://gist.github.com/jlong/2428561
var creaturename = window.location.hash.slice(1);

Paysage.setCodeId = function(codeId) {
  window.location.hash=codeId;
  $('#codeid').html(creaturename);
}

if (!creaturename) {
  creaturename = chance.word();
  window.location.hash = creaturename;
}

// loading code from an example

$('.example').click(function () {
   $.get($(this).data('src'), function putExampleInField (data) {
    myCodeMirror.setValue(data);
   });
});


$(function() {
  $('#codeid').html(creaturename);
});
