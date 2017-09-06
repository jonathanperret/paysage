module.exports = {
  url: function () {
    var url = this.api.launchUrl;
    if (!this.props.playgroundId) { return url; }
    url = url + '/playground/' + this.props.playgroundId + '/programmer';
    if (this.props.codeObjectId) { url = url + '#' + this.props.codeObjectId; }
    return url;
  },
  elements: {
    'go-live': '#go-live',
    'last-codeObject': '#objects li:last-of-type a:first-of-type',
    'last-codeObject-trash': '#objects li:last-of-type a:last-of-type'
  },
  commands: [{
    setCodeId: function (codeid) {
      this.api.clearValue('#codeid')
              .setValue('#codeid', codeid);
      return this;
    },
    setCode: function (code) {
      this.api.execute(`
        var ta = document.querySelector("#code textarea");
        ta.value = "${code.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}";
        ta.dispatchEvent(new Event("input"));
      `);
      return this;
    }
  }]
};
