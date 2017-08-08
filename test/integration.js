const expect = require('chai').expect;
process.env.TESTING='testing';

describe("These integration tests", function() {
  var server, request;

  beforeEach(function (done) {
    server = require('../app');
    request = require('supertest')(server);
    server.listen(3001,done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  it("may launch a server", function(done) {
    request
           .get('/list')
           .expect(200)
           .expect(/to start a new playground/)
           .end(done);
  });

  describe("has client-server scenarios where", function() {

    var programmer, renderer;

    beforeEach(function (done) {
      renderer = require('socket.io-client')('http://localhost:3001', { forceNew: true });
      programmer = require('socket.io-client')('http://localhost:3001', { forceNew: true });

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
        expect(data.objectIds).to.deep.equal(['creature']);
        done();
      });

      programmer.emit('programmer up', 'playground');

      renderer.emit('playground up', 'playground');

      var data = {
        playgroundId: "playground",
        objectId: "creature",
        source: 'dummy source',
      };
      programmer.emit('code update', data);
    });
  });
});

function doneGlue(done) {
  return function(err, res) {
    if(err)
      done.fail(err);
    else
      done();
  };
}

function callWhenCalledTimes(callback,times) {
  return function() {
    times--;
    if (times == 0) callback();
  };
};

