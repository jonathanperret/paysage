var Payload=require('./webhook-payload');

module.exports = function(aPersister){
  var persister = aPersister;

  function handlePayload(data) {

    var payload = new Payload(data);

    if (payload.branch() != "master") return;
    var headCommitId = payload.headCommitId();
    if (persister.knowsCommit(headCommitId)) return;

    persister.rememberCommit(headCommitId);

    var data = payload.digest();
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
