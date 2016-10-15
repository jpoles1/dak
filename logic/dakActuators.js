var dakActuator = {};
global.actuator_list = {};
dakActuator.loadActuators = function(){
  db.find({type: "actuator", "active": 1}, function(err, docs){
    actuator_list = docs;
  })
}
dakActuator.addActuator = function(id, name, outlet){
  actuator_entry = {
    "type": "actuator",
    id, name, outlet,
    "active": 1
  }
  db.insert(actuator_entry)
}
dakActuator.removeActuator = function(id){
  db.update({type: "actuator", "id": id}, {active: 0})
}
module.exports = dakActuator;
