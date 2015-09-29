var express = require('express');
module.exports = function(codeObjects) {
  var router = express.Router();

  router.get('/', function(req, res) {
    if (Object.keys(codeObjects).length === 0) {
      codeObjects = {boumsplash: null};
    }
    res.render('index', { title: 'Paysage', playgrounds: codeObjects });
  });

  return router;
}
