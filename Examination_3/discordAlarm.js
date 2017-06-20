//This will handle the discord messages
var request = require("request");
module.exports = {
  //Message that someone triggered the alarm
  discordAlarm: function() {
    request.post(
      process.env.DISCORD_WEBHOOK,
      { json: { content: '@everyone Intruder Alert!!!' } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }
    );
  },

  //Message that the alarm was deactivated
  discordAlarmDeactivated: function() {
    request.post(
      process.env.DISCORD_WEBHOOK,
      { json: { content: '@everyone Alarm was deactivated!' } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }
    );
  },

  //Message that the alarm was activated
  discordAlarmActivated: function() {
    request.post(
      process.env.DISCORD_WEBHOOK,
      { json: { content: '@everyone Alarm was activated!' } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }
    );
  },

  //Message that an error occured on the alarm device
  discordAlarmError: function() {
    request.post(
      process.env.DISCORD_WEBHOOK,
      { json: { content: '@everyone An error occured in the alarm!' } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }
    );
  },

};
