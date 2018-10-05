/* global $ */

(function () {
  'use strict';

  function switchPreviewState (event) {
    $('#previewisoff').hide();
    $('#previewissolo').hide();
    $('#previewison').hide();
    var urlViewer = '/playground/' + $('#playgroundid').val();
    if (this.value === 'previewoff') {
      $('#previewisoff').show();
      urlViewer += '#only=';
    } else if (this.value === 'previewsolo') {
      $('#previewissolo').text($('#codeName').val() + ' in solo');
      $('#previewissolo').show();
      urlViewer += '#only=' + $('#codeid').val();
    } else if (this.value === 'previewon') {
      $('#previewison').show();
      urlViewer += '#';
    }
    $('#viewerframe').attr('src', urlViewer);
  }

  $('input[type=radio][name=previewstate]').on('click', switchPreviewState);
})();
