module.exports = function() {
  var lastSeenCommit;

  function knowsCommit(id) {
    return lastSeenCommit == id;
  }

  function rememberCommit(id) {
    lastSeenCommit = id;
  }

  return {
    knowsCommit: knowsCommit,
    rememberCommit: rememberCommit,
  };
}
