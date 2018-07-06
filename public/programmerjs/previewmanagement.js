/* global $ */

(function () {
  'use strict';

  var frozenpreview = null;

  function switchframe (event) {
    event.preventDefault();
    if (frozenpreview) {
      frozenpreview.appendTo('#viewercontainer');
      frozenpreview = null;
      $('#viewercontainer').show();
      $('#previewisoff').hide();
      $('#previewison').show();
    } else {
      $('#viewercontainer').hide(1, function () {
        frozenpreview = $('#viewerframe').detach();
      });
      $('#previewison').hide();
      $('#previewisoff').show();
    }
  }

  $('#previewonoff').on('change', switchframe);
})();
