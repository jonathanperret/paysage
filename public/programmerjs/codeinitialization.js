// on load generating a random name for new empty code

$(function() {
  $('#codeid').val(chance.word());
});

// laoding code from an example and generating a random name

$('.example').click(function() {
  $('#codeid').val(chance.word());
  $('#code').val($('script', this).html());
});

// drag and dropping a text file and naming the code fron the file name
// thanks http://stackoverflow.com/questions/12214057/drag-n-drop-text-file
// (after trying to use http://filedropjs.org/ )

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  var reader = new FileReader();
  reader.onload = function(event) {
       document.getElementById('code').value = event.target.result;
       $('#codeid').val(chance.word());
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