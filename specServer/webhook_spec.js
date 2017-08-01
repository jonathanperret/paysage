"use strict";

describe("The webhook",function(){
  var persister, webhook, payload;

  beforeEach(function() {
    persister = jasmine.createSpyObj("persister",
        ["check","remove","knowsCommit","rememberCommit"]);
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

  it("checks or removes every altered files", function(){

    webhook.handlePayload(payload);

    expect(persister.check).toHaveBeenCalledWith("addedFile");
    expect(persister.check).toHaveBeenCalledWith("modifiedFile");
    expect(persister.remove).toHaveBeenCalledWith("removedFile");
  });

  it("ignores commit to other branch than master", function() {
    payload.ref = "refs/heads/other";

    webhook.handlePayload(payload);

    expect(persister.check).not.toHaveBeenCalled();
  });

  it("ignores already known commits", function() {
    persister.knowsCommit.and.returnValue(true);

    webhook.handlePayload(payload);

    expect(persister.check).not.toHaveBeenCalled();
  });

  it("remembers head commit", function() {

    webhook.handlePayload(payload);

    expect(persister.rememberCommit).toHaveBeenCalledWith("sha123");
  });
});

describe("Payload extractor", function() {

  var extractor = require('../persistence/webhook-input');

  var payload;

  beforeEach(function() {
    payload = { 
      ref: "refs/heads/whatever",
      commits: [
        { added: [], removed: [], modified: [] },
        { added: [], removed: [], modified: [] },
        { added: [], removed: [], modified: [] },
      ],
      head_commit: { id: "sha123" },
    }
  });

  it("extracts branch name", function() {
    expect(extractor.branch(payload)).toEqual("whatever");
  });

  it("extracts last commit id",function() {
    expect(extractor.headCommitId(payload)).toEqual("sha123");
  });

  it("extracts every altered file",function(){
    payload.commits[0].added=    [ "addedFile" ];
    payload.commits[0].modified= [ "modifiedFile" ];
    payload.commits[0].removed=  [ "removedFile" ];

    expect(extractor.extractAndDigest(payload)).toEqual(
      {
         added: [ "addedFile" ],
         modified: [ "modifiedFile" ],
         removed: [ "removedFile" ]
      }
    )

  });

  it("digest file modified in serveral commits, but only once per file",function(){
    payload.commits[0].modified= [ "file", "anotherFile" ];
    payload.commits[1].modified= [ "file" ]

    expect(extractor.extractAndDigest(payload).modified).toEqual(jasmine.arrayContaining(
          ["file", "anotherFile"]));
  });

  it("digest as removed file modified then removed",function(){
    payload.commits[0].modified = [ "file" ];
    payload.commits[1].removed = [ "file" ];

    expect(extractor.extractAndDigest(payload)).toEqual(
        {added:[],modified:[],removed:["file"]});
  });

  it("ignores files created first and removed last",function(){
    payload.commits[0].added = [ "file" ];
    payload.commits[1].modified = [ "file" ];
    payload.commits[2].removed = [ "file" ];

    expect(extractor.extractAndDigest(payload)).toEqual(
        {added:[],modified:[],removed:[]});
  });

  it("digest as modified a file removed then added",function(){
    payload.commits[0].removed = [ "file" ];
    payload.commits[1].added = [ "file" ];
    expect(extractor.extractAndDigest(payload)).toEqual(
        {added:[],modified:["file"],removed:[]});
  });

  it("digest as modified a file modified, then removed, then added",function(){
    payload.commits[0].modified = [ "file" ];
    payload.commits[1].removed = [ "file" ];
    payload.commits[2].added = [ "file" ];

    expect(extractor.extractAndDigest(payload)).toEqual(
        {added:[],modified:["file"],removed:[]});
  });

  it("digest as addd a file added, then not removed",function(){
    payload.commits[0].added = [ "file" ];
    payload.commits[1].modified = [ "file" ];

    expect(extractor.extractAndDigest(payload)).toEqual(
        {added:["file"],modified:[],removed:[]});
  });
});

/*
digest :
 added, ... , removed -> ignored
 ... removed -> removed
 modified. ... , removed, added -> modified
 removed, ...  added -> modified
 ..., any -> any
 */

