const chromedriver = require('chromedriver');

process.env.TESTING = 'testing';
const server = require('../app')();

module.exports = {
  before: function (done) {
    console.log('starting chromedriver');
    chromedriver.start([], /* returnPromise */ true).then((driverChild) => {
      driverChild.on('exit',
        (exitCode, signal) =>
          console.log('chromedriver exited with',
            signal ? ('signal ' + signal) : ('code ' + exitCode)));

      console.log('chromedriver started, pid', driverChild.pid);

      done();
    }, done);
  },

  beforeEach: function (api, done) {
    console.log('starting server');
    server.listen(0, () => {
      api.launch_url = api.launchUrl = 'http://127.0.0.1:' + server.address().port;
      done();
    });
  },

  afterEach: function (done) {
    console.log('stopping server');
    server.close(done);
  },

  after: function () {
    console.log('stopping chromedriver');
    chromedriver.stop();
  }
};
