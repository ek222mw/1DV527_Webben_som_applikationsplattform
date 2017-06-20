var resources = require('./../../resources/model');
var bool = false;
var interval, sensor;
var model = resources.links.properties.resources.button;
var pluginName = resources.links.properties.resources.button.name;
var localParams = {'simulate': false, 'frequency': 2000};
var discordAlarm = require("./../../discordAlarm.js");
var APIcalls = require('./../../APIcalls');
var start = false;
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
  if (!start) {
    APIcalls.changeLedState("2", true);
    start = true;
  }
  app.set('bool', false);
  var Gpio = require('onoff').Gpio;
  sensor = new Gpio(model.values.presence.customFields.gpio, 'in', 'both');
  button = new Gpio(model.values.presence.customFields.gpio, 'in', 'both');
  button.watch(function (err, value) {
    if (err) exit(err);

    if(!value && !app.get('bool'))
    {
      discordAlarm.discordAlarmDeactivated();
      socket.emit('alarm',{d:true});
      app.set('bool',true);
    }
    APIcalls.changeLedState("2", true);
    APIcalls.changeLedState("1", false);

    model.values.presence.state = !!value;
    showValue();
  });
  console.info('Hardware %s button started!', pluginName);
};

function simulate() {
  interval = setInterval(function () {
    model.values.presence.state = !model.values.presence.state;
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s button started!', pluginName);
};

function showValue() {
  console.info(model.values.presence.state ? 'Button not pressed!' : 'button pressed!');
};
