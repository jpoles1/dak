var dakActuators = {};
global.actuator_list = {};
global.actuator_types = ["433 MHz", "IR"]
dakActuators.loadActuators = function(){
  db.find({type: "actuator", "active": 1}).sort({outlet: 1 }).exec(function(err, docs){
    actuator_list = docs;
  })
}
dakActuators.addActuator = function(name, outlet, cb){
  actuator_entry = {
    "type": "actuator",
    name, outlet,
    "active": 1
  }
  db.insert(actuator_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    dakActuators.loadActuators()
    cb();
  })
}
dakActuators.removeActuator = function(id){
  db.update({type: "actuator", "id": id}, {active: 0})
}
module.exports = dakActuators;
