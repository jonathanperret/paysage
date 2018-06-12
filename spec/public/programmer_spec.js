/* global describe, beforeEach, afterEach, it, expect */
/* global $, Paysage */
describe('The Paysage programmer', function () {
  beforeEach(function () {
    $(document.body).append('<div id="testcontainer">' +
      '<div><input id="codeid"></div>' +
      '<div id="new-object-dialog"></div>' +
      '<div id="objects"></div>' +
      '</div>'
    );
  });

  afterEach(function () {
    $('#testcontainer').remove();
  });

  it('generates a random creature name on initialization', function () {
    window.location.hash = '';

    Paysage.programmerInit();

    expect(window.location.hash).not.toBe('');
    expect($('#codeid').val()).toBe(window.location.hash.slice(1));
  });

  it('can show the object list', function () {
    Paysage.setObjectList({
      objectIds: ['object1', 'object2']
    });
    var $list = $('#objects').html();
    expect($list).toContain('<li><a href="#">object1</a> - <a class="glyphicon glyphicon-trash" href="#"></a></li>');
    expect($list).toContain('<li><a href="#">object2</a> - <a class="glyphicon glyphicon-trash" href="#"></a></li>');
  });

  it('list objects in reverse order', function () {
    Paysage.setObjectList({
      objectIds: ['object1', 'object2']
    });
    var $list = $('#objects').html();
    expect($list).toMatch(/object2.*object1/);
  });

  it('start the object list with a link to open a new code', function () {
    Paysage.setObjectList({
      objectIds: ['object1', 'object2']
    });
    var $list = $('#objects').html();
    expect($list).toMatch(/^<li><a href="#">start a new creature…<\/a><\/li>/);
  });
});
