var express = require('express');
var router = express.Router();

router.get('/creature', function (req, res) {
  res.render('creatureprogrammer', {workshop: 'codecreatureliveparty', hasplaygroundlink: req.query.hasplaygroundlink});
});

router.get('/creaturefutur', function (req, res) {
  res.render('creatureprogrammer', {workshop: 'creaturefutur', hasplaygroundlink: req.query.hasplaygroundlink});
});

module.exports = router;
