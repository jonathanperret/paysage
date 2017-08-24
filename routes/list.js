var express = require('express');
module.exports = function(world) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('list', {
      title: 'Paysage',
      playgrounds: world.tour(),
      hasPlayground: world.tour().length > 0
    });
  });

  return router;
};
