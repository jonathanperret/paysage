var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");

module.exports = function(webhook){
  router.post('/', function(req, res) {
    console.log('webhooked !');
    webhook.handlePayload(req.body);
    res.status(200).end();
  });
  return router;
}
