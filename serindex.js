require('dotenv').config();
var ser;
var serialPort = require("serialport");
serialPort.list(function (err, ports) {
  var myPort = ports.find(function(port){
    var portName = port.comName.split("/")[2].slice(0, -1);
    return portName == "ttyUSB"
  })
  if(typeof myPort === 'undefined' && process.env.devMode != 1){
    throw new Error("Could not connect to Arduino peripheral.");
  }
  console.log(myPort)
  else{
    if(typeof myPort === 'undefined'){
      ser = {};
      ser.open = function(fun){
        fun();
      }
      ser.on = function(param, fun){}
      ser.write = function(t){}
    }
    else{
      ser = new serialPort.SerialPort(myPort.comName, {
       baudRate: 9600,
       parser: serialPort.parsers.readline("\r\n")
      }, false);
    }
    ser.open(function (err) {
      if(err) console.log('err ' + err);
      else{
        ser.on('data', function(rawdata) {
          var keywords = rawdata.toLowerCase().split(":");
          if(["pir", "temp", "humid", "photo"].contains(keywords[0])){
            dakSensors.parseSensors(rawdata)
          }
          else{
            console.log('data received: ' + rawdata);
          }
        });
        ser.on('close', function(){
          process.exit()
        });
        //Setup Express (our web server) and other express reqs
        var http = require("http")
        var fs = require("fs")
        var https = require("https")
        var express = require("express");
        var exphbs  = require('express-handlebars');
        var favicon = require('serve-favicon');
        var bodyParser = require('body-parser');
        //Create express server
        var app = express()
        //Sets the template engine to be handlebars
        var dotengine = require('express-dot-engine');
        app.engine('dot', dotengine.__express);
        app.set('views', './views');
        app.set('view engine', 'dot');
        //Set server favicon
        app.use(favicon(__dirname + '/res/favicon.ico'));
        //Sets up the parser which can parse information out of HTTP POST requests
        app.use(bodyParser.urlencoded({ extended: true }));
        //Serves all files in the res folder as static resources
        app.use('/res', express.static('res'));
        global.router = express.Router();
        app.use(process.env.BASE_URL, router);
        app.listen(PORT);
        module.exports = app;
      }
    })
  }
})
