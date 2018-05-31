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
    'bottommost-codeObject': '#objects li:last-of-type a:first-of-type',
    'bottommost-codeObject-trash': '#objects li:last-of-type a:last-of-type'
  },
  commands: [{
    setCodeName: function (codeName) {
      this.api.execute(`
        var codeNameElement = document.querySelector("#codeName");
        codeNameElement.value = "${codeName}";
        codeNameElement.dispatchEvent(new Event("input"));
      `);
      return this;
    },
    clickExample: function () {
      this.api.execute(`
        var example = document.querySelector(".example");
        example.dispatchEvent(new Event("click"));
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
