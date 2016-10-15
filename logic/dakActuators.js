var dakActuators = {};
global.actuator_list = {};
global.actuator_types = ["433 MHz", "IR"]
dakActuators.loadActuators = function(){
  db.config.find({type: "actuator", active: 1}).sort({outlet: 1 }).exec(function(err, docs){
    actuator_list = docs;
  })
}
dakActuators.addActuator = function(name, signal_type, cb){
  actuator_entry = {
    type: "actuator",
    name, signal_type,
    active: 1
  }
  db.config.insert(actuator_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    dakActuators.loadActuators()
    cb();
  })
}
dakActuators.addActuatorCommand = function(name, signal_type, cb){
  actuator_entry = {
    type: "actuator_command",
    name, signal_type,
    active: 1
  }
  db.config.insert(actuator_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    dakActuators.loadActuators()
    cb();
  })
}
dakActuators.removeActuator = function(id){
  db.config.update({type: "actuator", "id": id}, {active: 0})
}
dakActuators.removeActuatorCommand = function(id){
  db.config.update({type: "actuator_command", "id": id}, {active: 0})
}
module.exports = dakActuators;
