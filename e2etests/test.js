const chromedriver = require('chromedriver');

process.env.TESTING = 'testing';
const server = require('../app');

module.exports = {
  before: function(browser, done) {
    server.listen(0, ()=> {
      chromedriver.start();

      done();
    });
  },

  after: function(browser, done) {
    console.log("stopping driver");
    chromedriver.stop();
    console.log("stopping server");
    server.close(done);
  },

 'test Paysage': function (browser) {
    browser
      .init('http://127.0.0.1:' + server.address().port)
      .execute(`
        const ta = document.querySelector("textarea");
        ta.value = "top.document.body.appendChild(document.createElement('test-marker'))";
        ta.dispatchEvent(new Event("input"));
      `)
      .click('#bouton')
      .waitForElementPresent("test-marker", 2000)
      .end();
  }
};
