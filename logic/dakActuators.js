var dakActuators = {};
global.actuator_types = ["433 MHz", "IR"]
global.actuator_list = [];
global.actuator_commands = [];
dakActuators.loadActuators = function(){
  db.config.find({type: "actuator", active: 1}).sort({outlet: 1 }).exec(function(err, docs){
    actuator_list = docs;
    dakActuators.loadActuatorCommands()
  })
}
dakActuators.loadActuatorCommands = function(){
  db.config.find({type: "actuator_command", active: 1, actuator: {$in: actuator_list.map((x) => x._id)}}).sort({outlet: 1 }).exec(function(err, docs){
    command_list = actuator_list.reduce((list, x) => {
      list[x._id] = x;
      list[x._id].commands = [];
      return list;
    }, {});
    actuator_commands = docs.reduce((command_list, command) => {
      command_list[command.actuator].commands.push(command)
      return command_list
    }, command_list)
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
dakActuators.addActuatorCommand = function(name, actuator, signal, cb){
  actuatorCommand_entry = {
    type: "actuator_command",
    name, actuator, signal,
    active: 1
  }
  db.config.insert(actuatorCommand_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    dakActuators.loadActuatorCommands()
    cb();
  })
}
dakActuators.removeActuator = function(id){
  db.config.update({type: "actuator", "id": id}, {active: 0})
}
dakActuators.removeActuatorCommand = function(id){
  db.config.update({type: "actuator_command", "id": id}, {active: 0})
}
dakActuators.loadActuators()
module.exports = dakActuators;
