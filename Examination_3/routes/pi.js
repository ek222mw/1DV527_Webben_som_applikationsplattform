
var router = require("express").Router();
var resources = require('./../resources/model');
router.route("/")
.get(function(req, res) {
  res.redirect("/pi/resources");
});
module.exports = router;
