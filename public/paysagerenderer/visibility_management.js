/* eslint no-eval: "off" */
var Paysage = window.Paysage || {};

const ONLY_COMMAND = '#only=';

Paysage.idsToShow = undefined;

Paysage.readIdsFromUrlHash = function (urlHash) {
  Paysage.idsToShow = undefined;
  if (urlHash.startsWith(ONLY_COMMAND)) {
    var idsList = urlHash.substring(ONLY_COMMAND.length);
    Paysage.idsToShow = idsList === '' ? [] : idsList.split(',');
  }
};

Paysage.filterCodeObjects = function (allIds, show, hide) {
  allIds.forEach(function (id) {
    if (Paysage.isCodeObjectVisible(id)) {
      show(id);
    } else {
      hide(id);
    }
  });
};

Paysage.isCodeObjectVisible = function (id) {
  return !Paysage.idsToShow || Paysage.idsToShow.includes(id);
};
