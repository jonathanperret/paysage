"use strict";

describe("Persitence commit memory", function() {

  var state;

  beforeEach(function() {
    state = require('../persistence/state')();
  });

  it("won't remember a commit it has never seen", function(){

    expect(state.knowsCommit("commitSha")).toBeFalsy();
  });

  it("remembers last met commit", function(){

    state.rememberCommit("commitSha");

    expect(state.knowsCommit("commitSha")).toBeTruthy();
  });
});

