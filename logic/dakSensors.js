var dakSensors = {};
global.sensor_list = {
  "temp": undefined,
  "humid": undefined,
  "photo": undefined,
  "motion": undefined,
  "hour": undefined
};
dakSensors.logStatus = function(){
  var numoutlets = dakMonitor.countOutlets();
  sensor_entry = {
    "type": "sensorlog",
    "time": new Date(),
    "pir": sensor_list["pir"],
    "pirct": sensor_list["pirct"], //Variable used to store the number of PIR trips in the past X minutes.
    "temp": sensor_list["temp"],
    "humid": sensor_list["humid"],
    "outlets_on": numoutlets
  }
  db.activity.insert(sensor_entry, (err) => {
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
    sensor_list[keywords[0]] = parseInt(keywords[1]);
  })
  var d = new Date()
  sensor_list.hour = d.getHours()
  console.log(sensor_list.time)
  //When sensors are updated, check rules for changes.
  dakRules.checkRules()
}
module.exports = dakSensors;
