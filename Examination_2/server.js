var express = require('express');
var app = express();
var fs = require("fs");
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let path = require('path');
let https = require('https');

let port = process.env.PORT || 3000;
require("./libs/helper").initialize();

app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs"
}));
app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", require("./routes/home.js"));



https.createServer({
    key: fs.readFileSync("./config/sslcerts/key.pem"),
    cert: fs.readFileSync("./config/sslcerts/cert.pem")
}, app).listen(port, function() {
      console.log("Server app rolling on https port %s!", port);
});
