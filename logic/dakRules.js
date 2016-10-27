dakRules = {}
global.rule_list = {};
dakRules.loadRules = function(cb){
  db.config.find({type: "rule", active: 1}).sort({name: 1 }).exec(function(err, docs){
    rule_list = docs;
    for(rule_id in rule_list){
      rule_list[rule_id].active = 0;
    }
    if(cb) cb()
  })
}
//TODO: Create logic that checks each rule to see if it has been triggered given current sensor info
//Sensr info found in the sensor_list object
dakRules.checkRules = function(){
  for(rule_id in rule_list){
    rule = rule_list[rule_id]
    if(rule.active!=0 && rule.rule_if && eval(sensor_list[rule.rule_if.sensor]+" "+rule.rule_if.comparator+" "+rule.rule_if.value)){
      console.log(sensor_list[rule.rule_if.sensor]+" "+rule.rule_if.comparator+" "+rule.rule_if.value)
      console.log(rule.rule_then)
      if(rule.rule_then){
        rule.active=1
        console.log(rule_list[rule_id].active)
        dakActuators.sendActuatorCommandByID(rule.rule_then.command_id)
      }
    }
  }
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
