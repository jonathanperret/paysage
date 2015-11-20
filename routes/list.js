var express = require('express');
module.exports = function(codeObjects) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('list', { title: 'Paysage', playgrounds: codeObjects });
  });

  return router;
};