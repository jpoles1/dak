var dakSleep = {}
global.wake_list = []; //list of actuator _ids which should be switched upon wake
dakSleep.goToSleep = function(cb){
  for(actuator_id in actuator_list){
    actuator = actuator_list[actuator_id]
    if(actuator.state.on  == 1){
      wake_list.push(actuator_id)
    }
  }
  if(wake_list.length > 0){
    db.config.find({active: 1, type: "actuator_command", api_name: "off", actuator: {$in: wake_list}})
    .exec(function(err, docs){
      for(i in docs){
        command = docs[i]
        if(command.active == 1){
          console.log(command)
          dakActuators.sendActuatorCommand(command)
        }
      }
      cb("Going to sleep...");
    })
  }
  else{
    cb("No devices to put to sleep...");
  }
}
//To be run every time a command is run
dakSleep.wakeUp = function(cb){
  if(wake_list.length > 0){
    db.config.find({active: 1, type: "actuator_command", api_name: "on", actuator: {$in: wake_list}})
    .sort({_id: 1}).exec(function(err, docs){
      for(i in docs){
        command = docs[i]
        if(command.active == 1){
          console.log(command)
          dakActuators.sendActuatorCommand(command)
        }
      }
      cb("Waking up!")
    })
  }
  else{
    cb("I'm already awake")
  }
}
module.exports = dakSleep;
