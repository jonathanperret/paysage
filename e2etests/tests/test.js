const TIMEOUT=2000;

module.exports = {

  'Default url redirects to programmer': function (browser) {
    browser
      .url(browser.launchUrl)
      .assert.urlContains('/playground/')
      .assert.urlContains('/programmer#')
  },

  'Playgrounds are listed': function (browser) {
    var programmer = browser.page.programmer();
    programmer.props.playgroundId = 'here';
    programmer
      .navigate()
      .setCode("// whatever")
      .click('@go-live')
    browser.page.list()
        .navigate()
        .expect.element('ul').text.to.contain('here');
  },

  'New code object is rendered': function (browser) {
    browser.page.programmer()
      .navigate()
      .setCode("top.document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .expect.element('test-marker').to.be.present;
  },

  'New code object is listed': function (browser) {
    browser.page.programmer()
      .navigate()
      .setCodeId("jim")
      .click('@go-live')
      .expect.element('@last-codeObject').text.to.equal("jim");
  },

  'A listed code object can be deleted': function(browser) {
    browser.page.programmer()
      .navigate()
      .setCodeId("jul")
      .click('@go-live')
      .setCodeId("jim")
      .click('@go-live')
      .click('@last-codeObject-trash')
      .expect.element('@last-codeObject').text.to.equal("jul");
    browser.page.programmer()
      .click('@last-codeObject-trash')
      .expect.element('@last-codeObject').to.not.be.present;
  },

  'Renderer gets code objets at startup': function (browser) {
    var programmer = browser.page.programmer();
    programmer.props.playgroundId = 'somewhere';
    var renderer = browser.page.renderer();
    renderer.props.playgroundId = 'somewhere';

    programmer
      .navigate()
      .setCode("document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .expect.element('@last-codeObject').to.be.present;

    renderer
      .navigate()
      .expect.element('test-marker').to.be.present;
  },

  'Workshop works too': function(browser) {
    browser.page.creatureprogrammer()
      .navigate()
      .setCode("if (loop==0) document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .click('@open-in-new-window');

    browser
      .window_handles(function(result) {
        this.assert.equal(result.value.length, 2, 'There should be two open windows.');
        var handle = result.value[1];
        this.switchWindow(handle);
        this.waitForElementPresent('test-marker', TIMEOUT);
      })
  },

  after: function(browser) {
    browser.end();
  },
};