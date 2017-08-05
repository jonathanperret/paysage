var Payload=require('./webhook-payload');

module.exports = function(ingoing, state){

  function handlePayload(data) {

    var payload = new Payload(data);

    if (payload.branch() != "master") return;
    var headCommitId = payload.headCommitId();
    if (state.knowsCommit(headCommitId)) return;

    state.rememberCommit(headCommitId);

    var data = payload.digest();
    data.added.forEach(function(path) {
      ingoing.fileAddedOrModified(path)
    });
    data.modified.forEach(function(path) {
      ingoing.fileAddedOrModified(path)
    });
    data.removed.forEach(function(path) {
      ingoing.fileRemoved(path)
    });
  }

  return {
    handlePayload: handlePayload,
  }
}
