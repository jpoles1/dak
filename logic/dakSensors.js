var dakSensors = {};
global.sensor_list = {
  
};
dakSensors.logStatus = function(){
  var numoutlets = dakMonitor.countOutlets();
  sensor_entry = {
    "type": "sensorlog",
    "time": new Date(),
    "pir": room_status["pir"],
    "pirct": room_status["pirct"], //Variable used to store the number of PIR trips in the past X minutes.
    "temp": room_status["temp"],
    "humid": room_status["humid"],
    "outlets_on": numoutlets
  }
  db.insert(sensor_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    console.log("Added entry to DB:", sensor_entry)
  })
}
dakSensors.parseSensors = function(rawdata){
  var sensors = rawdata.toLowerCase().substring(0, rawdata.length-1).split(";");
  sensors.forEach(function(elem){
    var keywords = elem.split(":")
    room_status[keywords[0]] = parseInt(keywords[1]);
  })
}
module.exports = dakSensors;
