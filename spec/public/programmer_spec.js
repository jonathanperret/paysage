/* global describe, it, expect */
/* global $, Paysage */
describe('The Paysage programmer', function () {
  it('generates a random creature name on initialization', function () {
    window.location.hash = '';
    $(document.body).append('<div><input id="codeid"></div>');

    Paysage.programmerInit();

    expect(window.location.hash).not.toBe('');
    expect($('#codeid').val()).toBe(window.location.hash.slice(1));
  });
});
