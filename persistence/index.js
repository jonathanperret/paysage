"use strict";

const path=require('./path');

module.exports = function(world, adapter, outgoing) {
  var ingoing,
      state;

  state = require('./state')();
  adapter = adapter ? adapter : require('./github-adapter');
  outgoing =  outgoing ? outgoing  : require('./outgoing')(world,adapter,state);
  ingoing = require('./ingoing')(world,outgoing.loadCreature);

  function maybeStart() {
    var owner = process.env.GITHUB_OWNER,
        repo = process.env.GITHUB_REPO,
        token = process.env.GITHUB_TOKEN;
    var enabled = owner && repo && token;
    if (enabled)
      start(adapter, owner, repo, token);
    return enabled;
  }

  function start(adapter, owner, repo, token) {
    adapter.init(owner, repo, token);
    world.onCreatureCodeUpdate(outgoing.creatureCodeUpdated);
    world.onCreatureDelete(outgoing.creatureDeleted);
    outgoing.restore(world);
  }

  function router() {
    var webhook = require('./webhook')(ingoing, state);
    return require('./router')(webhook);
  }

  return {
    maybeStart: maybeStart,
    onCreatureCodeRefresh: function(fn) { ingoing.onCreatureCodeRefresh(fn); },
    onCreatureRemove: function(fn) { ingoing.onCreatureRemove(fn); },
    router: router,
  }
}
