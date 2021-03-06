var dakActuators = {};
global.actuator_types = {"433 MHz": "433", "IR": "IR", "315 MHz": "315"}
global.actuator_list = {}; //list of form _id: {actuator info}
dakActuators.countOutlets = function(){
  onct = 0;
  for(actuator_id in actuator_list){
    actuator = actuator_list[actuator_id]
    onct += actuator.state.on
  }
  return onct
}
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
  api_name = name.replace(/\W/g, '').toLowerCase()
  actuator_entry = {
    type: "actuator",
    name, api_name, signal_type,
    active: 1
  }
  db.config.find({name}, (err, docs) => {
    if(docs.length != 0){
      console.log("Non-unique name.") //Show this error to the user.
    }
    else{
      db.config.insert(actuator_entry, (err) => {
        if(err){
          console.log("Failed to add entry to DB")
          return 1;
        }
        dakActuators.loadActuators()
        cb();
      })
    }
  })
}
dakActuators.addActuatorCommand = function(name, actuator, signal, cb){
  api_name = name.replace(/\W/g, '').toLowerCase()
  actuatorCommand_entry = {
    type: "actuator_command",
    name, api_name, actuator, signal,
    active: 1
  }
  db.config.insert(actuatorCommand_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    dakActuators.loadActuators()
    cb();
  })
}
dakActuators.sendActuatorCommand = function(command, cb){
  if(command.name.toLowerCase() == "on"){
    //Resets the list of sleeping devices (to be woken up later), as there has been new interaction.
    dakSleep.wake_list = [];
    actuator_list[command.actuator].state.on = 1
  }
  if(command.name.toLowerCase() == "off"){
    actuator_list[command.actuator].state.on = 0
  }
  command = actuator_types[actuator_list[command.actuator].signal_type]+":"+command.signal+";\n";
  console.log("Sending command:", command)
  ser.write(command)
}
dakActuators.sendActuatorCommandByID = function(id, cb){
  db.config.find({type: "actuator_command", _id: id, active: 1}).sort({_id: 1}).exec(function(err, docs){
    command = docs[0]
    if(command.name.toLowerCase() == "on"){
      actuator_list[command.actuator].state.on = 1
    }
    if(command.name.toLowerCase() == "off"){
      actuator_list[command.actuator].state.on = 0
    }
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
    dakActuators.loadActuators()
    cb()
  })
}
dakActuators.loadActuators()
module.exports = dakActuators;
