var Paysage = Paysage || {};

// Require receptiontransmission script defining Paysage.requestCode function

function setCodeId(codeId) {
  $('#codeid').val(codeId);
  window.location.hash=codeId;
}

function createCodeId() {
  setCodeId(chance.word());
}

// on load generating a random name if no name is passed via the URL Fragmemt identifier

$(function() {
  if (window.location.hash) {
    Paysage.requestCode(window.location.hash.substring(1));
  } else {
    createCodeId();
  }
});


// loading code from an example and generating a random name

$('.example').click(function() {
  createCodeId();
  $('#code').val($('script', this).html());
});

// drag and dropping a text file and naming the code from the file name
// thanks http://stackoverflow.com/questions/12214057/drag-n-drop-text-file
// (after trying to use http://filedropjs.org/ )

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  var reader = new FileReader();
  reader.onload = function(event) {
       document.getElementById('code').value = event.target.result;
       createCodeId();
  };
  reader.readAsText(files[0],"UTF-8");
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the drag and drop listeners.
var dropZone = document.getElementById('code');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
