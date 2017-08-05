"use strict";

describe("The webhook",function(){
  var state, ingoing, webhook, payload;

  beforeEach(function() {

    state = jasmine.createSpyObj("state", ["knowsCommit","rememberCommit"]);
    state.knowsCommit.and.returnValue(false);
    ingoing = jasmine.createSpyObj("ingoing", ["fileAddedOrModified","fileRemoved"]);
    webhook = require('../persistence/webhook')(ingoing, state);
    payload = JSON.parse(JSON.stringify({
      ref: "refs/heads/master",
      commits: [{
        "added": ["addedFile"],
        "removed": [ "removedFile"],
        "modified": ["modifiedFile" ],
        "not_used": "like many things in real payload"
      }],
      head_commit: { id: "sha123" },
    }));
  });

  it("informs about altered files", function(){

    webhook.handlePayload(payload);

    expect(ingoing.fileAddedOrModified).toHaveBeenCalledWith("addedFile");
    expect(ingoing.fileAddedOrModified).toHaveBeenCalledWith("modifiedFile");
    expect(ingoing.fileRemoved).toHaveBeenCalledWith("removedFile");
  });

  it("ignores commit to other branch than master", function() {
    payload.ref = "refs/heads/other";

    webhook.handlePayload(payload);

    expect(ingoing.fileAddedOrModified).not.toHaveBeenCalled();
  });

  it("ignores already known commits", function() {
    state.knowsCommit.and.returnValue(true);

    webhook.handlePayload(payload);

    expect(ingoing.fileAddedOrModified).not.toHaveBeenCalled();
  });

  it("remembers head commit", function() {

    webhook.handlePayload(payload);

    expect(state.rememberCommit).toHaveBeenCalledWith("sha123");
  });
});

