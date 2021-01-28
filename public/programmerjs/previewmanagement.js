/* global $ */

(function () {
  'use strict';

  var previewIsOn = true;

  function switchframe (event) {
    event.preventDefault();
    if (previewIsOn) {
      previewIsOn = false;
      $('#previewisoff').hide();
      $('#previewison').show();
      $('#viewerframe').attr('src', 'about:blank');
    } else {
      previewIsOn = true;
      $('#viewerframe').attr('src', '/playground/' + $('#playgroundid').val() + '#');
      $('#previewison').hide();
      $('#previewisoff').show();
    }
  }

  $('#previewonoff').on('change', switchframe);
})();
