const chromedriver = require('chromedriver');

process.env.TESTING = 'testing';
const server = require('../app')();

module.exports = {
  before: function(done) {
    console.log("starting server");
    server.listen(0, ()=>{
      this.test_settings.launch_url = 'http://127.0.0.1:' + server.address().port;
      console.log("starting chromedriver");
      const driverChild = chromedriver.start();
      driverChild.on('error',
                     (err)=>console.log("chromedriver start error", err));
      driverChild.on('exit',
                     (exitCode, signal)=>
                      console.log("chromedriver exited with",
                                  signal ? ("signal " + signal) : ("code " + exitCode)));
      console.log("chromedriver started, pid", driverChild.pid);

      setTimeout(()=>{
        done(driverChild.pid ? null : new Error("could not start chromedriver"));
      }, 2000);
    });
  },

  after: function(done) {
    console.log("stopping chromedriver");
    chromedriver.stop();
    console.log("stopping server");
    server.close(done);
  },
};
