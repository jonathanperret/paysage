module.exports = {
  url: function () {
    return this.api.launchUrl + '/workshop/creature';
  },
  elements: {
    'go-live': '#go-live',
    'open-in-new-window': '#openinnewwindow'
  },
  commands: [{
    setCode: function (code) {
      this.api.execute(`
        var ta = document.querySelector("#code");
        ta.value = "${code.replace(/\\/, '\\\\').replace(/"/, '"')}";
        ta.dispatchEvent(new Event("input"));
      `);
      return this;
    }
  }]
};
