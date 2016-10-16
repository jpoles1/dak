dakRules = {}
global.rule_list = {};
dakRules.loadRules = function(){
  db.config.find({type: rule, active: 1}).sort({name: 1 }).exec(function(err, docs){
    rule_list = docs;
  })
}
dakRules.createRule = function(name, rule_if, rule_then, rule_else, cb){
  rule_entry = {
    type: "rule",
    name, rule_if, rule_then, rule_else
  }
  db.config.insert(rule_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    cb()
  })
}
module.exports = dakRules;
