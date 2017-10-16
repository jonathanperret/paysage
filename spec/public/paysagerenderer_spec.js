/* global describe, beforeEach, afterEach, it, expect, jasmine, spyOn */
/* global $, EventEmitter, Paysage */
describe('The Paysage renderer', function () {
  var socket;

  beforeEach(function () {
    $(document.body).append('<div id="container" data-playgroundid="a-playground"></div>');
    socket = new EventEmitter();
    window.io = function () {
      return {
        connect: function () { return socket; }
      };
    };
    spyOn(console, 'error');
    Paysage.rendererInit();
  });

  afterEach(function () {
    $('#container').remove();
  });

  it('executes code objects', function () {
    socket.emit('code update', {
      codeObjectId: 'bob',
      code: 'document.body.appendChild(document.createElement("test-marker"))'
    });
    expect($('test-marker')).toHaveLength(1);
  });

  it('reports compilation errors', function () {
    socket.emit('code update', {
      codeObjectId: 'bob',
      code: 'this is not valid'
    });
    expect(console.error).toHaveBeenCalledWith(
      jasmine.stringMatching(/Error in code object "bob". Code not rendered./),
      jasmine.any(Error));
  });

  it('reports runtime errors during setup()', function () {
    socket.emit('code update', {
      codeObjectId: 'bob',
      code: 'void setup() { nonExistent(); }'
    });
    expect(console.error).toHaveBeenCalledWith(
      jasmine.stringMatching(/Error in code object "bob". Code not rendered./),
      jasmine.any(Error));
  });

  it('reports runtime errors during draw()', function (done) {
    console.error.and.callFake(function (message) {
      expect(message).toMatch(/Error in code object "bob". Rendering stopped./);
      done();
    });
    socket.emit('code update', {
      codeObjectId: 'bob',
      code: 'void draw() { nonExistent(); }'
    });
  });
});
