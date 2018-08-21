/* eslint no-eval: "off" */
var Paysage = window.Paysage || {};

Paysage.readIdsFromUrlHash = function (urlHash) {
  if (urlHash.length <= 1) {
    return undefined;
  }
  return urlHash.substring(1).split(',');
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
