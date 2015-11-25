// A separate sourcebuilder.js script allow different Programmer pages 
// (for example a dedicated programme page for a workshop like Code Creatures) 
// to reuse the receptiontransmission.js script
// while building the code to emit to the server in their own way.
// (for example the Creature Programmer insert the user code into a Processing script complete with a class definition)

// the sourcebuilder only concern is to build and give a code ready to be sent to the paysage server

getCompleteSource = function(callback) {

  sourcecode = document.getElementById('code').value;
  console.log(sourcecode);
  callback(sourcecode);

};


