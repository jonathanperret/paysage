var express = require('express');
module.exports = function(codeObjects) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('index', { title: 'Paysage', playgrounds: codeObjects });
  });

  return router;
}
