var express = require('express');
var router = express.Router();

  router.get('/creature', function(req, res) {
    res.render('creatureprogrammer');
  });

console.log("routing workshop");

module.exports = router;