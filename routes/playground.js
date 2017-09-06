var express = require('express');
var router = express.Router();

router.get('/:playground/programmer', function (req, res) {
  var id = req.params.playground;
  res.render('programmer', { playgroundid: id });
});

router.get('/:playground', function (req, res) {
  var id = req.params.playground;
  res.render('playground', { playgroundid: id });
});

module.exports = router;
