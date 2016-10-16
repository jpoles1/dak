var dakActuators = {};
global.actuator_types = {"433 MHz": "433", "IR": "IR", "315 MHz": "315"}
global.actuator_list = [];
dakActuators.loadActuators = function(){
  db.config.find({type: "actuator", active: 1}).sort({name: 1 }).exec(function(err, docs){
    actuator_list = docs;
    dakActuators.loadActuatorCommands()
  })
}
dakActuators.loadActuatorCommands = function(){
  db.config.find({type: "actuator_command", active: 1, actuator: {$in: actuator_list.map((x) => x._id)}}).sort({_id: -1 }).exec(function(err, docs){
    command_list = actuator_list.reduce((list, x) => {
      list[x._id] = x;
      list[x._id].state = {on: 0, override: 0, last_command: undefined};
      list[x._id].commands = [];
      return list;
    }, {});
    actuator_list = docs.reduce((command_list, command) => {
      command_list[command.actuator].commands.push(command)
      return command_list
    }, command_list)
    dakAPI.generateRoutes()
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
dakActuators.sendActuatorCommand = function(id, cb){
  db.config.find({type: "actuator_command", _id: id, active: 1}).sort({_id: 1}).exec(function(err, docs){
    command = docs[0]
    console.log(actuator_list[command.actuator].signal_type)
    command = actuator_types[actuator_list[command.actuator].signal_type]+":"+command.signal+";\n";
    console.log("Sending command:", command)
    ser.write(command)
  })
}
dakActuators.deleteActuator = function(id, cb){
  db.config.update({type: "actuator", "id": id}, {active: 0}, ()=>{
    dakActuators.loadActuators()
    cb()
  })
}
dakActuators.deleteActuatorCommand = function(id, cb){
  db.config.update({type: "actuator_command", _id: id}, {active: 0}, {}, ()=>{
    dakActuators.loadActuatorCommands()
    cb()
  })
}
dakActuators.loadActuators()
module.exports = dakActuators;
