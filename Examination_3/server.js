/*jshint esversion: 6 */
require('dotenv').config();
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var path = require('path');
var express = require("express"),
app = express();
var resources = require('./resources/model');
var http = require('http');
var converter = require('./middleware/converter'),
cors = require('cors');
var https = require('https');
var fs = require('fs');
var pirPlugin = require('./plugins/internal/pirPlugin');
var buttonPlugin = require('./plugins/internal/buttonPlugin');

app.use(cors());

app.engine(".hbs", exphbs({
  defaultLayout: "main",
  extname: ".hbs"
}));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
var server =  https.createServer({key: fs.readFileSync("./config/sslcerts/key.pem"),cert: fs.readFileSync("./config/sslcerts/cert.pem")},app).listen(resources.customFields.port, function() {
  console.log('HTTPS server up ,listening on port %d',resources.customFields.port);
});
var io = require("socket.io")(server);
app.set('socket.io', io);
pirPlugin.start({'simulate': false, 'frequency': 2000, 'socket':io, 'app':app});
buttonPlugin.start({'simulate': false, 'frequency': 2000, 'socket':io, 'app':app});
app.use("/pi/resources/ui", require("./routes/ui.js"));
app.use('/', require("./routes/pi.js"));
app.use("/pi/resources", require("./routes/API"));
