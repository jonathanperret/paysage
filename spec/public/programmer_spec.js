/* global describe, beforeEach, afterEach, it, expect */
/* global $, Paysage */
describe('The Paysage programmer', function () {
  beforeEach(function () {
    $(document.body).append('<div id="testcontainer">' +
      '<div><input id="codeid"></div>' +
      '<div><input id="codeName"></div>' +
      '</div>'
    );
    window.location.hash = '';
  });

  afterEach(function () {
    $('#testcontainer').remove();
  });

  it('generates a random creature name on initialization', function () {
    Paysage.programmerInit();

    expect(window.location.hash).not.toBe('');
    expect($('#codeid').val()).toBe(window.location.hash.slice(1));
    expect($('#codeName').val()).toBe(window.location.hash.slice(1));
  });

  it('rename a code when codeName is changed', function () {
    var codeId;
    var newCodeName;
    Paysage.renameCode = function (_codeId, newName) {
      codeId = _codeId;
      newCodeName = newName;
    };
    Paysage.programmerInit();
    document.getElementById('codeid').value = 'codeId';
    $('#codeName').val('nouveauNom');
    $('#codeName').trigger('change');
    expect(codeId).toBe('codeId');
    expect(newCodeName).toBe('nouveauNom');
  });
});
