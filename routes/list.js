var express = require('express');
module.exports = function(world) {
  var router = express.Router();

  router.get('/', function(req, res) {
    var playgrounds = {};
    world.tour().forEach(function(name){playgrounds[name]={};})
    res.render('list', {
      title: 'Paysage',
      playgrounds: playgrounds,
      hasPlayground: world.tour().length > 0
    });
  });

  return router;
};
