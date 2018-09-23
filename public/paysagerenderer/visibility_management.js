/* eslint no-eval: "off" */
var Paysage = window.Paysage || {};

const ONLY_COMMAND = '#only=';

Paysage.readIdsFromUrlHash = function (urlHash) {
  if (urlHash.startsWith(ONLY_COMMAND)) {
    var idsList = urlHash.substring(ONLY_COMMAND.length);
    return idsList === '' ? [] : idsList.split(',');
  }
  return undefined;
};

Paysage.showCodeObjects = function (allIds, idsToShow, show, hide) {
  allIds.forEach(function (id) {
    if (!idsToShow || idsToShow.includes(id)) {
      show(id);
    } else {
      hide(id);
    }
  });
};
