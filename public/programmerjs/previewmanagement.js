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

  var solo = false;
  function switchSoloEveryone (event) {
    event.preventDefault();
    if (solo) {
      solo = false;

      $('#solo').hide();
      $('#everyOne').show();

      $('canvas', $('#viewerframe').contents()).each(function () {
        $(this).show(200);
      });
    } else {
      solo = true;
      var codeid = document.getElementById('codeid').value;
      var codeName = document.getElementById('codeName').value;

      $('#everyOne').hide();
      $('#solo').text(codeName).show();

      $('canvas', $('#viewerframe').contents()).each(function () {
        if (this.getAttribute('id') !== codeid) {
          $(this).hide(200);
        }
      });
    }
  }

  $('#previewonoff').on('change', switchframe);
  $('#showall').on('change', switchSoloEveryone);
})();
