"use strict";
const GitHubApi = require("github");

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

  function createFile(path,content,updateSha) {
    github.repos.createFile({
        owner: owner,
        repo: repo,
        path: path,
        message: "Creates " + path,
        content: new Buffer(content).toString('base64')
    }).then(function(res){
      updateSha(res.data.content.sha);
    }).catch(function(e) { console.log(JSON.stringify(e)); });
  }

  function updateFile(path,content,sha,updateSha) {
    github.repos.updateFile({
        owner: owner,
        repo: repo,
        path: path,
        message: "Updates " + path,
        content: new Buffer(content).toString('base64'),
        sha: sha
    }).then(function(res){
      updateSha(res.data.content.sha);
    }).catch(function(e) { console.log(JSON.stringify(e)); });
  }

  function fetchRootDirectories(callback) {
   github.repos.getContent({
        owner: owner,
        repo: repo,
        path: "",
    }).then(function(res) {
        var isADirectory = function(child) { return child.type == "dir" ; }
        var dirs = res.data.filter(isADirectory).map(function(child) {
          return child.name;
        });
        callback(dirs);
    }).catch(function(e) { console.log(e);});
  }

  function fetchFilenames(dirname,callback) {
    github.repos.getContent({
        owner: owner,
        repo: repo,
        path: dirname
    }).then(function(res) {
      var filenames = res.data.map( function(child) {
        return child.name;
      });
      callback(filenames);
    }).catch(function(e) { console.log(e);});
  }

  function fetchFileContent(path,callback) {
    github.repos.getContent({
        owner: owner,
        repo: repo,
        path: path
    }).then(function(res) {
     var content;
      if (res.data.content) {
        content = new Buffer(res.data.content, 'base64').toString('UTF-8');
        callback(content, res.data.sha);
      }
    }).catch(function(e) { console.log(e);});
  }

  return {
    init: init,
    createFile: createFile,
    updateFile: updateFile,
    fetchRootDirectories: fetchRootDirectories,
    fetchFilenames: fetchFilenames,
    fetchFileContent: fetchFileContent,
  };
}();
