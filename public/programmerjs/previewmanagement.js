/* global $ */
var Paysage = window.Paysage || {};

Paysage.frozenpreview = null;

Paysage.switchframe = function (event) {
  event.preventDefault();
  if (Paysage.frozenpreview) {
    $('#viewercontainer').show(150);
    Paysage.frozenpreview.appendTo('#viewercontainer');
    Paysage.frozenpreview = null;
  } else {
    Paysage.frozenpreview = $('#viewerframe').detach();
    $('#viewercontainer').hide(150);
  }
};

$('#previewonoff').click(Paysage.switchframe);
