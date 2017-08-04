"use strict";

describe("The webhook",function(){
  var persister, webhook, payload;

  beforeEach(function() {
    persister = jasmine.createSpyObj("persister",
        ["fileAddedOrModified","fileRemoved","knowsCommit","rememberCommit"]);
    persister.knowsCommit.and.returnValue(false);
    webhook = require('../persistence/webhook')(persister);
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

  it("inform persister about altered files", function(){

    webhook.handlePayload(payload);

    expect(persister.fileAddedOrModified).toHaveBeenCalledWith("addedFile");
    expect(persister.fileAddedOrModified).toHaveBeenCalledWith("modifiedFile");
    expect(persister.fileRemoved).toHaveBeenCalledWith("removedFile");
  });

  it("ignores commit to other branch than master", function() {
    payload.ref = "refs/heads/other";

    webhook.handlePayload(payload);

    expect(persister.fileAddedOrModified).not.toHaveBeenCalled();
  });

  it("ignores already known commits", function() {
    persister.knowsCommit.and.returnValue(true);

    webhook.handlePayload(payload);

    expect(persister.fileAddedOrModified).not.toHaveBeenCalled();
  });

  it("remembers head commit", function() {

    webhook.handlePayload(payload);

    expect(persister.rememberCommit).toHaveBeenCalledWith("sha123");
  });
});

