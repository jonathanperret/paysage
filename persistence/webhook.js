var extractor=require('./webhook-input');

module.exports = function(aPersister){
  var persister = aPersister;

  function handlePayload(payload) {

    if (extractor.branch(payload) != "master") return;
    var headCommitId = extractor.headCommitId(payload);
    if (persister.knowsCommit(headCommitId)) return;

    persister.rememberCommit(headCommitId);

    var data = extractor.extractAndDigest(payload);
    data.added.forEach(function(path) {
      persister.fileAddedOrModified(path)
    });
    data.modified.forEach(function(path) {
      persister.fileAddedOrModified(path)
    });
    data.removed.forEach(function(path) {
      persister.fileRemoved(path)
    });
  }

  return {
    handlePayload: handlePayload,
  }
}
