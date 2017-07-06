var Paysage = Paysage || {};

// Require receptiontransmission script defining Paysage.requestCode function

Paysage.setCodeId = function (codeId) {
  $('#codeid').val(codeId);
  window.location.hash=codeId;
}

Paysage.createCodeId = function () {
  Paysage.setCodeId(chance.word());
}

Paysage.getCode = function() {
  return $('#code').val();
}

Paysage.setCode = function(code) {
  $('#code').val(code);
}

// On load, generating a random name if no name is passed via the URL Fragmemt identifier

Paysage.programmerInit = function () {
  if (window.location.hash) {
    Paysage.requestCode(window.location.hash.substring(1));
  } else {
    Paysage.createCodeId();
  }

  setupDragAndDropListeners();

  // Initialize ACE code editor
  $('#code').each(function () {
    var editor = ace.edit(this);
    editor.getSession().setMode("ace/mode/java");
    editor.setShowPrintMargin(false);
    editor.$blockScrolling = Infinity; // to avoid the warning about deprecated scrolling https://github.com/ajaxorg/ace/issues/2499
    Paysage.getCode = function() {
      return editor.getValue();
    }

    Paysage.setCode = function(code) {
      editor.setValue(code, -1);
    }
  });
}

// Loading code from an example and generating a random name

$('.example').click(function() {
  Paysage.createCodeId();
  $.get($(this).data('src'), function(data) {
    Paysage.setCode(data);
  });
});

// Drag and dropping a text file and naming the code from the file name
// Thanks http://stackoverflow.com/questions/12214057/drag-n-drop-text-file
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
