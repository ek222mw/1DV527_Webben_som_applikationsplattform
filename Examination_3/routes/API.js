/*jshint esversion: 6 */
var express = require('express'),
router = express.Router(),
resources = require('./../resources/model'),
converter = require("./../middleware/converter.js"),
Gpio = require('onoff').Gpio;
pir = new Gpio(17, 'in', 'both'), //Rörelsesensor
ledRed = new Gpio(22, 'out'), //Röd lampa
ledGreen = new Gpio(10, 'out'); //Grön lampa
var jwt = require('jsonwebtoken');


router.route('/')
.get(function (req, res) {
  req.result = resources;
  converter(req.result).call(req,res);
});

router.route('/customFields')
.get(function (req, res) {
  req.result = resources.customFields;
  converter(req.result).call(req,res);
});

router.route('/links')
.get(function (req, res) {
  req.result = resources.links;
  converter(req.result).call(req,res);
});

router.route('/links/properties')
.get(function (req, res) {
  req.result = resources.links.properties;
  converter(req.result).call(req,res);
});

router.route('/links/properties/resources')
.get(function (req, res) {
  req.result = resources.links.properties.resources;
  converter(req.result).call(req,res);
});

router.route('/links/properties/resources/leds')
.get(function (req, res) {
  req.result = resources.links.properties.resources.leds;
  converter(req.result).call(req,res);
});

router.route('/links/actions')
.get(function (req, res) {
  req.result = resources.links.actions;
  converter(req.result).call(req,res);
});

router.route('/links/actions/resources')
.get(function (req, res) {
  req.result = resources.links.actions.resources;
  converter(req.result).call(req,res);
});

//JWT
router.route('/links/actions/resources/ledState')
.get(function (req, res) {
  req.result = resources.links.actions.resources.ledState;
  converter(req.result).call(req,res);
});

router.route('/links/actions/resources/ledState/values')
.get(function (req, res) {
  req.result = resources.links.actions.resources.ledState.values;
  converter(req.result).call(req,res);
});

router.route('/links/actions/resources/ledState/values/ledId')
.get(function (req, res) {
  req.result = resources.links.actions.resources.ledState.values.ledId;
  converter(req.result).call(req,res);
});

router.route('/links/actions/resources/ledState/values/state')
.get(function (req, res) {
  req.result = resources.links.actions.resources.ledState.values.state;
  converter(req.result).call(req,res);
});

router.route('/links/properties/resources/leds/:id')
.get(function (req, res) { //#A
  if(resources.links.properties.resources.leds[req.params.id] === undefined){
    res.status(404).json({"success": false, "message": "LED not found"});
  }
  else {
    req.result = resources.links.properties.resources.leds[req.params.id];
    converter(req.result).call(req,res);
  }
});

router.route('/links/properties/resources/button')
.get(function (req, res) {
  req.result = resources.links.properties.resources.button;
  converter(req.result).call(req,res);
});

router.route('/links/properties/resources/pir')
.get(function (req, res) {
  req.result = resources.links.properties.resources.pir;
  converter(req.result).call(req,res);
});



router.route("/auth")
.post((req, res) => {
  if(req.body.pass === process.env.PASS){
    var token = jwt.sign({test: req.body.pass}, process.env.SECRET, {
      expiresIn: 1440
    });
    req.result = {"links": {"self": "/pi/resources/auth"}, "success": true, "token": token};
    converter(req.result).call(req,res);
  }
  else{
    res.status(401).json({"success": false, "message": "Password is not correct!"});
  }
});

//MIDDLEWARE
//********Verifies the token when trying to access all functions below***********
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        res.status(401).json({success: false, status: 401, message: "Failed to authenticate token."});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({success: false, status: 403, message: "No token provided!"});
  }
});

router.route('/links/actions/resources/ledState')
.put(function(req, res) { //#B
  var selectedLed = resources.links.properties.resources.leds.values[req.body.ledId];
  if(selectedLed === undefined){
    res.status(404).json({"success": false, "message": "LED not found"});
  }
  else {
    //#C
    if(req.body.state)
    {
      selectedLed.state = req.body.state;
    }
    else if(!req.body.state)
    {
      selectedLed.state = req.body.state;
    }
    if(req.body.ledId === '1' && req.body.state)
    {
      ledRed = new Gpio(22, 'out'), //Röd lampa
      ledRed.writeSync(1);
      req.result = selectedLed;
      converter(req.result).call(req,res);

    }
    else if(req.body.ledId === '1' && !req.body.state)
    {
      ledRed = new Gpio(22, 'out'), //Röd lampa
      ledRed.writeSync(0);
      req.result = selectedLed;
      converter(req.result).call(req,res);
    }
    if(req.body.ledId === '2' && req.body.state)
    {
      ledGreen = new Gpio(10, 'out'), //Grön lampa
      ledGreen.writeSync(1);
      req.result = selectedLed;
      converter(req.result).call(req,res);
    }
    else if(req.body.ledId === '2' && !req.body.state)
    {
      ledGreen = new Gpio(10, 'out'), //Grön lampa
      ledGreen.writeSync(0);
      req.result = selectedLed;
      converter(req.result).call(req,res);
    }
  }
});

module.exports = router;
