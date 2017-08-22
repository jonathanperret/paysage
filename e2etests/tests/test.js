module.exports = {
  'Default url redirects to programmer': function (browser) {
    browser
      .url(browser.launchUrl)
      .assert.urlContains('/playground/')
      .assert.urlContains('/programmer#')
  },

  'Playgrounds are listed': function (browser) {
    var programmer = browser.page.programmer()
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
    var programmer = browser.page.programmer()
    programmer
      .navigate()
      .setCode("top.document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .waitForElementPresent('test-marker', 2000);
  },

  'New code object is listed': function (browser) {
    browser.page.programmer()
      .navigate()
      .setCodeId('jim')
      .click('@go-live')
      .expect.element('@last-codeObject').text.to.equal('jim');
  },

  'Renderer gets code objets a startup': function (browser) {
    var programmer = browser.page.programmer()
    programmer.props.playgroundId = 'somewhere';
    var renderer = browser.page.renderer();
    renderer.props.playgroundId = 'somewhere';

    programmer
      .navigate()
      .setCode("document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .waitForElementPresent('@last-codeObject',2000)

    renderer
      .navigate()
      .waitForElementPresent('test-marker', 2000);

  },

  'Workshop works too': function(browser) {
    browser.page.creatureprogrammer()
      .navigate()
      .setCode("if (loop==0) document.body.appendChild(document.createElement('test-marker'))")
      .click('@go-live')
      .click('#openinnewwindow')
    browser
      .window_handles(function(result) {
        this.assert.equal(result.value.length, 2, 'There should be two open windows.');
        var handle = result.value[1];
        this.switchWindow(handle);
        this.waitForElementPresent('test-marker', 2000);
      })
  },

  after: function(browser) {
    browser.end();
  },
};
