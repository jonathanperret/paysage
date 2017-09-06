/* global $ */
var frozenpreview = null;

var switchframe = function (event) {
  event.preventDefault();
  if (frozenpreview) {
    $('#viewercontainer').show(150);
    frozenpreview.appendTo('#viewercontainer');
    frozenpreview = null;
  } else {
    frozenpreview = $('#viewerframe').detach();
    $('#viewercontainer').hide(150);
  }
};

$('#previewonoff').click(switchframe);
