require('dotenv').config();
if(!process.env.PORT) throw new Error("Need a valid server port.");
global.db = require("./logic/dakDB");
global.express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
//Create express server
var app = express()
app.listen(process.env.PORT);
console.log("Listening for HTTP traffic on port:", process.env.PORT)
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Sets the template engine to be handlebars
var hbs = exphbs.create({defaultLayout: 'base'})
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Serves all files in the res folder as static resources
global.router = express.Router();
global.api_router = express.Router();
app.use('/res', express.static('res'));
app.use(process.env.BASE_URL, router);
global.dakAPI = require("./logic/dakAPI")
global.dakActuators = require("./logic/dakActuators")
global.dakSleep = require("./logic/dakSleep")
global.dakRules = require("./logic/dakRules")
global.dakSensors = require("./logic/dakSensors")
require("./routers/routers")
module.exports = app;
