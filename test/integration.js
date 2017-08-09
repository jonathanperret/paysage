const expect = require('chai').expect;
process.env.TESTING='testing';

describe("These integration tests", function() {
  var server, request;

  beforeEach(function (done) {
    server = require('../app');
    request = require('supertest')(server);
    server.listen(0, done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  it("may launch a server", function() {
    return request
           .get('/list')
           .expect(200)
           .expect(/to start a new playground/);
  });

  describe("has client-server scenarios where", function() {

    var programmer, renderer;

    beforeEach(function (done) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;
      renderer = require('socket.io-client')(serverUrl, { forceNew: true });
      programmer = require('socket.io-client')(serverUrl, { forceNew: true });

      var doneWhenCalledTwice = callWhenCalledTimes(done,2);
      programmer.on('connect', doneWhenCalledTwice);
      renderer.on('connect', doneWhenCalledTwice);
    });

    afterEach(function() {
      programmer.disconnect();
      renderer.disconnect();
    });

    it("renderer receives objects list when programmer updates code", function(done) {
      renderer.on('objects list', function(data) {
        expect(data.playgroundId).to.equal('playground');
        expect(data.objectIds).to.deep.equal(['codeObject']);
        done();
      });

      programmer.emit('programmer up', 'playground');

      renderer.emit('playground up', 'playground');

      var data = {
        playgroundId: "playground",
        objectId: "codeObject",
        source: 'dummy source',
      };
      programmer.emit('code update', data);
    });
  });
});

function callWhenCalledTimes(callback,times) {
  return function() {
    times--;
    if (times == 0) callback();
  };
};

