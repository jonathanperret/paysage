/* global describe, beforeEach, afterEach, it, expect */
/* global $, Paysage */
describe('The Paysage programmer', function () {
  beforeEach(function () {
    $(document.body).append('<div id="testcontainer">' +
      '<div><input id="codeid"></div>' +
      '<div id="new-object-dialog" style="display:none;"></div>' +
      '<div id="objects"></div>' +
      '</div>'
    );
  });

  afterEach(function () {
    $('#testcontainer').remove();
    $('#new-object-dialog').remove();
  });

  it('generates a random creature name on initialization', function () {
    window.location.hash = '';

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

  it('can show the object list', function () {
    Paysage.setObjectList({
      objectIds: ['object1', 'object2']
    });
    var $list = $('#objects').html();
    expect($list).toContain('<a href="#"><li>object1<a class="glyphicon glyphicon-remove-circle" href="#"></a></li></a>');
    expect($list).toContain('<a href="#"><li>object2<a class="glyphicon glyphicon-remove-circle" href="#"></a></li></a>');
  });

  it('list objects in reverse order', function () {
    Paysage.setObjectList({
      objectIds: ['object1', 'object2']
    });
    var $list = $('#objects').html();
    expect($list).toMatch(/object2.*object1/);
  });
});
