module.exports = {
  'Pushed code is rendered': function (browser) {
    browser.page.programmer()
      .navigate()
      .setCode("top.document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .waitForElementPresent('test-marker', 2000);
  },
  'Code object is listed': function (browser) {
    browser.page.programmer()
      .navigate()
      .setCodeId('toto')
      .click('@go-live')
      .expect.element('#objects li a:first-of-type').text.to.equal('toto');
  },
  after: function(browser) {
    browser.end();
  },
};
