dakRules = {}
global.rule_list = {};
dakRules.loadRules = function(){
  db.config.find({type: "rule", active: 1}).sort({name: 1 }).exec(function(err, docs){
    rule_list = docs;
    console.log(rule_list)
  })
}
//TODO: Create logic that checks each rule to see if it has been triggered given current sensor info
//Sensr info found in the sensor_list object
dakRules.checkRules = function(){
  for(rule_id in rule_list){
    rule = rule_lost[rule_id]
    console.log(rule)
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
dakRules.loadRules()
module.exports = dakRules;
