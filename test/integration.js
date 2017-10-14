/* eslint-env mocha */
/* global expect */
process.env.TESTING = 'testing';

const World = require('../World');

describe('The Paysage server', function () {
  var server, request, world;

  beforeEach(function (done) {
    world = new World();
    server = require('../app')(world);
    request = require('supertest')(server);
    server.listen(0, done);
  });

  afterEach(function (done) {
    server.close(done);
  });

  it('lists playgrounds', function (done) {
    var herePlayground = world.getOrCreatePlayground('here');
    herePlayground.getOrCreateCodeObject('bill');
    request.get('/list')
      .expect(200)
      .expect(/here/, done);
  });

  describe('when a programmer and a renderer are connected', function () {
    var programmer, renderer;

    beforeEach(function (done) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;

      var doneWhenCalledTwice = callWhenCalledTimes(done, 2);

      renderer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'here', client: 'renderer' }
      });

      renderer.on('connect', function () {
        renderer.once('playground full update', function (data) {
          expect(data).to.deep.equal([]);
          doneWhenCalledTwice();
        });
      });

      programmer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'here', client: 'programmer' }
      });

      programmer.on('connect', function () {
        programmer.once('objects list', function (data) {
          expect(data.objectIds).to.deep.equal([]);
          doneWhenCalledTwice();
        });
      });
    });

    afterEach(function () {
      programmer.disconnect();
      renderer.disconnect();
    });

    it("programmer receives 'objects list' and renderer receives 'code update' when programmer updates code", function (done) {
      var doneWhenCalledTwice = callWhenCalledTimes(done, 2);

      programmer.on('objects list', function (data) {
        expect(data.objectIds).to.deep.equal(['bob']);
        doneWhenCalledTwice();
      });

      renderer.on('code update', function (data) {
        expect(data.codeObjectId).to.equal('bob');
        doneWhenCalledTwice();
      });

      var data = {
        codeObjectId: 'bob',
        source: 'dummy source'
      };
      programmer.emit('code update', data);
    });

    it("programmer receives 'objects list' and renderer receives 'code delete' when programmer deletes code", function (done) {
      var playground = world.getOrCreatePlayground('here');
      playground.getOrCreateCodeObject('bill');
      playground.getOrCreateCodeObject('bob');

      var halfdone = callWhenCalledTimes(done, 2);

      programmer.on('objects list', function (data) {
        expect(data.objectIds).to.deep.equal(['bill']);
        halfdone();
      });

      renderer.on('code delete', function (data) {
        expect(data.codeObjectId).to.equal('bob');
        halfdone();
      });

      programmer.emit('code delete', { codeObjectId: 'bob' });
    });
  });
});

function callWhenCalledTimes (callback, times) {
  return function () {
    times--;
    if (times === 0) callback();
  };
}
