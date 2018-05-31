// A separate sourcebuilder.js script allow different Programmer pages
// (for example the dedicated programmer page for a workshop like Code Creatures)
// to reuse the receptiontransmission.js script
// while building the code to emit to the server in their own way.
// (for example the Creature Programmer insert the user code into a Processing script complete with a class definition)

// the sourcebuilder only concern is to build and give a code object ready to be sent to the paysage server

 // Requires a editingcode script defining Paysage.getCode()

var Paysage = window.Paysage || {};

Paysage.getCompleteCodeObject = function (callback) {
  var codeObjectId = document.getElementById('codeid').value || document.getElementById('codeid').textContent;
  var codeObjectName = document.getElementById('codeName').value;
  var mediatype = 'text/processing';
  var code = Paysage.getCode();

  var data = {
    codeObjectId: codeObjectId,
    name: codeObjectName,
    mediatype: mediatype,
    code: code
  };
  callback(data);
};
