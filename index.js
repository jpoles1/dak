require('dotenv').config();
if(!process.env.PORT) throw new Error("Need a valid server port.");
global.db = require("./logic/dakDB");
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
//Create express server
var app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Sets the template engine to be handlebars
var hbs = exphbs.create({defaultLayout: 'base'})
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Serves all files in the res folder as static resources
global.router = express.Router();
app.use('/res', express.static('res'));
app.use(process.env.BASE_URL, router);
global.dakSensors = require("./logic/dakSensors")
global.dakUserLogic = require("./logic/dakUserLogic")
global.dakActuators = require("./logic/dakActuators")
require("./routers/routers")
app.listen(process.env.PORT);
console.log("Listening for HTTPS traffic on port:", process.env.PORT)
module.exports = app;
