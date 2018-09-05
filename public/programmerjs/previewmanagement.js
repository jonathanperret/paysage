/* global $ */
var Paysage = window.Paysage || {};

function PreviewManagement () {
  this.muttedCodeObjects = new Set();
  this.soloCodeObject = new Set();
  this.previewIsOn = true;
}

Paysage.previewManagement = new PreviewManagement();

PreviewManagement.prototype.showCodeObjects = function () {
  var me = this;
  var codeObjectsIds = [];
  if(me.previewIsOn) {
    if (me.soloCodeObject.size === 1) {
      codeObjectsIds.push(me.soloCodeObject[0]);
    }
    else {
      allCodeObjectsIds.each(function(id) {
        if (!me.muttedCodeObjects.has(id)) {
          codeObjectsIds.push(id);
        }
      });
    }
  }
  $('#viewerframe').attr('src', '/playground/afmofva#' + codeObjectsIds.join(','));
};

PreviewManagement.prototype.isSolo = function (codeObjectId) {
  return this.soloCodeObject.has(codeObjectId);
};

PreviewManagement.prototype.isMute = function (codeObjectId) {
  return this.muttedCodeObjects.has(codeObjectId);
};

PreviewManagement.prototype.delete = function (codeObjectId) {
  this.soloCodeObject.delete(codeObjectId);
  this.showCodeObjects();
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
