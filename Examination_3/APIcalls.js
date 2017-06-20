//This will handle the API calls
var request = require('request');

const authURL = 'https://dv-rpi3.lnu.se:20443/pi/resources/auth';
const ledURL = 'https://dv-rpi3.lnu.se:20443/pi/resources/links/actions/resources/ledState';

module.exports = {
  //Change the leds
  changeLedState: function(ledId, state) {
    request.post(authURL,{
      form:    {pass:process.env.PASS}
    }, function(error, response, body){
      test = JSON.parse(body);

      request.put(ledURL,{
        headers: {'Content-type' : 'application/json', 'x-access-token':test.token},
        body:    JSON.stringify({
          "ledId" :ledId,
          "state": state
        })
      }, function(error, response, body){
        console.log(body);
      });
    });
  },
};
