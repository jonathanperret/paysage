/* global describe, beforeEach, afterEach, it, expect */
/* global $, Paysage */
describe('The Paysage programmer', function () {
  beforeEach(function () {
    $(document.body).append('<div id="testcontainer">' +
      '<div><input id="codeid"></div>' +
      '<div><input id="codeName"></div>' +
      '<div id="new-object-dialog" style="display:none;"></div>' +
      '<div id="objects"></div>' +
      '<button id="go-live"></button>' +
      '</div>'
    );
    window.location.hash = '';
  });

  afterEach(function () {
    $('#testcontainer').remove();
    $('#new-object-dialog').remove();
  });

  it('generates a random creature id on initialization', function () {
    Paysage.programmerInit();

    expect(window.location.hash).not.toBe('');
    expect($('#codeid').val()).toBe(window.location.hash.slice(1));
    expect($('#new-object-dialog').parent().css('display')).toBe('block');
  });

  it('request the code when codeId is present on the url', function () {
    window.location.hash = 'toto';

    var requestedCodeId;
    Paysage.requestCode = function (codeObjectId) {
      requestedCodeId = codeObjectId;
    };

    Paysage.programmerInit();

    expect(requestedCodeId).toBe('toto');
    expect($('#new-object-dialog').css('display')).toBe('none');
  });

  it('emit code object when clicking the go-live button', function () {
    var completeCodeObjectData = {};
    var dataToEmit = null;
    Paysage.emitCodeUpdate = function (data) {
      dataToEmit = data;
    };
    Paysage.getCompleteCodeObject = function () {
      return completeCodeObjectData;
    };
    Paysage.programmerInit();

    $('#go-live').trigger('click');

    expect(dataToEmit).toBe(completeCodeObjectData);
  });

  it('can show the object list', function () {
    Paysage.setObjectList({
      data: [
        {codeObjectId: 'object1', name: 'name 1'},
        {codeObjectId: 'object2', name: 'name2'}
      ]
    });
    var $list = $('#objects').html();
    var buttons = '<a class="solo" href="#">solo</a><a class="glyphicon glyphicon-eye-open mute" href="#"></a><a class="glyphicon glyphicon-remove-circle delete" href="#"></a>';
    expect($list).toContain('<li><a href="#object1">name 1</a>' + buttons + '</li>');
    expect($list).toContain('<li><a href="#object2">name2</a>' + buttons + '</li>');
  });

  it('list objects in reverse order', function () {
    Paysage.setObjectList({
      data: [
        {codeObjectId: 'object1', name: 'name1'},
        {codeObjectId: 'object2', name: 'name2'}
      ]
    });
    var $list = $('#objects').html();
    expect($list).toMatch(/name2.*name1/);
  });
});
