Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
require('dotenv').config();
require('./server')
global.ser;
var devMode = parseInt(process.env.devMode)
var serialPort = require("serialport");
serialPort.list(function (err, ports) {
  var myPort = ports.find(function(port){
    var portName = port.comName.split("/")[2].slice(0, -1);
    return portName == "ttyUSB"
  })
  if(typeof myPort == 'undefined' && devMode != 1){
    console.log(new Error("Could not connect to Arduino peripheral."))
    process.exit()
  }
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
      ser = new serialPort(myPort.comName, {
       baudRate: 9600,
       parser: serialPort.parsers.readline("\r\n")
      });
    }
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
  }
})
