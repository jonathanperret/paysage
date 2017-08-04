describe("Payload", function() {

  var Payload = require('../persistence/webhook-payload');

  var payload, data;

  beforeEach(function() {
    data = {
      ref: "refs/heads/whatever",
      commits: [
        { added: [], removed: [], modified: [] },
        { added: [], removed: [], modified: [] },
        { added: [], removed: [], modified: [] },
      ],
      head_commit: { id: "sha123" },
    }
    payload = new Payload(data);
  });

  it("extracts branch name", function() {

    expect(payload.branch()).toEqual("whatever");
  });

  it("extracts last commit id",function() {
    expect(payload.headCommitId()).toEqual("sha123");
  });

  it("extracts every altered file",function(){
    data.commits[0].added=    [ "addedFile" ];
    data.commits[0].modified= [ "modifiedFile" ];
    data.commits[0].removed=  [ "removedFile" ];

    expect(payload.digest()).toEqual(
      {
         added: [ "addedFile" ],
         modified: [ "modifiedFile" ],
         removed: [ "removedFile" ]
      }
    )

  });

/*
digest :
 added, ... , removed -> ignored
 ... removed -> removed
 modified. ... , removed, added -> modified
 removed, ...  added -> modified
 ..., any -> any
 */

  it("digest file modified in serveral commits, but only once per file",function(){
    data.commits[0].modified= [ "file", "anotherFile" ];
    data.commits[1].modified= [ "file" ]

    expect(payload.digest().modified).toEqual(jasmine.arrayContaining(
          ["file", "anotherFile"]));
  });

  it("digest as removed file modified then removed",function(){
    data.commits[0].modified = [ "file" ];
    data.commits[1].removed = [ "file" ];

    expect(payload.digest()).toEqual(
        {added:[],modified:[],removed:["file"]});
  });

  it("ignores files created first and removed last",function(){
    data.commits[0].added = [ "file" ];
    data.commits[1].modified = [ "file" ];
    data.commits[2].removed = [ "file" ];

    expect(payload.digest()).toEqual(
        {added:[],modified:[],removed:[]});
  });

  it("digest as modified a file removed then added",function(){
    data.commits[0].removed = [ "file" ];
    data.commits[1].added = [ "file" ];

    expect(payload.digest()).toEqual(
        {added:[],modified:["file"],removed:[]});
  });

  it("digest as modified a file modified, then removed, then added",function(){
    data.commits[0].modified = [ "file" ];
    data.commits[1].removed = [ "file" ];
    data.commits[2].added = [ "file" ];

    expect(payload.digest()).toEqual(
        {added:[],modified:["file"],removed:[]});
  });

  it("digest as added a file added, then not removed",function(){
    data.commits[0].added = [ "file" ];
    data.commits[1].modified = [ "file" ];

    expect(payload.digest()).toEqual(
        {added:["file"],modified:[],removed:[]});
  });
});

