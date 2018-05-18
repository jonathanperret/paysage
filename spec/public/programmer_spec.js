/* global describe, beforeEach, afterEach, it, expect */
/* global $, Paysage */
describe('The Paysage programmer', function () {
  beforeEach(function () {
    $(document.body).append('<div id="testcontainer">' +
      '<div><input id="codeid"></div>' +
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
  });

  it('rename a code when codeid is changed', function () {
    var goLiveCall = 0;
    var oldCodeId;
    Paysage.deleteCode = function (codeId) {
      oldCodeId = codeId;
    };
    Paysage.goLive = function () {
      goLiveCall++;
    };
    Paysage.programmerInit();
    document.getElementById('codeid').oldvalue = 'ancienNom';
    $('#codeid').val('nouveauNom');
    $('#codeid').trigger('change');
    expect(oldCodeId).toBe('ancienNom');
    expect(goLiveCall).toBe(1);
  });
});
