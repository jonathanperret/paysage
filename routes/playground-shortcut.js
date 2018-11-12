module.exports = function (req, res) {
  res.redirect(`/playground/${req.params.playground}/programmer`);
};
