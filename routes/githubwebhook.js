var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");

router.post('/', function(req, res) {
  console.log(beautify(req.body,null,2,80));
  res.status(200).end();
});

module.exports = router;
