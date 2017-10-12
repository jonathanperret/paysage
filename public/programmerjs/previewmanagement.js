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
    } else {
      frozenpreview = $('#viewerframe').detach();
      $('#viewercontainer').hide(150);
    }
  }

  $('#previewonoff').click(switchframe);
})();
