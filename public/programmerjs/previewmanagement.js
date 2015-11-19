var frozenpreview = null;

var switchframe = function(event) {
  event.preventDefault();
  if (frozenpreview) {
    $('.viewer-part').show(150);
    frozenpreview.appendTo('#viewercontainer');
    frozenpreview = null;
  } else {
    frozenpreview = $('#viewerframe').detach();
    $('.viewer-part').hide(150);
  }
};

var frameoff = function() {
  if (frozenpreview === null) {
    frozenpreview = $('#viewerframe').detach();
    $('.viewer-part').hide(150);
  }
};

$('#previewonoff').click(switchframe);
$('#openinnewwindow').click(frameoff);