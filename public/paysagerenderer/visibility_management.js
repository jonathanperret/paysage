/* eslint no-eval: "off" */
var Paysage = window.Paysage || {};

const ONLY_COMMAND = '#only=';

Paysage.readIdsFromUrlHash = function (urlHash) {
  if (urlHash.startsWith(ONLY_COMMAND)) {
    return urlHash.substring(ONLY_COMMAND.length).split(',');
  }
  if (urlHash === '#none') {
    return [];
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
