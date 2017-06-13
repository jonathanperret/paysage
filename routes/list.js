var express = require('express');
module.exports = function(codeObjects) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('list', {
      title: 'Paysage',
      playgrounds: codeObjects,
      hasPlayground: Object.keys(codeObjects).length > 0
    });
  });

  return router;
};
