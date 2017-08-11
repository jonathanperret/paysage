module.exports = {
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    'go-live': { selector: '#go-live' }
  },
  commands: [{
    setCode: function(code) {
      this.api.execute(`
        var ta = document.querySelector("#code textarea");
        ta.value = "${code.replace(/\\/,'\\\\').replace(/"/,'"')}";
        ta.dispatchEvent(new Event("input"));
      `);
      return this;
    }
  }]
};
