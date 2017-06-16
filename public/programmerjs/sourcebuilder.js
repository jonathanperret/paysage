// A separate sourcebuilder.js script allow different Programmer pages 
// (for example the dedicated programmer page for a workshop like Code Creatures) 
// to reuse the receptiontransmission.js script
// while building the code to emit to the server in their own way.
// (for example the Creature Programmer insert the user code into a Processing script complete with a class definition)

// the sourcebuilder only concern is to build and give a code object ready to be sent to the paysage server

var Paysage = Paysage || {};

Paysage.getCompleteCodeObject = function (callback) {

    var objectid = document.getElementById('codeid').value || document.getElementById('codeid').textContent;
    var playgroundid = document.getElementById('playgroundid').value;
    var mediatype = "text/processing";
    var client = "programmer";
    var code = Paysage.getCode();

    var data = {
        playgroundId: playgroundid,
        objectId: objectid, 
        mediatype: mediatype,
        client: client,
        code: code
    };
    
  callback(data);
};


