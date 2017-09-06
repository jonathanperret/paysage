module.exports = {
  url: function () {
    return this.api.launchUrl + '/list';
  },
  elements: {
    'playgrounds': { selector: 'ul' }
  }
};
