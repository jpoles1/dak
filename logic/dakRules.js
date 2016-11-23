dakRules = {}
global.rule_list = {};
dakRules.loadRules = function(cb){
  db.config.find({type: "rule", active: 1}).sort({name: 1 }).exec(function(err, docs){
    rule_list = docs;
    for(rule_id in rule_list){
      rule_list[rule_id].in_use = 0;
    }
    if(cb) cb()
  })
}
//TODO: Create logic that checks each rule to see if it has been triggered given current sensor info
//Sensr info found in the sensor_list object
dakRules.checkRules = function(cb){
  for(rule_id in rule_list){
    rule = rule_list[rule_id]
    console.log(rule)
    if(rule.active==1 && rule.rule_if){
      console.log(sensor_list[rule.rule_if.sensor]+" "+rule.rule_if.comparator+" "+rule.rule_if.value)
      if(eval(sensor_list[rule.rule_if.sensor]+" "+rule.rule_if.comparator+" "+rule.rule_if.value)){
        if(rule.rule_then & !rule.in_use){
          console.log(rule.rule_then)
          if(rule.rule_then.command_id){
            dakActuators.sendActuatorCommandByID(rule.rule_then.command_id)
          }
          else{
            if(rule.rule_then.command_name == "sleep"){
              console.log("Rule says go to sleep.")
              dakSleep.gotoSleep((msg) => console.log(msg))
            }
            if(rule.rule_then.command_name == "wake"){
              dakSleep.wakeUp()
            }
          }
          rule.in_use = 1;
        }
      }
      else{
        rule.in_use = 0;
      }
    }
  }
  if(cb){cb()}
}
dakRules.createRule = function(name, rule_if, rule_then, cb){
  rule_entry = {
    type: "rule", active: 1,
    name, rule_if, rule_then
  }
  db.config.insert(rule_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    dakRules.loadRules()
    cb()
  })
}
dakRules.deleteRule = function(id, cb){
  db.config.update({type: "rule", _id: id}, {active: 0}, ()=>{
    dakRules.loadRules()
    cb()
  })
}
dakRules.loadRules(() => {
  dakRules.checkRules()
})
module.exports = dakRules;
