const chromedriver = require('chromedriver');

process.env.TESTING = 'testing';
const server = require('../app')();

module.exports = {
  before: function (done) {
    console.log('starting chromedriver');
    const driverChild = chromedriver.start();
    driverChild.on('error',
      (err) => console.log('chromedriver start error', err));
    driverChild.on('exit',
      (exitCode, signal) =>
        console.log('chromedriver exited with',
          signal ? ('signal ' + signal) : ('code ' + exitCode)));
    console.log('chromedriver started, pid', driverChild.pid);

    setTimeout(() => {
      done(driverChild.pid ? null : new Error('could not start chromedriver'));
    }, 2000);
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
