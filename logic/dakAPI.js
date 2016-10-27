var dakAPI = {};
//TODO: Create logic that accepts some sort of identifier for each command via a URL and runs the command
dakAPI.generateRoutes = function(){
  api_router = express.Router();
  api_router.get("/:actuator-:cmd", (req, res) => {
    db.config.find({type: "actuator", $or: [{api_name: req.params.actuator}, {name: req.params.actuator}], active: 1})
    .sort({_id: 1}).exec(function(err, docs){
      if(docs.length > 0){
        actuator = docs[0]
        db.config.find({type: "actuator_command", actuator: actuator._id, $or: [{api_name: req.params.cmd}, {name: req.params.cmd}], active: 1})
        .sort({_id: 1}).exec(function(err, docs){
          if(docs.length > 0){
            cmd = docs[0]
            dakActuators.sendActuatorCommand(cmd, () => {})
          }
        })
      }
      res.json(req.params)
    })
  })
  router.use("/api", api_router);
}
module.exports = dakAPI
