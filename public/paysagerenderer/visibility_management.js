/* eslint no-eval: "off" */
var Paysage = window.Paysage || {};

const CODE_FRAGMENT_IDENTIFIER = '#code=';

Paysage.idsToShow = undefined;

Paysage.readIdsFromUrlHash = function (urlHash) {
  Paysage.idsToShow = undefined;
  if (urlHash.startsWith(CODE_FRAGMENT_IDENTIFIER)) {
    var idsList = urlHash.substring(CODE_FRAGMENT_IDENTIFIER.length);
    Paysage.idsToShow = idsList === '' ? undefined : idsList.split(',');
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
