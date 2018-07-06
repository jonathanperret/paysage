/* global $ */
var Paysage = window.Paysage || {};

(function () {
  'use strict';

  // Requires a receptiontransmission script defining Paysage.requestCode()

  Paysage.setCodeId = function (codeId) {
    $('#codeid').val(codeId);
    window.location.hash = codeId;
  };

  Paysage.setCodeName = function (codeName) {
    $('#codeName').val(codeName);
  };

  Paysage.createCodeId = function () {
    Paysage.setCodeId(window.chance.word());
  };

  Paysage.getCode = function () {
    return $('#code').val();
  };

  Paysage.setCode = function (code) {
    $('#code').val(code);
  };

  Paysage.setObjectList = function (population, deleteCodeCB) {
    var $ul = $('<ul>');
    $ul.append(population.data.reverse().map(function (co) {
      var $deleteLink = $('<a class="glyphicon glyphicon-remove-circle" href="#">');
      $deleteLink.click(function (event) {
        event.preventDefault();
        deleteCodeCB(co.codeObjectId);
      });
      var $openLink = $("<a href='#" + co.codeObjectId + "'>").text(co.name);
      $openLink.click(function (event) {
        event.preventDefault();
        Paysage.requestCode(co.codeObjectId);
      });
      return $('<li>').append($openLink).append($deleteLink);
    }));
    $('#objects').empty().append($ul);
  };

  Paysage.startNewObject = function () {
    $('#new-object-dialog').dialog({
      title: 'Start a new creature',
      width: 600,
      resizable: false
    });
  };

  // On load, generating a random name if no name is passed via the URL Fragmemt identifier

  Paysage.programmerInit = function () {
    if (window.location.hash) {
      Paysage.requestCode(window.location.hash.substring(1));
    } else {
      Paysage.startNewObject();
      Paysage.createCodeId();
    }

    setupDragAndDropListeners();
    $('#start-new-code').on('click', Paysage.startNewObject);

    // Initialize ACE code editor
    $('#code').each(function () {
      var editor = window.ace.edit(this);
      editor.getSession().setMode('ace/mode/java');
      editor.setShowPrintMargin(false);
      editor.setOption('tabSize', 2);
      editor.commands.addCommand({
        name: 'go-liveShortcuts',
        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
        exec: Paysage.goLive
      });
      editor.$blockScrolling = Infinity; // to avoid the warning about deprecated scrolling https://github.com/ajaxorg/ace/issues/2499

      editor.on('change', focusBackToEditor); // ensure focus when new code is loaded

      document.getElementById('go-live').addEventListener('click', focusBackToEditor);

      function focusBackToEditor (event) {
        editor.focus();
      }

      Paysage.getCode = function () {
        return editor.getValue();
      };

      Paysage.setCode = function (code) {
        editor.setValue(code, -1); // -1 move the cursor to the top of the editor
      };
    });
  };

  // Loading code from an example and generating a random name

  $('.example').click(function () {
    Paysage.createCodeId();
    $.get($(this).data('src'), function (data) {
      Paysage.setCode(data);
      setTimeout(function () {
        var codeNameField = document.getElementById('codeName');
        codeNameField.value = '';
        codeNameField.focus();
      }, 10);
    });
    $('#new-object-dialog').dialog('close');
  });

  // Drag and dropping a text file and naming the code from the file name
  // Thanks http://stackoverflow.com/questions/12214057/drag-n-drop-text-file
  // (after trying to use http://filedropjs.org/ )

  function handleFileSelect (dropEvent) {
    dropEvent.stopPropagation();
    dropEvent.preventDefault();

    var files = dropEvent.originalEvent.dataTransfer.files; // FileList object.
    var reader = new window.FileReader();
    reader.onload = function (event) {
      var data = event.target.result;
      Paysage.setCode(data);
      Paysage.createCodeId();
    };
    reader.readAsText(files[0], 'UTF-8');
  }

  function handleDragOver (dragoverEvent) {
    dragoverEvent.stopPropagation();
    dragoverEvent.preventDefault();
    dragoverEvent.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  function setupDragAndDropListeners () {
    $('body').on('dragover', handleDragOver).on('drop', handleFileSelect);
  }
})();
