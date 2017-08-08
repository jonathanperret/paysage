module.exports = {
  'test Paysage': function (browser) {
    browser.page.programmer()
      .navigate()
      .setCode("top.document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .waitForElementPresent('test-marker', 2000);

    browser.end();
  }
};
