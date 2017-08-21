"use strict";

const expect = require('chai').expect;
process.env.TESTING='testing';

describe("The server", function() {
  var server, request;

  beforeEach(function (done) {
    var codeObjects = {
      aPlayground: {
        object1: '// code1',
        object2: '// code2'
      }
    }
    server = require('../app')(codeObjects);
    request = require('supertest')(server);
    server.listen(0, done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  it("lists playgrounds", function() {
    return request
      .get('/list')
      .expect(200)
      .expect(/aPlayground/);
  });

  it("sends all codeObjects when a renderer connects", function(done)  {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;
      var renderer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'aPlayground', client: 'renderer' }
      });
      renderer.on('connect', function() {
        renderer.on('playground full update', function(data) {
          expect(data).to.deep.equal({object1: '// code1', object2: '// code2'});
          done();
        });
      });
  });

  describe("makes sure that programmer and renderer", function() {

    var programmer, renderer;

    beforeEach(function (done) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;

      var doneWhenCalledTwice = callWhenCalledTimes(done,2);

      renderer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'aPlayground', client: 'renderer' }
      });
      renderer.on('connect', doneWhenCalledTwice);

      programmer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'aPlayground', client: 'programmer' }
      });
      programmer.on('connect', doneWhenCalledTwice);
    });

    afterEach(function() {
      programmer.disconnect();
      renderer.disconnect();
    });

    it("receive codeObjects list when programmer updates a codeObject", function(done) {
      renderer.on('objects list', function(data) {
        expect(data.objectIds).to.contain('creature');
        done();
      });

      var data = {
        objectId: "creature",
        source: 'dummy source',
      };
      programmer.emit('code update', data);
    });

    it("receive objects list when programmer deletes a codeObject", function(done) {

      var doneWhenCalledTwice = callWhenCalledTimes(done,2);

      renderer.on('objects list', function(data) {
        expect(data.objectIds).to.not.contain('object1');
        doneWhenCalledTwice();
      });

      programmer.on('objects list', function(data) {
        doneWhenCalledTwice();
      });

      programmer.emit('code delete', {objectId: "object1"});
    });
  });
});

function callWhenCalledTimes(callback,times) {
  return function() {
    times--;
    if (times == 0) callback();
  };
};

