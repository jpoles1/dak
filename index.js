require('dotenv').config();
if(!process.env.PORT) throw new Error("Need a valid server port.");
global.db = require("./logic/dakDB");
var express = require("express");
var bodyParser = require('body-parser');
//Create express server
var app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Sets the template engine to be handlebars
var dotengine = require('express-dot-engine');
app.engine('dot', dotengine.__express);
app.set('views', './views');
app.set('view engine', 'dot');
//Serves all files in the res folder as static resources
//global.router = express.Router();
app.use('/res', express.static('res'));
//app.use(process.env.BASE_URL, router);
app.listen(process.env.PORT);
console.log("Listening for HTTPS traffic on port:", process.env.PORT)
module.exports = app;
