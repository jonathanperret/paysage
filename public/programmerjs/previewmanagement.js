/* global $ */
var Paysage = window.Paysage || {};

(function () {
  'use strict';

  function showCodeObjects(muttedCodeObjects, soloCodeObject) {
    $('canvas', $('#viewerframe').contents()).each(function () {
      var currentCodeObjectId = this.getAttribute('id');
      if(soloCodeObject.size === 1) {
        if (soloCodeObject.has(currentCodeObjectId)) {
          $(this).show(200);
        }
        else {
          $(this).hide(200);
        }
      }
      else {
        if (muttedCodeObjects.has(currentCodeObjectId)) {
          $(this).hide(200);
        }
        else {
          $(this).show(200);
        }
      }
    });
  }

  Paysage.mute = function (codeObjectId, muttedCodeObjects, soloCodeObject) {
    return $('<a class="glyphicon glyphicon-eye-open mute" href="#">')
      .click(function (event) {
        event.preventDefault();
        $(this).toggleClass('glyphicon-eye-open');
        $(this).toggleClass('glyphicon-eye-close');
        if($(this).hasClass('glyphicon-eye-open')) {
          muttedCodeObjects.delete(codeObjectId);
        }
        else {
          muttedCodeObjects.add(codeObjectId);
        }
        showCodeObjects(muttedCodeObjects, soloCodeObject);
      });
  }

  Paysage.solo = function (codeObjectId, muttedCodeObjects, soloCodeObject) {
    var $solo = $('<a class="solo" href="#">').append('solo');
    $solo.click(function (event) {
      event.preventDefault();
      soloCodeObject.clear();
      $('.solo').each(function () {
        if (this !== $solo.get(0)) {
          $(this).removeClass('selected');
        }
      });
      $solo.toggleClass('selected');
      if ($solo.hasClass('selected')) {
        soloCodeObject.add(codeObjectId);
      }
      showCodeObjects(muttedCodeObjects, soloCodeObject);
    });
    return $solo;
  }

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
