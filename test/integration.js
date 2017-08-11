process.env.TESTING='testing';

const World = require('../World');

describe("These integration tests", function() {
  var server, request, world;

  beforeEach(function (done) {
    world = new World();
    server = require('../app')(world);
    request = require('supertest')(server);
    server.listen(0, done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  it("may launch a server", function() {
    world.getOrCreatePlayground('ici');
    return request
      .get('/list')
      .expect(200)
      .expect(/ici/);
  });

  describe("has client-server scenarios where", function() {

    var programmer, renderer;

    beforeEach(function (done) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;

      var doneWhenCalledTwice = callWhenCalledTimes(done,2);

      renderer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'here', client: 'renderer' }
      });
      renderer.on('connect', doneWhenCalledTwice);

      programmer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'here', client: 'programmer' }
      });
      programmer.on('connect', doneWhenCalledTwice);
    });


    afterEach(function() {
      programmer.disconnect();
      renderer.disconnect();
    });

    it("renderer and programmer receive events when programmer updates code", function(done) {
      var halfdone = callWhenCalledTimes(done,2);

      programmer.on('objects list', function(data) {
        expect(data.playgroundId).to.equal('here');
        expect(data.objectIds).to.deep.equal(['bob']);
        halfdone();
      });

      renderer.on('code update', function(data) {
        expect(data.objectId).to.equal('bob');
        halfdone();
      });

      var data = {
        playgroundId: "here",
        objectId: "bob",
        source: 'dummy source',
      };
      programmer.emit('code update', data);
    });

    it("programmer receives 'objects list' and rendrer receives 'code delete' when programmer deletes code", function(done) {
      var playground = world.getOrCreatePlayground('here');
      playground.getOrCreateCodeObject('bill');
      playground.getOrCreateCodeObject('bob');

      var halfdone = callWhenCalledTimes(done,2);

      programmer.on('objects list', function(data) {
        expect(data.playgroundId).to.equal('here');
        expect(data.objectIds).to.deep.equal(['bill']);
        halfdone();
      });

      renderer.on('code delete', function(data) {
        expect(data.playgroundId).to.equal('here');
        expect(data.objectId).to.equal('bob');
        halfdone();
      });

      var data = {
        playgroundId: "here",
        objectId: "bob",
      };
      programmer.emit('code delete', data);
    });
  });
});

function callWhenCalledTimes(callback,times) {
  return function() {
    times--;
    if (times == 0) callback();
  };
};

