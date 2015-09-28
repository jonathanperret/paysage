var express = require('express');
var router = express.Router();


var renderplaygroundpage = function(req, res) {

  var id = req.params.pagename;

  // if the playground was never accessed, we create an object for it the llplaygrounds object, based on the URL 
  // [which will fail horribly for a lot of URLs, so we need to sanitize/hash that. How Etherpad is doing it?]

  res.render('playground', { title: id, playgroundid: id });
};



/* GET any page. */
router.get('/:pagename', renderplaygroundpage);

module.exports = router;
