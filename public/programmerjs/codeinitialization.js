var Paysage = Paysage || {};

// Require receptiontransmission script defining Paysage.requestCode function

Paysage.setCodeId = function (codeId) {
  $('#codeid').val(codeId);
  window.location.hash=codeId;
}

Paysage.createCodeId = function () {
  Paysage.setCodeId(chance.word());
}

// on load generating a random name if no name is passed via the URL Fragmemt identifier

Paysage.programmerInit = function () {
  if (window.location.hash) {
    Paysage.requestCode(window.location.hash.substring(1));
  } else {
    Paysage.createCodeId();
  }

  setupDragAndDropListeners();
};


// loading code from an example and generating a random name

$('.example').click(function() {
  Paysage.createCodeId();
  $.get($(this).data('src'), function(data) {
    $('#code').val(data);
    myCodeMirror.setValue(data);
  });
});

// drag and dropping a text file and naming the code from the file name
// thanks http://stackoverflow.com/questions/12214057/drag-n-drop-text-file
// (after trying to use http://filedropjs.org/ )

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.originalEvent.dataTransfer.files; // FileList object.
  var reader = new FileReader();
  reader.onload = function(event) {
       document.getElementById('code').value = event.target.result;
       Paysage.createCodeId();
  };
  reader.readAsText(files[0], "UTF-8");
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function setupDragAndDropListeners() {
  $('#code').on('dragover', handleDragOver).on('drop', handleFileSelect);
}
