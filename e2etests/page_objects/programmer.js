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
    'bottommost-codeObject': '#objects a:last-of-type li',
    'bottommost-codeObject-trash': '#objects a:last-of-type li a:first-of-type'
  },
  commands: [{
    setCodeId: function (codeid) {
      this.api.execute(`
        var codeid = document.querySelector("#codeid");
        codeid.value = "${codeid}";
        codeid.dispatchEvent(new Event("input"));
      `);
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
