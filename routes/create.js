var express = require('express');
var router = express.Router();
var Chance = require('chance');
var chance = new Chance();

router.get('/', function(req, res){
  var id = process.env.DEFAULT_PLAYGROUND || chance.word({syllables: 3});
  res.redirect('playground/' + encodeURIComponent(id) + '/programmer')
});

module.exports = router;
