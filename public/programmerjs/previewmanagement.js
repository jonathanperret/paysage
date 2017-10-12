/* global $ */

(function () {
  'use strict';

  var frozenpreview = null;

  function switchframe (event) {
    event.preventDefault();
    if (frozenpreview) {
      $('#viewercontainer').show(150);
      frozenpreview.appendTo('#viewercontainer');
      frozenpreview = null;
      $('#previewisoff').hide();
      $('#previewison').show();
    } else {
      frozenpreview = $('#viewerframe').detach();
      $('#viewercontainer').hide(150);
      $('#previewison').hide();
      $('#previewisoff').show();
    }
  }

  $('#previewonoff').on('change', switchframe);
})();
