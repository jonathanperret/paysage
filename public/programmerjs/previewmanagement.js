/* global $ */
var Paysage = window.Paysage || {};

function PreviewManagement () {
  this.muttedCodeObjects = new Set();
  this.soloCodeObject = new Set();
  this.previewIsOn = true;
}

Paysage.previewManagement = new PreviewManagement();

PreviewManagement.prototype.initCodeObjectList = function () {
  this.muttedCodeObjects.clear();
  this.soloCodeObject.clear();
};

PreviewManagement.prototype.showCodeObjects = function () {
  var me = this;
  $('canvas', $('#viewerframe').contents()).each(function () {
    if (!me.previewIsOn) {
      $(this).hide(200);
      return;
    }
    var currentCodeObjectId = this.getAttribute('id');
    if (me.soloCodeObject.size === 1) {
      if (me.soloCodeObject.has(currentCodeObjectId)) {
        $(this).show(200);
      } else {
        $(this).hide(200);
      }
    } else {
      if (me.muttedCodeObjects.has(currentCodeObjectId)) {
        $(this).hide(200);
      } else {
        $(this).show(200);
      }
    }
  });
};

PreviewManagement.prototype.mute = function (codeObjectId, mute) {
  if (mute) {
    this.muttedCodeObjects.delete(codeObjectId);
  } else {
    this.muttedCodeObjects.add(codeObjectId);
  }
  this.showCodeObjects();
};

PreviewManagement.prototype.solo = function (codeObjectId, activate) {
  this.soloCodeObject.clear();
  if (activate) {
    this.soloCodeObject.add(codeObjectId);
  }
  this.showCodeObjects();
};

PreviewManagement.prototype.toggle = function () {
  this.previewIsOn = !this.previewIsOn;
  this.showCodeObjects();
};

(function () {
  'use strict';

  function switchframe (event) {
    event.preventDefault();
    $('#previewisoff').toggle();
    $('#previewison').toggle();
    Paysage.previewManagement.toggle();
  }

  $('#previewonoff').on('change', switchframe);
})();
