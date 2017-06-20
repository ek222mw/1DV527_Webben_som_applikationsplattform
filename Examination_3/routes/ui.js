var router = require("express").Router();
var Gpio = require('onoff').Gpio,
pir = new Gpio(17, 'in', 'both'), //Rörelsesensor
ledRed = new Gpio(22, 'out'), //Röd lampa
ledGreen = new Gpio(10, 'out'), //Grön lampa
button = new Gpio(27, 'in', 'both');  //Knapp
var request = require('request');
var WatchJS = require("watchjs");
var APIcalls = require('./../APIcalls');
var discordAlarm = require("./../discordAlarm.js");
var watch = WatchJS.watch;
var boolsocket = false;
var bool = false;

router.route("/")
.get(function(req, res) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var test;
  discordAlarm.discordAlarmActivated();
  var io = req.app.get('socket.io');
  io.on('connection', function (socket) {
    socket.on("AlarmButt", function(data) {
      if(!boolsocket && data.password === process.env.CODE)
      {
        var token;
        APIcalls.changeLedState("2", true);
        APIcalls.changeLedState("1", false);
        discordAlarm.discordAlarmDeactivated();
        value = 0;
        socket.emit('alarm', {d:true});
      }
    });

    //APIcalls.changeLedState("2", true);
    console.log('Pi Bot deployed successfully!');
    console.log('Guarding the Magic pencil...');

    function exit() {
      ledRed.unexport();
      pir.unexport();
      button.unexport();
      process.exit();
    }
  });

  res.render("home/index");
});

module.exports = router;
