/* global $ */
var Paysage = window.Paysage || {};

// A separate sourcebuilder.js script allow different Programmer pages
// (for example the dedicated programmer page for a workshop like Code Creatures)
// to reuse the receptiontransmission.js script
// while building the code to emit to the server in their own way.
// (for example the Creature Programmer insert the user code into a Processing script complete with a class definition)

// the sourcebuilder only concern is to build and give a code object ready to be sent to the paysage server

Paysage.getCompleteCodeObjectAsync = function (callback) {
  var playgroundid = document.getElementById('playgroundid').value;
  var codeObjectId = document.getElementById('codeid').value || document.getElementById('codeid').textContent;
  var mediatype = 'text/processing';
  var code = Paysage.getCode();

  var originalsourceURL = '/workshopfiles/' + playgroundid + '/creature.pde';

  $.get(

    originalsourceURL,

    function (originalsource) {
      var template = originalsource;
      var match = /\/\/kids code here/;

      var completecode = template.replace(match, code);

      var data = {
        codeObjectId: codeObjectId,
        mediatype: mediatype,
        code: completecode
      };
      callback(data);
    },

    'text');
};
