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

  describe('when a programmer and a renderer are connected', function () {
    var programmer, renderer;

    beforeEach(function (done) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;

      var halfdone = callWhenCalledTimes(done, 2);

      renderer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'a-test-playground', client: 'renderer' }
      });

      renderer.on('connect', function () {
        renderer.once('playground full update', function (data) {
          expect(data).to.deep.equal([]);
          halfdone();
        });
      });

      programmer = require('socket.io-client')(serverUrl, {
        forceNew: true,
        query: { playgroundId: 'a-test-playground', client: 'programmer' }
      });

      programmer.on('connect', function () {
        programmer.once('objects list', function (population) {
          expect(population.data).to.deep.equal([]);
          halfdone();
        });
      });
    });

    afterEach(function () {
      programmer.disconnect();
      renderer.disconnect();
    });

    it('lists the created playground', function () {
      return request
        .get('/list')
        .expect(200)
        .expect(/a-test-playground/);
    });

    it("removes the playground if it's empty when clients go away", function () {
      programmer.disconnect();
      renderer.disconnect();
      return request
        .get('/list')
        .expect(200)
        .expect((res) => {
          expect(res.text).not.to.match(/a-test-playground/);
        });
    });

    it("sends programmer 'objects list' and renderer 'code update' when programmer updates code", function (done) {
      var halfdone = callWhenCalledTimes(done, 2);

      programmer.on('objects list', function (population) {
        expect(population.data).to.deep.equal([{codeObjectId: 'bob', name: 'bob'}]);
        halfdone();
      });

      renderer.on('code update', function (data) {
        expect(data.codeObjectId).to.equal('bob');
        halfdone();
      });

      programmer.emit('code update', {
        codeObjectId: 'bob',
        source: 'dummy source'
      });
    });

    it("sends programmer 'objects list' and renderer 'code delete' when programmer deletes code", function (done) {
      programmer.emit('code update', {
        codeObjectId: 'bill',
        source: 'dummy source'
      });

      programmer.once('objects list', function (population) {
        expect(population.data).to.deep.equal([
          {codeObjectId: 'bill', name: 'bill'}]);

        programmer.emit('code update', {
          codeObjectId: 'bob',
          source: 'dummy source'
        });

        programmer.once('objects list', function (population) {
          expect(population.data).to.deep.equal([
            {codeObjectId: 'bill', name: 'bill'},
            {codeObjectId: 'bob', name: 'bob'}]);

          var halfdone = callWhenCalledTimes(done, 2);

          programmer.on('objects list', function (population) {
            expect(population.data).to.deep.equal([
              {codeObjectId: 'bill', name: 'bill'}]);
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
  });
});

function callWhenCalledTimes (callback, times) {
  return function () {
    times--;
    if (times === 0) callback();
  };
}
