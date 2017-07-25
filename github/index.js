"use strict";
const GitHubApi = require("github");

function path(playground,name) {
  return playground + "/" + name;
}

module.exports = function(){
  var github, owner, repo;

  function init(anOwner, aRepo, token) {
    owner = anOwner;
    repo = aRepo;
    github = new GitHubApi({
        debug: false,
        headers: {
            "user-agent": "Paysage.xyz"
        },
        followRedirects: false, 
        timeout: 5000
    });

    github.authenticate({
          type: "token",
          token: token,
    });
  }

  function saveCreature(playground,name,code,sha,updateSha) {
    if (sha)
      updateCreature(playground,name,code,sha,updateSha);
    else
      createCreature(playground,name,code,updateSha);
  }

  function createCreature(playground,name,code,updateSha) {
    github.repos.createFile({
        owner: owner,
        repo: repo,
        path: path(playground,name),
        message: "Creates " + path(playground,name),
        content: new Buffer(code).toString('base64')
    }).then(function(res){
      updateSha(res.data.content.sha);
    }).catch(function(e) { console.log(JSON.stringify(e)); });
  }

  function updateCreature(playground,name,code,sha,updateSha) {
    github.repos.updateFile({
        owner: owner,
        repo: repo,
        path: path(playground,name),
        message: "Updates " + path(playground,name),
        content: new Buffer(code).toString('base64'),
        sha: sha
    }).then(function(res){
      updateSha(res.data.content.sha);
    }).catch(function(e) { console.log(JSON.stringify(e)); });
  }

  function loadPlaygrounds(registerPlaygrounds) {
    github.repos.getContent({
        owner: owner,
        repo: repo,
        path: "",
    }).then(function(res) {
        var isADirectory = function(child) { return child.type == "dir" ; }
        var playgrounds = res.data.filter(isADirectory).map(function(child) {
          return child.name;
        });
        registerPlaygrounds(playgrounds);
    }).catch(function(e) { console.log(e);});
  }

  function loadPlayground(playground,populatePlayground) {
    github.repos.getContent({
        owner: owner,
        repo: repo,
        path: playground
    }).then(function(res) {
      var creatures = res.data.map( function(child) {
        return child.name;
      });
      populatePlayground(playground,creatures);
    }).catch(function(e) { console.log(e);});
  }

  function loadCreature(playground,name,populateCreature) {
    github.repos.getContent({
        owner: owner,
        repo: repo,
        path: path(playground,name)
    }).then(function(res) {
      var content;
      if (res.data.content) {
        content = new Buffer(res.data.content, 'base64').toString('UTF-8');
        populateCreature(playground, name, content, res.data.sha);
      } else populateCreature(playground, name, null, null);
    }).catch(function(e) { console.log(e);});
  }

  return {
    init: init,
    saveCreature: saveCreature,
    loadCreature: loadCreature,
    loadPlayground: loadPlayground,
    loadPlaygrounds: loadPlaygrounds,
  };
}
