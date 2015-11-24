getCompleteSource = function(callback) {

  sourcecode = document.getElementById('code').value;
  console.log(sourcecode);
  callback(sourcecode);

};

function setCodeId(codeId) {
  $('#codeid').val(codeId);
  window.location.hash=codeId;
}

