/* global $ */
var Paysage = window.Paysage || {};

(function () {
  'use strict';

  // Requires a receptiontransmission script defining
  // - Paysage.requestCode()
  // - Paysage.emitCodeUpdate()
  // Requires a sourcebuilder script defining
  // - Paysage.getCompleteCodeObject()

  function goLive () {
    Paysage.emitCodeUpdate(Paysage.getCompleteCodeObject());
  }

  Paysage.setCodeId = function (codeId) {
    $('#codeid').val(codeId);
    window.location.hash = codeId;
  };

  Paysage.setCodeName = function (codeName) {
    $('#codeName').val(codeName);
  };

  Paysage.createCodeId = function () {
    Paysage.setCodeId(window.chance.word({syllables: 3}));
    Paysage.setCodeName(window.chance.animal());
  };

  Paysage.getCode = function () {
    return $('#code').val();
  };

  Paysage.setCode = function (code) {
    $('#code').val(code);
  };

  function deleteLink(codeObjectId, deleteCodeCB) {
    return $('<a class="glyphicon glyphicon-remove-circle delete" href="#">')
      .click(function (event) {
        event.preventDefault();
        deleteCodeCB(codeObjectId);
      });
  }

  function mute(codeObjectId) {
    return $('<a class="glyphicon glyphicon-eye-open mute" href="#">')
      .click(function (event) {
        event.preventDefault();
        $(this).toggleClass('glyphicon-eye-open');
        $(this).toggleClass('glyphicon-eye-close');
        $('#' + codeObjectId, $('#viewerframe').contents()).toggle(200);
      });
  }

  function solo(codeObjectId) {
    var $solo = $('<a class="solo" href="#">').append('solo');
    $solo.click(function (event) {
      event.preventDefault();
      $('canvas', $('#viewerframe').contents()).each(function () {
        $(this).show(200);
      });
      $('.solo').each(function () {
        if (this !== $solo.get(0)) {
          $(this).removeClass('selected');
        }
      });
      $solo.toggleClass('selected');
      if ($solo.hasClass('selected')) {
        $('canvas', $('#viewerframe').contents()).each(function () {
          if (this.getAttribute('id') !== codeObjectId) {
            $(this).hide(200);
          }
        });
      }
    });
    return $solo;
  }

  function openLink(co) {
    return $("<a href='#" + co.codeObjectId + "'>").text(co.name)
      .click(function (event) {
        event.preventDefault();
        Paysage.requestCode(co.codeObjectId);
      });
  }

  Paysage.setObjectList = function (population, deleteCodeCB) {
    var $ul = $('<ul>');
    $ul.append(population.data.reverse().map(function (co) {
      return $('<li>')
        .append(openLink(co))
        .append(solo(co.codeObjectId))
        .append(mute(co.codeObjectId))
        .append(deleteLink(co.codeObjectId, deleteCodeCB));
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

    $('#go-live').on('click', goLive);

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
        exec: goLive
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
