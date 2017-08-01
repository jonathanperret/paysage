"use strict";

function branch(payload) {
  var ref = payload.ref;
  return ref.substring(ref.lastIndexOf('/')+1);
}

function headCommitId(payload) {
  return payload.head_commit.id;
}


function extractAndDigest(payload) {

  function forEach(object,iterate){
    Object.keys(object).forEach(function(key){
      var value = object[key];
      iterate(value);
    });
  }

  var stagesPerFile = {};
  forEach(payload.commits, function(commit) {
    ["added","modified","removed"].forEach(function(stage) {
      forEach(commit[stage],function(file) {
        if (! stagesPerFile[file]) stagesPerFile[file] = [];
        stagesPerFile[file].push(stage);
      });
    });
  });
  var result = { added: [], modified: [], removed: [] }
  Object.keys(stagesPerFile).forEach(function(file){
    var stage = digest(stagesPerFile[file]);
    if (stage)
      result[stage].push(file);
  });
  return result;
}

function digest(stages) {
  var lastStage = stages[stages.length-1];
  if (stages[0] != "added" && lastStage == "added")  return "modified"
  if (stages[0] == "added" && lastStage == "removed") return;
  if (stages[0] == "added" && lastStage == "modified") return "added"
  return lastStage;
}

module.exports.extractAndDigest = extractAndDigest;
module.exports.branch = branch;
module.exports.headCommitId = headCommitId;
