dakRules = {}
dakRules.createRule = function(name, rule_if, rule_then, rule_else, cb){
  rule_entry = {name, rule_if, rule_then, rule_else}
  db.config.insert(rule_entry, (err) => {
    if(err){
      console.log("Failed to add entry to DB")
      return 1;
    }
    cb()
  })
}
module.exports = dakRules;
