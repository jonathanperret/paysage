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
      .expect(/here/);
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

    it("renderer receives objects list when programmer updates code", function(done) {
      renderer.on('objects list', function(data) {
        expect(data.objectIds).to.deep.equal(['creature']);
        done();
      });

      var data = {
        objectId: "creature",
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

