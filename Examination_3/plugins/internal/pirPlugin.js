var resources = require('./../../resources/model');
var bool = false;
var interval, sensor;
var model = resources.links.properties.resources.pir;
var pluginName = resources.links.properties.resources.pir.name;
var localParams = {'simulate': false, 'frequency': 2000};
var APIcalls = require('./../../APIcalls');
var discordAlarm = require("./../../discordAlarm.js");
var request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.start = function (params) {
  localParams = params;
  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware(localParams.socket, localParams.app);
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    sensor.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function connectHardware(socket, app) {
  var Gpio = require('onoff').Gpio;
  sensor = new Gpio(model.values.presence.customFields.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);

    //Om larmet går
    if(value == 1)
    {
      APIcalls.changeLedState("2", false);
      APIcalls.changeLedState("1", true);
      app.set('bool', false);
      discordAlarm.discordAlarm();
      socket.emit('alarm', {data:false});
      boolsocket = false;
      bool = false;
      console.log('Intruder detected');
    }

    model.values.presence.state = !!value;
    showValue();
  });
  console.info('Hardware %s sensor started!', pluginName);
};

function simulate() { 
  interval = setInterval(function () {
    model.values.presence.state = !model.values.presence.state;
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
  console.info(model.values.presence.state ? 'there is someone!' : 'not anymore!');
};
