var dakSensors = {};
global.sensor_list = {
  "temp": undefined,
  "humid": undefined,
  "photo": undefined,
  "motion": undefined,
  "last_motion": undefined,
  "motionct": 0,
  "hour": undefined,
  "outlets_on": undefined
};
setInterval(() => {
  sensor_list["motionct"] = 0
}, 5*60*1000)
dakSensors.logStatus = function(){
  var numoutlets = dakActuators.countOutlets();
  sensor_entry = {
    "type": "sensorlog",
    "time": new Date(),
    "motion": sensor_list["motion"],
    "motionct": sensor_list["motionct"], //Variable used to store the number of PIR trips in the past X minutes.
    "last_motion": sensor_list["last_motion"], //Variable used to store the number of sensor readings since last motion
    "temp": sensor_list["temp"],
    "humid": sensor_list["humid"],
    "outlets_on": numoutlets
  }
  db.activity.insert(sensor_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    //console.log("Added entry to DB:", sensor_entry)
  })
}
var report_ct = 1000;
dakSensors.parseSensors = function(rawdata){
  report_ct+=1;
  var sensors = rawdata.toLowerCase().substring(0, rawdata.length-1).split(";");
  sensors.forEach(function(elem){
    var keywords = elem.split(":")
    if(keywords[0] == "motion" && keywords[1]=="1"){
      sensor_list["motionct"] +=1;
      sensor_list["last_motion"] = 0;
    }
    else{
      sensor_list["last_motion"] +=1;
    }
    if(["motion", "temp", "humid", "photo"].contains(keywords[0])){
      sensor_list[keywords[0]] = parseInt(keywords[1]);
    }
  })
  var d = new Date()
  sensor_list.hour = d.getHours()
  if(report_ct>60*2.5){ //every 2.5 minutes
    dakSensors.logStatus()
    report_ct=0;
  }
  //When sensors are updated, check rules for changes.
  dakRules.checkRules(()=>{
    sensor_list["outlets_on"] = dakActuators.countOutlets()
  })
}
module.exports = dakSensors;
