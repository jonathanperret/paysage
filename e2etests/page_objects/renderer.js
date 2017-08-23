module.exports = {
  url: function() {
    var url = this.api.launchUrl;
    if (this.props.playgroundId)
      url = url + '/playground/' + this.props.playgroundId
    return url;
  },
  elements: {} // for some reason, we need this to use props
};
