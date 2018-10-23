/* global $ */
/* global Paysage */

(function () {
  'use strict';

  var previewIsOn = true;

  function switchframe (event) {
    event.preventDefault();
    if (previewIsOn) {
      previewIsOn = false;
      $('#previewisoff').hide();
      $('#previewison').show();
      $('#viewerframe').attr('src', '/playground/' + $('#playgroundid').val() + Paysage.CODE_FRAGMENT_IDENTIFIER);
    } else {
      previewIsOn = true;
      $('#viewerframe').attr('src', '/playground/' + $('#playgroundid').val() + '#');
      $('#previewison').hide();
      $('#previewisoff').show();
    }
  }

  $('#previewonoff').on('change', switchframe);
})();
